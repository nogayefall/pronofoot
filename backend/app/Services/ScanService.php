<?php

namespace App\Services;

use App\Jobs\SendAlertNotification;
use App\Jobs\SendQuotaNotification;
use App\Logging\SecretRedactor;
use App\Models\Alert;
use App\Models\MatchSnapshot;
use App\Models\OpportunityLog;
use App\Models\RuleProfile;
use App\Models\TrackedMatch;
use App\Providers\Contracts\FootballProvider;
use App\Providers\Contracts\OddsProvider;
use App\Providers\Data\FootballFeed;
use App\Providers\Data\FootballMatch;
use App\Providers\Data\OddsFeed;
use App\Providers\Data\OddsMatch;
use App\Providers\Data\ProviderUnavailable;
use App\Rules\EngineResult;
use App\Rules\RuleConfiguration;
use App\Rules\RuleEngine;
use App\Rules\RuleInput;
use App\Rules\VitalityCalculator;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class ScanService
{
    private ?CarbonImmutable $lastOddsFetchAt = null;

    /** @var list<array{match: string, type: string, reason: string}> */
    private array $incidents = [];

    private ?OddsFeed $cachedOddsFeed = null;

    public function __construct(
        private readonly FootballProvider $footballProvider,
        private readonly OddsProvider $oddsProvider,
        private readonly RuleEngine $ruleEngine,
        private readonly ScanSettings $settings,
        private readonly RuleConfigurationFactory $ruleConfigurationFactory,
        private readonly VitalityCalculator $vitalityCalculator = new VitalityCalculator,
    ) {}

    public function runOnce(int $scanNumber = 0, bool $forceRefresh = true): ScanPassResult
    {
        $now = CarbonImmutable::now();
        $this->incidents = [];
        Cache::put('pronofoot.scan.last_pass_at', $now->toIso8601String(), $now->addDays(30));
        $settingValues = $this->settings->all();
        $oddsInterval = $this->settings->integer($settingValues, 'scan.odds_interval_seconds');
        $statisticsInterval = $this->settings->integer($settingValues, 'scan.statistics_interval_seconds');
        $goalInterval = $this->settings->integer($settingValues, 'scan.goal_interval_seconds');
        $goalWindow = $this->settings->integer($settingValues, 'scan.goal_window_seconds');
        $quotaAlertThreshold = null;
        $economyPercent = $this->settings->decimal($settingValues, 'scan.quota_economy_percent');
        $autoMode = ($settingValues['scan.auto_mode'] ?? false) === true;
        $autoLeagueIds = array_values(array_map('intval', is_array($settingValues['scan.auto_league_ids'] ?? null)
            ? $settingValues['scan.auto_league_ids']
            : []));
        $vitalityScale = is_array($settingValues['rules.vitality_normalization_references'] ?? null)
            ? $settingValues['rules.vitality_normalization_references']
            : VitalityCalculator::DEFAULT_SCALE;
        $expiredAlerts = $this->expireAlerts($now);
        $trackedMatches = TrackedMatch::query()->where('is_active', true)->get();

        if ($trackedMatches->isEmpty() && ! $autoMode) {
            return new ScanPassResult(0, 0, 0, $expiredAlerts, 0, 0, $oddsInterval, incidents: $this->incidents);
        }

        $previousFootballStatus = Cache::get('pronofoot.provider_status', [])['football'] ?? [];
        $economyMode = QuotaGuard::mode(
            is_int($previousFootballStatus['requestsRemaining'] ?? null) ? $previousFootballStatus['requestsRemaining'] : null,
            is_int($previousFootballStatus['requestsLimit'] ?? null) ? $previousFootballStatus['requestsLimit'] : null,
            $economyPercent,
        ) === QuotaGuard::ECONOMY;
        $dueMatches = $this->dueMatches($trackedMatches, $settingValues, $economyMode, $forceRefresh, $now);
        $dueMatchIds = $dueMatches->pluck('id')->all();
        $matchesNotScanned = count($trackedMatches) - count($dueMatches);
        $includeStatistics = $dueMatches->isNotEmpty();
        $footballFeed = $this->fetchFootball(
            $scanNumber,
            $includeStatistics,
            $trackedMatches,
            $quotaAlertThreshold,
            $now,
            $autoMode ? $autoLeagueIds : null,
            $dueMatches,
        );
        if ($footballFeed === null) {
            return new ScanPassResult(
                count($trackedMatches),
                0,
                0,
                $expiredAlerts,
                0,
                count($trackedMatches),
                $this->nextPollInterval($settingValues, $now),
                incidents: $this->incidents,
            );
        }

        $this->notifyQuotaTransition($footballFeed->requestsRemaining, $footballFeed->requestsLimit, $economyPercent);
        if ($footballFeed->quotaThresholdReached
            || QuotaGuard::reached($footballFeed->requestsRemaining, $quotaAlertThreshold)) {
            return $this->stopForQuota($trackedMatches, $footballFeed->requestsRemaining, $quotaAlertThreshold, $expiredAlerts, $settingValues, $now);
        }

        if ($footballFeed->driver === 'fake') {
            foreach (['tendance_source', 'tendance_seuil_stable'] as $key) {
                if (($settingValues[$key] ?? null) === null) {
                    $settingValues[$key] = $footballFeed->simulationSettings[$key] ?? null;
                }
            }
        }

        $footballMatches = $this->indexMatches($footballFeed->matches);
        $goalCount = $this->detectGoals($trackedMatches, $footballMatches, $now);
        $goalWindowActive = $this->hasRecentGoal($trackedMatches, $now, $goalWindow);
        $effectiveOddsInterval = $goalWindowActive ? $goalInterval : $oddsInterval;
        $oddsDue = $forceRefresh
            || $goalCount > 0
            || $this->cachedOddsFeed === null
            || $this->lastOddsFetchAt === null
            || $this->lastOddsFetchAt->addSeconds($effectiveOddsInterval)->lessThanOrEqualTo($now);
        $oddsUnavailableReason = null;
        $oddsFailureEventType = 'odds_provider_unavailable';

        if ($oddsDue) {
            $this->cachedOddsFeed = null;
            $this->lastOddsFetchAt = null;

            try {
                $halftimeTracked = $trackedMatches->contains(function (TrackedMatch $trackedMatch) use ($footballMatches): bool {
                    $match = $footballMatches[$trackedMatch->provider_match_id] ?? null;

                    return $match instanceof FootballMatch && strcasecmp($match->status, 'Halftime') === 0;
                });
                $oddsFeed = $this->oddsProvider->getLiveOdds($scanNumber, includeUnder25: $halftimeTracked);
                $this->rememberProviderStatus('odds', [
                    'driver' => $oddsFeed->driver,
                    'requestsUsed' => $oddsFeed->requestsUsed,
                    'requestsRemaining' => $oddsFeed->requestsRemaining,
                    'checkedAt' => $now->toIso8601String(),
                    'message' => $oddsFeed->statusMessage,
                ]);
                if ($oddsFeed->reachable === true && $oddsFeed->exactScoreMarketAvailable) {
                    $this->cachedOddsFeed = $oddsFeed;
                    $this->lastOddsFetchAt = $now;
                } else {
                    $oddsUnavailableReason = $oddsFeed->statusMessage;
                    $oddsFailureEventType = ! $oddsFeed->exactScoreMarketAvailable
                        ? 'odds_market_unavailable'
                        : 'odds_provider_unavailable';
                }
            } catch (ProviderUnavailable $exception) {
                $this->rememberProviderStatus('odds', [
                    'driver' => config('services.pronofoot.odds_driver'),
                    'requestsUsed' => null,
                    'requestsRemaining' => null,
                    'checkedAt' => $now->toIso8601String(),
                    'message' => $exception->getMessage(),
                ]);
                $oddsUnavailableReason = $exception->getMessage();
                Log::warning('Fournisseur Odds indisponible pendant le scan.', ['reason' => $exception->getMessage()]);
            }
        }

        $oddsFeed = $this->cachedOddsFeed;
        $quotaStopped = $oddsDue
            && $oddsFeed !== null
            && QuotaGuard::reached($oddsFeed->requestsRemaining, $quotaAlertThreshold);
        if ($oddsDue && $oddsFeed !== null) {
            $this->notifyQuotaTransition($oddsFeed->requestsRemaining, $oddsFeed->requestsLimit, $economyPercent);
        }

        if ($quotaStopped) {
            $this->logQuotaStop($oddsFeed->requestsRemaining, $quotaAlertThreshold);
        }

        if ($oddsFeed !== null) {
            $this->rememberProviderStatus('odds', [
                'driver' => $oddsFeed->driver,
                'requestsUsed' => $oddsFeed->requestsUsed,
                'requestsRemaining' => $oddsFeed->requestsRemaining,
                'checkedAt' => $now->toIso8601String(),
                'message' => $oddsFeed->statusMessage,
            ]);
        }
        $oddsMatches = $oddsFeed === null ? [] : $this->indexMatches($oddsFeed->matches);
        $autoTracked = $autoMode ? $this->syncAutomaticMatches($footballFeed, $oddsMatches, $autoLeagueIds) : 0;
        $profile = RuleProfile::query()->where('is_active', true)->first();
        $alertsCreated = 0;
        $snapshotsStored = 0;
        $errors = 0;

        foreach ($trackedMatches as $trackedMatch) {
            try {
                $footballMatch = $footballMatches[$trackedMatch->provider_match_id] ?? null;
                if ($footballMatch === null || ! $this->isInPlay($footballMatch)) {
                    $this->recordIncident($trackedMatch, 'football_data_missing', $footballMatch === null ? 'Match introuvable dans le flux en direct.' : 'Match non en cours selon le flux (statut : '.$footballMatch->status.').', $now);
                    $errors++;

                    continue;
                }

                if ($footballMatch->homeScore === null || $footballMatch->awayScore === null || $footballMatch->minute === null) {
                    $this->recordIncident($trackedMatch, 'football_data_missing', 'Le score ou la minute du match est indisponible.', $now);
                    $errors++;

                    continue;
                }

                $oddsMatch = $oddsMatches[$trackedMatch->provider_match_id] ?? null;
                $isDue = in_array($trackedMatch->id, $dueMatchIds, true);
                $snapshot = $this->storeSnapshot(
                    $trackedMatch,
                    $footballMatch,
                    $oddsMatch,
                    $isDue,
                    $statisticsInterval,
                    $vitalityScale,
                    $now,
                );
                $snapshotsStored++;

                if (! $isDue) {
                    $this->refreshTrendForClassification($trackedMatch, $snapshot, $footballMatch, $oddsMatch, $settingValues, $now);

                    continue;
                }

                $trackedMatch->forceFill(['last_scanned_at' => $now])->save();
                $statisticsFailure = $footballFeed->statisticsFailures[$trackedMatch->provider_match_id] ?? null;
                if ($statisticsFailure !== null) {
                    $this->recordIncident(
                        $trackedMatch,
                        'statistics_unavailable',
                        'Statistiques indisponibles : '.$statisticsFailure.' Aucune vitalité ni alerte pour ce match.',
                        $now,
                        $snapshot,
                    );
                    $errors++;

                    continue;
                }

                $halftime = strcasecmp($footballMatch->status, 'Halftime') === 0;
                if (! $halftime && ($oddsMatch?->stopped === true || $footballMatch->stopped === true)) {
                    $this->recordIncident(
                        $trackedMatch,
                        'match_stopped',
                        'Match arrêté par le fournisseur : aucune alerte, statistiques conservées.',
                        $now,
                        $snapshot,
                    );

                    continue;
                }

                if ($oddsFeed === null || $oddsMatch === null) {
                    $this->recordIncident(
                        $trackedMatch,
                        $oddsFeed === null ? $oddsFailureEventType : 'odds_data_missing',
                        $oddsUnavailableReason ?? 'Les cotes de scores exacts à jour sont indisponibles ; aucune donnée précédente n’est réutilisée.',
                        $now,
                        $snapshot,
                    );
                    $errors++;

                    continue;
                }

                if ($profile === null) {
                    $this->recordOpportunity(
                        $trackedMatch,
                        $snapshot,
                        null,
                        'evaluation',
                        'no_alert',
                        'Aucun profil de règles actif n’est configuré.',
                        $now,
                    );

                    continue;
                }

                $snapshotAge = $snapshot->statistics_captured_at === null
                    ? null
                    : CarbonImmutable::instance($snapshot->statistics_captured_at);
                $vitality = $snapshotAge !== null
                    && $snapshotAge->addSeconds($statisticsInterval)->greaterThanOrEqualTo($now)
                    ? $snapshot->vitality_score
                    : null;
                $configuration = $this->ruleConfigurationFactory->make($profile, $settingValues);
                $input = new RuleInput(
                    homeScore: $footballMatch->homeScore,
                    awayScore: $footballMatch->awayScore,
                    exactScoreOdds: $oddsMatch->exactScoreOdds,
                    vitalityScore: $vitality,
                    methodScores: $footballMatch->methodScores,
                    halftime: $halftime,
                    under25Odds: $oddsMatch->under25Odds,
                );
                $suggestedScoreKey = $this->ruleEngine->suggestedExactScoreKey($input, $configuration);
                $trendChange = $this->calculateTrendChange(
                    $trackedMatch,
                    $oddsMatch->exactScoreOdds,
                    $suggestedScoreKey,
                    $this->settings->nullableString($settingValues, 'tendance_source'),
                    $this->settings->nullableFloat($settingValues, 'tendance_seuil_stable'),
                    $now,
                );
                $snapshot->forceFill(['odds_change_percent' => $trendChange])->save();
                $result = $this->ruleEngine->evaluate(
                    new RuleInput(
                        homeScore: $footballMatch->homeScore,
                        awayScore: $footballMatch->awayScore,
                        exactScoreOdds: $oddsMatch->exactScoreOdds,
                        vitalityScore: $vitality,
                        oddsChangePercent: $trendChange,
                        methodScores: $footballMatch->methodScores,
                        halftime: $halftime,
                        under25Odds: $oddsMatch->under25Odds,
                    ),
                    $configuration,
                );

                $alertsCreated += $this->recordDecision($trackedMatch, $snapshot, $profile, $result, $footballMatch, $now);
            } catch (Throwable $exception) {
                $errors++;
                $this->recordProcessingError($trackedMatch, $exception, $now);
            }
        }

        return new ScanPassResult(
            count($trackedMatches),
            $snapshotsStored,
            $alertsCreated,
            $expiredAlerts,
            $goalCount,
            $errors,
            $this->nextPollInterval($settingValues, $now),
            $quotaStopped,
            $this->incidents,
            economyMode: $economyMode,
            matchesNotScanned: $matchesNotScanned,
            autoTracked: $autoTracked,
        );
    }

    /**
     * Fréquences de scan permanentes (annexe, section 6) : un match chaud est scanné toutes les 30 s, un match calme
     * toutes les 2 min, un match sans opportunité (écart au-delà du seuil d’arrêt) n’est pas scanné. En mode économie,
     * seuls les matchs chauds sont scannés. Le classement vient du dernier instantané, rafraîchi à chaque passage sans
     * appel supplémentaire ; un match jamais scanné est dû immédiatement (hors économie s’il n’est pas chaud).
     * « Scanné » signifie : statistiques demandées (appel facturé) puis évaluation par le moteur de règles.
     *
     * @param  Collection<int, TrackedMatch>  $trackedMatches
     * @param  array<string, int|float|bool|array|string|null>  $settings
     * @return Collection<int, TrackedMatch>
     */
    private function dueMatches(
        Collection $trackedMatches,
        array $settings,
        bool $economyMode,
        bool $forceRefresh,
        CarbonImmutable $now,
    ): Collection {
        $hotInterval = $this->settings->integer($settings, 'scan.hot_interval_seconds');
        $calmInterval = $this->settings->integer($settings, 'scan.calm_interval_seconds');
        $hotGap = $this->settings->decimal($settings, 'scan.hot_gap_threshold');
        $noScanGap = $this->settings->decimal($settings, 'scan.no_scan_gap_threshold');
        $trendThreshold = $this->settings->nullableFloat($settings, 'tendance_seuil_stable');

        return $trackedMatches->filter(function (TrackedMatch $trackedMatch) use ($hotInterval, $calmInterval, $hotGap, $noScanGap, $trendThreshold, $economyMode, $forceRefresh, $now): bool {
            $snapshot = $trackedMatch->snapshots()->latest('captured_at')->latest('id')->first();
            $heat = $this->matchHeat($snapshot, $hotGap, $noScanGap, $trendThreshold);
            if ($heat === 'none' || ($economyMode && $heat !== 'hot')) {
                return false;
            }

            if ($forceRefresh || $trackedMatch->last_scanned_at === null) {
                return true;
            }

            return CarbonImmutable::instance($trackedMatch->last_scanned_at)
                ->addSeconds($heat === 'hot' ? $hotInterval : $calmInterval)
                ->lessThanOrEqualTo($now);
        })->values();
    }

    /**
     * Instantané d’un match non scanné à ce passage : la tendance est calculée sur les cotes globales déjà reçues,
     * pour que le classement chaud / calme reste à jour sans appel ni évaluation.
     *
     * @param  array<string, int|float|bool|array|string|null>  $settings
     */
    private function refreshTrendForClassification(
        TrackedMatch $trackedMatch,
        MatchSnapshot $snapshot,
        FootballMatch $footballMatch,
        ?OddsMatch $oddsMatch,
        array $settings,
        CarbonImmutable $now,
    ): void {
        if ($oddsMatch === null || $footballMatch->homeScore === null || $footballMatch->awayScore === null) {
            return;
        }

        $suggestedScoreKey = $this->ruleEngine->suggestedExactScoreKey(
            new RuleInput($footballMatch->homeScore, $footballMatch->awayScore, $oddsMatch->exactScoreOdds),
            new RuleConfiguration,
        );
        $snapshot->forceFill(['odds_change_percent' => $this->calculateTrendChange(
            $trackedMatch,
            $oddsMatch->exactScoreOdds,
            $suggestedScoreKey,
            $this->settings->nullableString($settings, 'tendance_source'),
            $this->settings->nullableFloat($settings, 'tendance_seuil_stable'),
            $now,
        )])->save();
    }

    /**
     * @return 'hot'|'calm'|'none'
     */
    public function matchHeat(?MatchSnapshot $snapshot, float $hotGap, float $noScanGap, ?float $trendThreshold = null): string
    {
        if ($snapshot === null || ! is_array($snapshot->exact_score_odds)
            || $snapshot->home_score === null || $snapshot->away_score === null) {
            return 'calm';
        }

        $falling = $trendThreshold !== null
            && $snapshot->odds_change_percent !== null
            && (float) $snapshot->odds_change_percent < -$trendThreshold;
        $gap = $this->ruleEngine->evaluate(
            new RuleInput(
                homeScore: (int) $snapshot->home_score,
                awayScore: (int) $snapshot->away_score,
                exactScoreOdds: $snapshot->exact_score_odds,
            ),
            new RuleConfiguration,
        )->filters['gap']->details['selectedGap'] ?? null;

        return match (true) {
            $falling || (is_numeric($gap) && (float) $gap < $hotGap) => 'hot',
            is_numeric($gap) && (float) $gap > $noScanGap => 'none',
            default => 'calm',
        };
    }

    /**
     * Envoie une alerte de quota par le canal de notification lors d’un passage en mode économie ou épuisé.
     */
    private function notifyQuotaTransition(?int $requestsRemaining, ?int $requestsLimit, float $economyPercent): void
    {
        if ($requestsRemaining === null) {
            return;
        }

        $mode = QuotaGuard::mode($requestsRemaining, $requestsLimit, $economyPercent);
        $previousMode = Cache::get('pronofoot.quota.mode', QuotaGuard::NORMAL);
        if ($mode === $previousMode) {
            return;
        }

        Cache::put('pronofoot.quota.mode', $mode, now()->addDays(2));
        $message = match ($mode) {
            QuotaGuard::ECONOMY => QuotaGuard::economyMessage($requestsRemaining, (int) $requestsLimit, $economyPercent),
            QuotaGuard::EXHAUSTED => QuotaGuard::EXHAUSTED_MESSAGE,
            default => null,
        };
        if ($message === null) {
            Log::info('Quota API revenu à la normale : scan complet rétabli.', ['requests_remaining' => $requestsRemaining]);

            return;
        }

        Log::warning($message, ['requests_remaining' => $requestsRemaining, 'requests_limit' => $requestsLimit]);
        SendQuotaNotification::dispatch($message);
    }

    /**
     * Suivi automatique : matchs live des ligues configurées ayant à la fois les cotes de score exact et une couverture
     * statistique confirmée. Les matchs automatiques absents du flux live sont retirés ; les retraits manuels sont respectés.
     *
     * @param  array<string, FootballMatch|OddsMatch>  $oddsMatches
     * @param  list<int>  $leagueIds
     */
    private function syncAutomaticMatches(FootballFeed $footballFeed, array $oddsMatches, array $leagueIds): int
    {
        $liveIds = [];
        $created = 0;
        foreach ($footballFeed->matches as $match) {
            $liveIds[] = $match->providerMatchId;
            $odds = $oddsMatches[$match->providerMatchId] ?? null;
            if ($match->inPlay !== true
                || ! in_array($match->leagueId, $leagueIds, true)
                || $match->statisticsCoverage !== true
                || ! $odds instanceof OddsMatch
                || $odds->exactScoreOdds === []) {
                continue;
            }

            $trackedMatch = TrackedMatch::query()->firstOrCreate(
                ['provider' => $footballFeed->driver, 'provider_match_id' => $match->providerMatchId],
                [
                    'home_team' => $match->homeTeam,
                    'away_team' => $match->awayTeam,
                    'competition' => $match->competition,
                    'status' => $match->status,
                    'is_active' => true,
                    'tracking_mode' => 'auto',
                ],
            );
            if ($trackedMatch->wasRecentlyCreated) {
                $created++;
            }
        }

        TrackedMatch::query()
            ->where('provider', $footballFeed->driver)
            ->where('tracking_mode', 'auto')
            ->where('is_active', true)
            ->whereNotIn('provider_match_id', $liveIds)
            ->update(['is_active' => false]);

        return $created;
    }

    /**
     * @param  Collection<int, TrackedMatch>  $trackedMatches
     * @param  array<string, int|float|bool|array|string|null>  $settingValues
     */
    private function stopForQuota(
        Collection $trackedMatches,
        ?int $requestsRemaining,
        ?int $quotaAlertThreshold,
        int $expiredAlerts,
        array $settingValues,
        CarbonImmutable $now,
    ): ScanPassResult {
        $reason = $this->logQuotaStop($requestsRemaining, $quotaAlertThreshold);
        foreach ($trackedMatches as $trackedMatch) {
            $this->recordIncident($trackedMatch, 'quota_threshold_reached', $reason, $now);
        }

        return new ScanPassResult(
            count($trackedMatches),
            0,
            0,
            $expiredAlerts,
            0,
            count($trackedMatches),
            $this->nextPollInterval($settingValues, $now),
            true,
            $this->incidents,
        );
    }

    private function logQuotaStop(?int $requestsRemaining, ?int $quotaAlertThreshold): string
    {
        $reason = QuotaGuard::message($requestsRemaining, $quotaAlertThreshold);
        Log::warning($reason, [
            'requests_remaining' => $requestsRemaining,
            'quota_alert_threshold' => $quotaAlertThreshold,
        ]);

        return $reason;
    }

    private function isInPlay(FootballMatch $footballMatch): bool
    {
        return $footballMatch->inPlay ?? $footballMatch->status === 'live';
    }

    /**
     * @param  array<string, int|float|bool|array|string|null>  $settings
     */
    public function nextPollInterval(?array $settings = null, ?CarbonImmutable $now = null): int
    {
        $settings ??= $this->settings->all();
        $now ??= CarbonImmutable::now();
        $goalWindow = $this->settings->integer($settings, 'scan.goal_window_seconds');

        return $this->hasRecentGoal(
            TrackedMatch::query()->where('is_active', true)->get(),
            $now,
            $goalWindow,
        )
            ? $this->settings->integer($settings, 'scan.goal_interval_seconds')
            : $this->settings->integer($settings, 'scan.odds_interval_seconds');
    }

    /**
     * @param  Collection<int, TrackedMatch>  $trackedMatches
     */
    private function fetchFootball(
        int $scanNumber,
        bool $includeStatistics,
        Collection $trackedMatches,
        ?int $quotaAlertThreshold,
        CarbonImmutable $now,
        ?array $autoLeagueIds = null,
        ?Collection $statisticsMatches = null,
    ): ?FootballFeed {
        try {
            $feed = $this->footballProvider->getLiveMatches(
                scanNumber: $scanNumber,
                includeStatistics: $includeStatistics,
                statisticsMatchLimit: null,
                statisticsMatchIds: ($statisticsMatches ?? $trackedMatches)->pluck('provider_match_id')->map(fn ($id): string => (string) $id)->values()->all(),
                includeCoverage: $autoLeagueIds !== null,
                quotaAlertThreshold: $quotaAlertThreshold,
                coverageLeagueIds: $autoLeagueIds,
            );
        } catch (ProviderUnavailable $exception) {
            $this->rememberProviderStatus('football', [
                'driver' => config('services.pronofoot.football_driver'),
                'requestsUsed' => null,
                'requestsRemaining' => null,
                'checkedAt' => $now->toIso8601String(),
                'message' => $exception->getMessage(),
            ]);
            Log::warning('Fournisseur Football indisponible pendant le scan.', ['reason' => $exception->getMessage()]);
            foreach ($trackedMatches as $trackedMatch) {
                $this->recordIncident($trackedMatch, 'football_provider_unavailable', $exception->getMessage(), $now);
            }

            return null;
        }

        $this->rememberProviderStatus('football', [
            'driver' => $feed->driver,
            'requestsUsed' => $feed->requestsUsed,
            'requestsRemaining' => $feed->requestsRemaining,
            'requestsLimit' => $feed->requestsLimit,
            'checkedAt' => $now->toIso8601String(),
            'message' => $feed->statusMessage,
        ]);

        if ($feed->reachable !== true) {
            foreach ($trackedMatches as $trackedMatch) {
                $this->recordIncident($trackedMatch, 'football_provider_unavailable', $feed->statusMessage, $now);
            }

            return null;
        }

        return $feed;
    }

    /**
     * @param  list<FootballMatch>|list<OddsMatch>  $matches
     * @return array<string, FootballMatch|OddsMatch>
     */
    private function indexMatches(array $matches): array
    {
        $indexed = [];
        foreach ($matches as $match) {
            $indexed[$match->providerMatchId] = $match;
        }

        return $indexed;
    }

    /**
     * @param  Collection<int, TrackedMatch>  $trackedMatches
     * @param  array<string, FootballMatch|OddsMatch>  $footballMatches
     */
    private function detectGoals(Collection $trackedMatches, array $footballMatches, CarbonImmutable $now): int
    {
        $goals = 0;
        foreach ($trackedMatches as $trackedMatch) {
            $footballMatch = $footballMatches[$trackedMatch->provider_match_id] ?? null;
            if (! $footballMatch instanceof FootballMatch
                || $footballMatch->homeScore === null
                || $footballMatch->awayScore === null) {
                continue;
            }

            $previous = $trackedMatch->snapshots()->latest('captured_at')->first();
            if ($previous === null || $previous->home_score === null || $previous->away_score === null) {
                continue;
            }

            if ($footballMatch->homeScore <= $previous->home_score
                && $footballMatch->awayScore <= $previous->away_score) {
                continue;
            }

            $trackedMatch->forceFill(['last_goal_detected_at' => $now])->save();
            $this->invalidateActiveAlerts($trackedMatch, $previous, $now);
            $this->recordOpportunity(
                $trackedMatch,
                $previous,
                null,
                'goal_detected',
                'reevaluate',
                sprintf(
                    'Score modifié de %d-%d à %d-%d ; réévaluation immédiate demandée.',
                    $previous->home_score,
                    $previous->away_score,
                    $footballMatch->homeScore,
                    $footballMatch->awayScore,
                ),
                $now,
            );
            $goals++;
        }

        return $goals;
    }

    private function invalidateActiveAlerts(
        TrackedMatch $trackedMatch,
        MatchSnapshot $snapshot,
        CarbonImmutable $now,
    ): void {
        $alerts = Alert::query()
            ->whereIn('status', ['queued', 'sent'])
            ->whereHas('opportunityLog', fn ($query) => $query->where('tracked_match_id', $trackedMatch->id))
            ->get();

        foreach ($alerts as $alert) {
            $alert->forceFill([
                'status' => 'invalidated',
                'goal_detected_at' => $now,
            ])->save();

            $opportunity = $alert->opportunityLog;
            $this->recordOpportunity(
                $trackedMatch,
                $snapshot,
                $opportunity?->ruleProfile,
                'alert_invalidated',
                'invalidated',
                'Un but a été marqué ; le signal précédent n’est plus valide.',
                $now,
                $opportunity?->rule_id,
                $opportunity?->selection,
                $opportunity?->rule_results ?? [],
                $opportunity?->filter_results ?? [],
                $opportunity?->suggested_action,
            );
        }
    }

    private function storeSnapshot(
        TrackedMatch $trackedMatch,
        FootballMatch $footballMatch,
        ?OddsMatch $oddsMatch,
        bool $includeStatistics,
        int $statisticsInterval,
        array $vitalityScale,
        CarbonImmutable $now,
    ): MatchSnapshot {
        $previous = $trackedMatch->snapshots()->latest('captured_at')->first();
        $statisticsCapturedAt = $includeStatistics
            ? ($footballMatch->statistics !== [] ? $now : null)
            : $previous?->statistics_captured_at;
        $statisticsAreFresh = $statisticsCapturedAt !== null
            && CarbonImmutable::instance($statisticsCapturedAt)
                ->addSeconds($statisticsInterval)
                ->greaterThanOrEqualTo($now);
        $statistics = $includeStatistics
            ? $footballMatch->statistics
            : ($statisticsAreFresh ? ($previous?->statistics ?? []) : []);
        $vitality = $includeStatistics
            ? ($footballMatch->statistics !== []
                ? ($footballMatch->vitalityScore ?? $this->vitalityCalculator->calculate($statistics, $vitalityScale)['score'] ?? null)
                : null)
            : ($statisticsAreFresh ? $previous?->vitality_score : null);

        $trackedMatch->forceFill(['status' => $footballMatch->status])->save();

        return $trackedMatch->snapshots()->create([
            'minute' => $footballMatch->minute,
            'home_score' => $footballMatch->homeScore,
            'away_score' => $footballMatch->awayScore,
            'exact_score_odds' => $oddsMatch?->exactScoreOdds,
            'second_half_over_under_odds' => $oddsMatch?->overUnderOdds,
            'statistics' => $statistics,
            'vitality_score' => $vitality,
            'odds_change_percent' => null,
            'odds_captured_at' => $oddsMatch === null ? null : $this->lastOddsFetchAt,
            'statistics_captured_at' => $statisticsCapturedAt,
            'captured_at' => $now,
        ]);
    }

    /**
     * @param  array<string, int|float>  $currentOdds
     */
    private function calculateTrendChange(
        TrackedMatch $trackedMatch,
        array $currentOdds,
        ?string $suggestedScoreKey,
        ?string $trendSource,
        ?float $stableThreshold,
        CarbonImmutable $now,
    ): ?float {
        if ($trendSource !== 'cote_suggeree'
            || $stableThreshold === null
            || $suggestedScoreKey === null) {
            return null;
        }

        $currentPrice = $currentOdds[$suggestedScoreKey] ?? null;
        if (! is_numeric($currentPrice) || ! is_finite((float) $currentPrice) || (float) $currentPrice <= 0) {
            return null;
        }

        $referenceTime = $now->subMinutes(2);
        $referenceSnapshot = $trackedMatch->snapshots()
            ->whereNotNull('exact_score_odds')
            ->whereNotNull('odds_captured_at')
            ->where('captured_at', '<=', $referenceTime)
            ->where('odds_captured_at', '<=', $referenceTime)
            ->latest('captured_at')
            ->first();
        $referencePrice = $referenceSnapshot?->exact_score_odds[$suggestedScoreKey] ?? null;
        if (! is_numeric($referencePrice) || ! is_finite((float) $referencePrice) || (float) $referencePrice <= 0) {
            return null;
        }

        $change = (((float) $currentPrice - (float) $referencePrice) / (float) $referencePrice) * 100;

        return is_finite($change) ? $change : null;
    }

    private function recordDecision(
        TrackedMatch $trackedMatch,
        MatchSnapshot $snapshot,
        RuleProfile $profile,
        EngineResult $result,
        FootballMatch $footballMatch,
        CarbonImmutable $now,
    ): int {
        $selection = $result->selection ?? $result->suggestedAction;
        if (! $result->shouldAlert || $result->decisiveRule === null || $selection === null) {
            $this->recordOpportunity(
                $trackedMatch,
                $snapshot,
                $profile,
                'evaluation',
                'no_alert',
                $result->reason,
                $now,
                ruleResults: $this->serializeRules($result),
                filterResults: $this->serializeFilters($result),
            );

            return 0;
        }

        return $this->createAlert($trackedMatch, $snapshot, $profile, $selection, $result, $footballMatch, $now);
    }

    private function createAlert(
        TrackedMatch $trackedMatch,
        MatchSnapshot $snapshot,
        RuleProfile $profile,
        string $selection,
        EngineResult $result,
        FootballMatch $footballMatch,
        CarbonImmutable $now,
    ): int {
        $ruleId = (string) $result->decisiveRule;

        return DB::transaction(function () use ($trackedMatch, $snapshot, $profile, $ruleId, $selection, $result, $footballMatch, $now): int {
            TrackedMatch::query()->whereKey($trackedMatch->id)->lockForUpdate()->firstOrFail();
            $duplicateExists = OpportunityLog::query()
                ->where('tracked_match_id', $trackedMatch->id)
                ->where('rule_id', $ruleId)
                ->where('selection', $selection)
                ->where('decision', 'alert')
                ->whereHas('alert', fn ($query) => $query->whereIn('status', ['queued', 'sent'])
                    ->where(fn ($expiration) => $expiration->whereNull('expires_at')->orWhere('expires_at', '>', $now)))
                ->exists();

            if ($duplicateExists) {
                $this->recordOpportunity(
                    $trackedMatch,
                    $snapshot,
                    $profile,
                    'evaluation',
                    'duplicate_suppressed',
                    'Une alerte active existe déjà pour ce match, cette règle et cette sélection.',
                    $now,
                    $ruleId,
                    $selection,
                    $this->serializeRules($result),
                    $this->serializeFilters($result),
                    $result->suggestedAction,
                );

                return 0;
            }

            $expiresAt = $now->addMinutes($this->settings->integer(
                $this->settings->all(),
                'alerts.expiration_minutes',
            ));
            $message = $this->buildAlertMessage($trackedMatch, $snapshot, $result, $footballMatch, $expiresAt);
            $opportunity = $this->recordOpportunity(
                $trackedMatch,
                $snapshot,
                $profile,
                'evaluation',
                'alert',
                $result->reason,
                $now,
                $ruleId,
                $selection,
                $this->serializeRules($result),
                $this->serializeFilters($result),
                $result->suggestedAction,
            );

            $alert = $opportunity->alert()->create([
                'channel' => 'pending',
                'status' => 'queued',
                'message' => $message,
                'expires_at' => $expiresAt,
            ]);
            DB::afterCommit(fn () => SendAlertNotification::dispatch($alert->id));

            return 1;
        });
    }

    private function buildAlertMessage(
        TrackedMatch $trackedMatch,
        MatchSnapshot $snapshot,
        EngineResult $result,
        FootballMatch $footballMatch,
        CarbonImmutable $expiresAt,
    ): string {
        $signal = match ($result->selection) {
            'home' => "{$result->suggestedAction} : {$trackedMatch->home_team}",
            'away' => "{$result->suggestedAction} : {$trackedMatch->away_team}",
            default => (string) $result->suggestedAction,
        };
        $gap = $result->filters['gap']->details['selectedGap'] ?? null;
        $gapLabel = $result->selection !== null && is_numeric($gap)
            ? number_format((float) $gap, 2, ',', ' ')
            : 'non applicable';
        $vitalityLabel = $snapshot->vitality_score === null
            ? 'non calculable'
            : number_format((float) $snapshot->vitality_score, 0, ',', ' ').'/100';
        $trendLabel = $snapshot->odds_change_percent === null
            ? 'non calculable'
            : number_format((float) $snapshot->odds_change_percent, 2, ',', ' ').' %';

        return implode("\n", [
            "Match : {$trackedMatch->home_team} - {$trackedMatch->away_team}",
            "Minute : {$snapshot->minute} | Score : {$snapshot->home_score}-{$snapshot->away_score}",
            "Alerte {$result->level} | Règle : {$result->decisiveRule}",
            "Signal : {$signal}",
            "Écart : {$gapLabel} | Vitalité : {$vitalityLabel} | Tendance : {$trendLabel}",
            'Score de confiance : '.($result->convergenceScore === null ? 'non calculé' : number_format($result->convergenceScore, 1, ',', ' ').' %'),
            'Expiration : '.$expiresAt->format('H:i:s'),
        ]);
    }

    private function expireAlerts(CarbonImmutable $now): int
    {
        $alerts = Alert::query()
            ->whereIn('status', ['queued', 'sent'])
            ->whereNotNull('expires_at')
            ->where('expires_at', '<=', $now)
            ->with('opportunityLog.trackedMatch', 'opportunityLog.matchSnapshot', 'opportunityLog.ruleProfile')
            ->get();

        foreach ($alerts as $alert) {
            $alert->forceFill(['status' => 'expired'])->save();
            $opportunity = $alert->opportunityLog;
            if ($opportunity?->trackedMatch === null) {
                continue;
            }

            $this->recordOpportunity(
                $opportunity->trackedMatch,
                $opportunity->matchSnapshot,
                $opportunity->ruleProfile,
                'alert_expired',
                'expired',
                'Aucun but n’a invalidé le signal avant son expiration.',
                $now,
                $opportunity->rule_id,
                $opportunity->selection,
                $opportunity->rule_results ?? [],
                $opportunity->filter_results ?? [],
                $opportunity->suggested_action,
            );
        }

        return $alerts->count();
    }

    /**
     * @param  Collection<int, TrackedMatch>  $trackedMatches
     */
    private function hasRecentGoal(Collection $trackedMatches, CarbonImmutable $now, int $windowSeconds): bool
    {
        foreach ($trackedMatches as $trackedMatch) {
            if ($trackedMatch->last_goal_detected_at === null) {
                continue;
            }

            if (CarbonImmutable::instance($trackedMatch->last_goal_detected_at)
                ->addSeconds($windowSeconds)
                ->greaterThan($now)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Une erreur inattendue sur un match est consignée sans interrompre le passage ; le message est expurgé des secrets.
     */
    private function recordProcessingError(TrackedMatch $trackedMatch, Throwable $exception, CarbonImmutable $now): void
    {
        $message = SecretRedactor::fromEnvironment()->redact(class_basename($exception).' : '.$exception->getMessage());
        Log::error('Erreur pendant le traitement d’un match ; le scan continue.', [
            'tracked_match_id' => $trackedMatch->id,
            'error' => $message,
        ]);

        try {
            $this->recordIncident(
                $trackedMatch,
                'match_processing_error',
                'Erreur pendant le traitement du match, ignoré à ce passage : '.mb_substr($message, 0, 300),
                $now,
            );
        } catch (Throwable) {
            // La base peut être indisponible : l’erreur reste dans le journal applicatif.
        }
    }

    private function recordIncident(
        TrackedMatch $trackedMatch,
        string $eventType,
        string $reason,
        CarbonImmutable $now,
        ?MatchSnapshot $snapshot = null,
    ): void {
        $this->incidents[] = [
            'match' => "{$trackedMatch->home_team} – {$trackedMatch->away_team}",
            'type' => $eventType,
            'reason' => $reason,
        ];
        $this->recordOpportunity(
            $trackedMatch,
            $snapshot,
            null,
            $eventType,
            'no_alert',
            $reason,
            $now,
        );
    }

    /**
     * @param  array<string, mixed>  $ruleResults
     * @param  array<string, mixed>  $filterResults
     */
    private function recordOpportunity(
        TrackedMatch $trackedMatch,
        ?MatchSnapshot $snapshot,
        ?RuleProfile $profile,
        string $eventType,
        string $decision,
        string $reason,
        CarbonImmutable $now,
        ?string $ruleId = null,
        ?string $selection = null,
        array $ruleResults = [],
        array $filterResults = [],
        ?string $suggestedAction = null,
    ): OpportunityLog {
        return OpportunityLog::query()->create([
            'tracked_match_id' => $trackedMatch->id,
            'match_snapshot_id' => $snapshot?->id,
            'rule_profile_id' => $profile?->id,
            'event_type' => $eventType,
            'rule_id' => $ruleId,
            'selection' => $selection,
            'decision' => $decision,
            'rule_results' => $ruleResults,
            'filter_results' => $filterResults,
            'suggested_action' => $suggestedAction,
            'reason' => $reason,
            'evaluated_at' => $now,
        ]);
    }

    /**
     * @param  array<string, int|float|string|null>  $status
     */
    private function rememberProviderStatus(string $provider, array $status): void
    {
        $providerStatus = Cache::get('pronofoot.provider_status', []);
        $providerStatus[$provider] = $status;
        Cache::put('pronofoot.provider_status', $providerStatus, now()->addDay());
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    private function serializeRules(EngineResult $result): array
    {
        $rules = [];
        foreach ($result->rules as $id => $rule) {
            $rules[$id] = [
                'verdict' => $rule->verdict->value,
                'suggested_action' => $rule->suggestedAction,
                'score' => $rule->score,
                'reason' => $rule->reason,
                'details' => $rule->details,
            ];
        }

        return $rules;
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    private function serializeFilters(EngineResult $result): array
    {
        $filters = [];
        foreach ($result->filters as $id => $filter) {
            $filters[$id] = [
                'passed' => $filter->passed,
                'reason' => $filter->reason,
                'details' => $filter->details,
            ];
        }

        return $filters;
    }
}
