<?php

namespace App\Services;

use App\Jobs\SendAdminNotification;
use App\Jobs\SendAlertNotification;
use App\Jobs\SendQuotaNotification;
use App\Logging\SecretRedactor;
use App\Models\Alert;
use App\Models\MatchSnapshot;
use App\Models\OpportunityLog;
use App\Models\RuleProfile;
use App\Models\TrackedMatch;
use App\Notifications\AlertMessageFormatter;
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

    /** @var list<int> Matchs dont un but a été détecté à ce passage. */
    private array $goalMatchIds = [];

    private ?OddsFeed $cachedOddsFeed = null;

    public function __construct(
        private readonly FootballProvider $footballProvider,
        private readonly OddsProvider $oddsProvider,
        private readonly RuleEngine $ruleEngine,
        private readonly ScanSettings $settings,
        private readonly RuleConfigurationFactory $ruleConfigurationFactory,
        private readonly VitalityCalculator $vitalityCalculator = new VitalityCalculator,
        private readonly AlertMessageFormatter $messageFormatter = new AlertMessageFormatter,
    ) {}

    public function runOnce(int $scanNumber = 0, bool $forceRefresh = true): ScanPassResult
    {
        $now = CarbonImmutable::now();
        $this->incidents = [];
        $this->goalMatchIds = [];
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
        $missingReadingsLimit = $this->settings->integer($settingValues, 'scan.missing_readings_before_end');
        $maxMatchMinutes = $this->settings->integer($settingValues, 'scan.max_match_duration_minutes');
        $idleInterval = $this->settings->integer($settingValues, 'scan.idle_interval_seconds');
        $expiredAlerts = $this->expireAlerts($now);

        // Mode de scan (Paramètres / Matchs suivis), relu à chaque tour : en pause, aucun appel API.
        if (($settingValues['scan.paused'] ?? false) === true) {
            return new ScanPassResult(0, 0, 0, $expiredAlerts, 0, 0, $oddsInterval, incidents: $this->incidents, paused: true);
        }

        // Mode manuel : seuls les matchs ajoutés à la main sont scannés (pas de suivi automatique).
        $trackedMatches = TrackedMatch::query()
            ->where('is_active', true)
            ->when(! $autoMode, fn ($query) => $query->where(fn ($manual) => $manual->whereNull('tracking_mode')->orWhere('tracking_mode', '!=', 'auto')))
            ->get();
        // Plafond : un match commencé depuis plus de 4 h 30 est retiré sans aucun appel API.
        $matchesEnded = $this->endOverdueMatches($trackedMatches, $maxMatchMinutes, $now);
        $trackedMatches = $trackedMatches->filter(fn (TrackedMatch $trackedMatch): bool => $trackedMatch->is_active)->values();

        // Suivis planifiés (« Suivre dès le coup d’envoi ») : aucun appel avant l’heure du coup d’envoi ; ensuite, le flux
        // en direct est lu pour les activer dès qu’ils sont en jeu. Plafond de 4 h 30 après le coup d’envoi prévu.
        $scheduled = TrackedMatch::query()
            ->where('tracking_mode', 'scheduled')
            ->where('is_active', false)
            ->whereNull('ended_at')
            ->get();
        $matchesEnded += $this->endOverdueMatches($scheduled, $maxMatchMinutes, $now);
        $scheduledDue = $scheduled
            ->filter(fn (TrackedMatch $trackedMatch): bool => $trackedMatch->ended_at === null
                && $trackedMatch->kickoff_at !== null
                && CarbonImmutable::instance($trackedMatch->kickoff_at)->lessThanOrEqualTo($now))
            ->values();

        if ($trackedMatches->isEmpty() && ! $autoMode && $scheduledDue->isEmpty()) {
            return new ScanPassResult(0, 0, 0, $expiredAlerts, 0, 0, $oddsInterval, incidents: $this->incidents, matchesEnded: $matchesEnded);
        }

        // Veille : aucun match suivi et aucun match des championnats suivis en direct au dernier relevé → pas d’appel
        // avant la fin de la pause (scan:once, qui force le relevé, l’ignore).
        $idleUntil = Cache::get('pronofoot.scan.idle_until');
        if ($trackedMatches->isEmpty() && $scheduledDue->isEmpty() && ! $forceRefresh && is_string($idleUntil)
            && CarbonImmutable::parse($idleUntil)->greaterThan($now)) {
            return new ScanPassResult(0, 0, 0, $expiredAlerts, 0, 0, max(1, (int) ceil($now->diffInSeconds(CarbonImmutable::parse($idleUntil), true))), incidents: $this->incidents, matchesEnded: $matchesEnded, idle: true);
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
        // Matchs suivis sans statistiques (ligue non couverte) : jamais d’appel de statistiques.
        $statisticsMatches = $dueMatches->filter(fn (TrackedMatch $trackedMatch): bool => $trackedMatch->statistics_available !== false)->values();
        $includeStatistics = $statisticsMatches->isNotEmpty();
        $footballFeed = $this->fetchFootball(
            $scanNumber,
            $includeStatistics,
            $trackedMatches,
            $quotaAlertThreshold,
            $now,
            $autoMode ? $autoLeagueIds : null,
            $statisticsMatches,
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
        $matchesEnded += $this->closeFinishedMatches($trackedMatches, $footballMatches, $missingReadingsLimit, $now, $footballFeed->driver !== 'fake');
        $trackedMatches = $trackedMatches->filter(fn (TrackedMatch $trackedMatch): bool => $trackedMatch->is_active)->values();
        $dueMatchIds = array_values(array_intersect($dueMatchIds, $trackedMatches->pluck('id')->all()));

        $scheduledActivated = $this->activateScheduledMatches($scheduledDue, $footballMatches, $now);

        // Rien à analyser à ce tour (les matchs activés le seront au tour suivant) : ni cotes, ni statistiques.
        if ($trackedMatches->isEmpty() && ! ($autoMode && $this->hasLiveMatchInLeagues($footballFeed, $autoLeagueIds))) {
            $waiting = $scheduledDue->isNotEmpty();
            if (! $waiting) {
                Cache::put('pronofoot.scan.idle_until', $now->addSeconds($idleInterval)->toIso8601String(), $now->addSeconds($idleInterval));
            }

            return new ScanPassResult(0, 0, 0, $expiredAlerts, 0, 0, $waiting ? $oddsInterval : $idleInterval, incidents: $this->incidents, matchesEnded: $matchesEnded, idle: ! $waiting, scheduledActivated: $scheduledActivated);
        }
        Cache::forget('pronofoot.scan.idle_until');

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
                    'requestsLimit' => $oddsFeed->requestsLimit,
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
                'requestsLimit' => $oddsFeed->requestsLimit,
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
                if ($footballMatch === null) {
                    // Absent du flux : compté par closeFinishedMatches, terminé après N relevés ; aucune ligne à chaque relevé.
                    continue;
                }

                if (! $this->isInPlay($footballMatch)) {
                    $this->recordIncident($trackedMatch, 'football_data_missing', 'Match non en cours selon le flux (statut : '.$footballMatch->status.').', $now);
                    $errors++;

                    continue;
                }

                if (MatchStatus::isPenaltyShootout(MatchStatus::code($footballMatch))) {
                    $this->recordIncident($trackedMatch, 'penalty_shootout', 'Séance de tirs au but : pas d’analyse ; le match n’est pas encore terminé.', $now);

                    continue;
                }

                if ($footballMatch->homeScore === null || $footballMatch->awayScore === null || $footballMatch->minute === null) {
                    $this->recordIncident($trackedMatch, 'football_data_missing', 'Le score ou la minute du match est indisponible.', $now);
                    $errors++;

                    continue;
                }

                $oddsMatch = $oddsMatches[$trackedMatch->provider_match_id] ?? null;
                $isDue = in_array($trackedMatch->id, $dueMatchIds, true);
                $withoutStatistics = $trackedMatch->statistics_available === false;
                $snapshot = $this->storeSnapshot(
                    $trackedMatch,
                    $footballMatch,
                    $oddsMatch,
                    $isDue && ! $withoutStatistics,
                    $statisticsInterval,
                    $vitalityScale,
                    $now,
                );
                $snapshotsStored++;

                if (in_array($trackedMatch->id, $this->goalMatchIds, true)) {
                    continue;
                }

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
                $vitality = ! $withoutStatistics && $snapshotAge !== null
                    && $snapshotAge->addSeconds($statisticsInterval)->greaterThanOrEqualTo($now)
                    ? $snapshot->vitality_score
                    : null;
                $configuration = $this->ruleConfigurationFactory->make($profile, $settingValues);
                // Règle F121 pour les deux équipes : prochain but à domicile (h+1-a) et à l’extérieur (h-a+1).
                $sideKeys = $this->sideScoreKeys($footballMatch->homeScore, $footballMatch->awayScore);
                $postGoal = $this->postGoalSides($trackedMatch, $oddsMatch, $sideKeys, $goalWindow, $now);
                $sideChanges = $postGoal === null
                    ? $this->sideTrendChanges($trackedMatch, $oddsMatch->exactScoreOdds, $sideKeys, $settingValues, $now)
                    : array_map(fn (array $side): ?float => $side['change'], $postGoal);
                $snapshot->forceFill(['odds_change_percent' => $this->strongestChange($sideChanges)])->save();
                $result = $this->ruleEngine->evaluate(
                    new RuleInput(
                        homeScore: $footballMatch->homeScore,
                        awayScore: $footballMatch->awayScore,
                        exactScoreOdds: $oddsMatch->exactScoreOdds,
                        vitalityScore: $vitality,
                        methodScores: $footballMatch->methodScores,
                        halftime: $halftime,
                        under25Odds: $oddsMatch->under25Odds,
                        minute: $footballMatch->minute,
                        sideOddsChangePercent: $sideChanges,
                        sidePostGoal: $postGoal,
                        overLineOdds: $oddsMatch->overLineOdds,
                        vitalityUnavailable: $withoutStatistics,
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
            matchesEnded: $matchesEnded,
            scheduledActivated: $scheduledActivated,
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
        $goalWindow = $this->settings->integer($settings, 'scan.goal_window_seconds');

        return $trackedMatches->filter(function (TrackedMatch $trackedMatch) use ($hotInterval, $calmInterval, $hotGap, $noScanGap, $trendThreshold, $economyMode, $forceRefresh, $goalWindow, $now): bool {
            $snapshot = $trackedMatch->snapshots()->latest('captured_at')->latest('id')->first();
            $heat = $this->matchHeat($snapshot, $hotGap, $noScanGap, $trendThreshold);
            $this->recordNoScanTransition($trackedMatch, $snapshot, $heat === 'none', $noScanGap, $now);
            if ($this->inPostGoalWindow($trackedMatch, $goalWindow, $now)) {
                return true;
            }

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

    private function inPostGoalWindow(TrackedMatch $trackedMatch, int $goalWindow, CarbonImmutable $now): bool
    {
        return $trackedMatch->last_goal_detected_at !== null
            && CarbonImmutable::instance($trackedMatch->last_goal_detected_at)->addSeconds($goalWindow)->greaterThan($now);
    }

    /**
     * Score du prochain but de chaque équipe : domicile h+1-a, extérieur h-a+1.
     *
     * @return array{home: string, away: string}
     */
    private function sideScoreKeys(int $homeScore, int $awayScore): array
    {
        return ['home' => ($homeScore + 1).'-'.$awayScore, 'away' => $homeScore.'-'.($awayScore + 1)];
    }

    /**
     * Complément 4, pour chaque équipe : pendant la fenêtre après un but, le premier relevé où la cote du prochain but
     * de l’équipe est disponible fixe son point de départ ; les relevés suivants donnent la variation depuis ce point.
     * Si la cote n’est pas encore disponible (bookmaker fermé), le relevé suivant reste le « premier relevé » pour cette
     * équipe. Hors fenêtre : null. L’historique n’est jamais supprimé.
     *
     * @param  array{home: string, away: string}  $sideKeys
     * @return array{home: array{phase: string, change: float|null}, away: array{phase: string, change: float|null}}|null
     */
    private function postGoalSides(
        TrackedMatch $trackedMatch,
        OddsMatch $oddsMatch,
        array $sideKeys,
        int $goalWindow,
        CarbonImmutable $now,
    ): ?array {
        if (! $this->inPostGoalWindow($trackedMatch, $goalWindow, $now)) {
            return null;
        }

        $references = is_array($trackedMatch->post_goal_references) ? $trackedMatch->post_goal_references : [];
        $sides = [];
        $changed = false;
        foreach ($sideKeys as $side => $scoreKey) {
            $price = $oddsMatch->exactScoreOdds[$scoreKey] ?? null;
            $price = is_numeric($price) && (float) $price > 0 ? (float) $price : null;
            $reference = $references[$side] ?? null;
            if (! is_array($reference) || ($reference['score'] ?? null) !== $scoreKey || ! is_numeric($reference['odds'] ?? null)) {
                if ($price !== null) {
                    $references[$side] = ['score' => $scoreKey, 'odds' => $price];
                    $changed = true;
                }
                $sides[$side] = ['phase' => RuleInput::POST_GOAL_FIRST_READING, 'change' => $price === null ? null : 0.0];

                continue;
            }

            $referenceOdds = (float) $reference['odds'];
            $sides[$side] = [
                'phase' => RuleInput::POST_GOAL_WINDOW,
                'change' => $price === null || $referenceOdds <= 0 ? null : ($price - $referenceOdds) / $referenceOdds * 100,
            ];
        }

        if ($changed) {
            $trackedMatch->forceFill(['post_goal_references' => $references])->save();
        }

        return $sides;
    }

    /**
     * Tendance sur 2 minutes de la cote du prochain but de chaque équipe.
     *
     * @param  array<string, int|float>  $odds
     * @param  array{home: string, away: string}  $sideKeys
     * @param  array<string, int|float|bool|array|string|null>  $settings
     * @return array{home: float|null, away: float|null}
     */
    private function sideTrendChanges(TrackedMatch $trackedMatch, array $odds, array $sideKeys, array $settings, CarbonImmutable $now): array
    {
        $source = $this->settings->nullableString($settings, 'tendance_source');
        $threshold = $this->settings->nullableFloat($settings, 'tendance_seuil_stable');

        return [
            'home' => $this->calculateTrendChange($trackedMatch, $odds, $sideKeys['home'], $source, $threshold, $now),
            'away' => $this->calculateTrendChange($trackedMatch, $odds, $sideKeys['away'], $source, $threshold, $now),
        ];
    }

    /**
     * Baisse la plus forte des deux équipes, conservée sur l’instantané pour le classement chaud / calme.
     *
     * @param  array<string, float|null>  $changes
     */
    private function strongestChange(array $changes): ?float
    {
        $values = array_values(array_filter($changes, fn (?float $change): bool => $change !== null));

        return $values === [] ? null : min($values);
    }

    /**
     * Plafond de durée : un match dont le coup d’envoi date de plus de N minutes (4 h 30 par défaut) est terminé,
     * avant tout appel API.
     *
     * @param  Collection<int, TrackedMatch>  $trackedMatches
     */
    private function endOverdueMatches(Collection $trackedMatches, int $maxMinutes, CarbonImmutable $now): int
    {
        $ended = 0;
        foreach ($trackedMatches as $trackedMatch) {
            if ($trackedMatch->kickoff_at !== null
                && CarbonImmutable::instance($trackedMatch->kickoff_at)->addMinutes($maxMinutes)->lessThanOrEqualTo($now)) {
                $hours = intdiv($maxMinutes, 60);
                $minutes = $maxMinutes % 60;
                $this->endTrackedMatch($trackedMatch, 'coup d’envoi il y a plus de '.$hours.' h'.($minutes > 0 ? ' '.str_pad((string) $minutes, 2, '0', STR_PAD_LEFT) : ''), $now);
                $ended++;
            }
        }

        return $ended;
    }

    /**
     * Fin de match d’après le flux en direct : statut de fin (FT, AET, PEN, PST, CANC, ABD, AWD, WO), ou absence du flux
     * pendant N relevés consécutifs (filet de sécurité). Jamais d’après la minute (temps additionnel, prolongations).
     *
     * @param  Collection<int, TrackedMatch>  $trackedMatches
     * @param  array<string, FootballMatch|OddsMatch>  $footballMatches
     */
    private function closeFinishedMatches(Collection $trackedMatches, array $footballMatches, int $missingReadingsLimit, CarbonImmutable $now, bool $recordKickoff = true): int
    {
        $ended = 0;
        foreach ($trackedMatches as $trackedMatch) {
            $footballMatch = $footballMatches[$trackedMatch->provider_match_id] ?? null;
            if (! $footballMatch instanceof FootballMatch) {
                $missing = (int) $trackedMatch->missing_readings + 1;
                if ($missing >= $missingReadingsLimit) {
                    $this->endTrackedMatch($trackedMatch, "absent du flux en direct depuis {$missing} relevés consécutifs", $now);
                    $ended++;
                } else {
                    $trackedMatch->forceFill(['missing_readings' => $missing])->save();
                }

                continue;
            }

            $updates = [];
            if ((int) $trackedMatch->missing_readings !== 0) {
                $updates['missing_readings'] = 0;
            }
            // Le pilote fictif a des dates de coup d’envoi figées : elles ne servent pas au plafond de durée.
            if ($recordKickoff && $trackedMatch->kickoff_at === null && is_string($footballMatch->kickoffAt)) {
                try {
                    $updates['kickoff_at'] = CarbonImmutable::parse($footballMatch->kickoffAt);
                } catch (Throwable) {
                    // Date illisible : le plafond de durée ne s’applique pas à ce match.
                }
            }
            if ($updates !== []) {
                $trackedMatch->forceFill($updates)->save();
            }

            $code = MatchStatus::code($footballMatch);
            if (MatchStatus::isFinished($code)) {
                $this->endTrackedMatch($trackedMatch, 'statut '.MatchStatus::endLabel((string) $code), $now);
                $ended++;
            }
        }

        return $ended;
    }

    /**
     * Retire le match du suivi (statut « Terminé »), expire ses alertes actives et inscrit un seul événement au Journal.
     * Un match inactif n’est plus jamais interrogé (ni statistiques, ni cotes).
     */
    private function endTrackedMatch(TrackedMatch $trackedMatch, string $reason, CarbonImmutable $now): void
    {
        $alerts = Alert::query()
            ->whereIn('status', ['queued', 'sent'])
            ->whereHas('opportunityLog', fn ($query) => $query->where('tracked_match_id', $trackedMatch->id))
            ->get();
        foreach ($alerts as $alert) {
            $alert->forceFill(['status' => 'expired'])->save();
        }

        $trackedMatch->forceFill([
            'is_active' => false,
            'status' => 'Terminé',
            'ended_at' => $now,
            'ended_reason' => $reason,
            'missing_readings' => 0,
        ])->save();

        $expired = $alerts->count();
        $this->recordOpportunity(
            $trackedMatch,
            null,
            null,
            'match_finished',
            'no_alert',
            "Match terminé : suivi arrêté ({$reason}).".($expired > 0 ? " {$expired} alerte".($expired > 1 ? 's actives expirées.' : ' active expirée.') : ''),
            $now,
        );
    }

    /**
     * Active les suivis planifiés dont le match est en jeu dans le flux en direct (un événement au Journal chacun).
     *
     * @param  Collection<int, TrackedMatch>  $scheduledDue
     * @param  array<string, FootballMatch|OddsMatch>  $footballMatches
     */
    private function activateScheduledMatches(Collection $scheduledDue, array $footballMatches, CarbonImmutable $now): int
    {
        $activated = 0;
        foreach ($scheduledDue as $trackedMatch) {
            $footballMatch = $footballMatches[$trackedMatch->provider_match_id] ?? null;
            if (! $footballMatch instanceof FootballMatch || $footballMatch->inPlay === false
                || MatchStatus::isFinished(MatchStatus::code($footballMatch))) {
                continue;
            }

            $trackedMatch->forceFill([
                'is_active' => true,
                'tracking_mode' => 'manual',
                'status' => $footballMatch->status,
                'statistics_available' => $footballMatch->statisticsCoverage !== false,
                'missing_readings' => 0,
            ])->save();
            $this->recordOpportunity($trackedMatch, null, null, 'scheduled_started', 'no_alert', 'Match planifié passé en direct : suivi activé.', $now);
            $activated++;
        }

        return $activated;
    }

    /**
     * Cote de l’option neutre (Over buts + 0,5), demandée une seule fois à la création de l’alerte (réponse gardée 60 s
     * par le pilote), jamais à chaque relevé. Marché indisponible : l’option reste « cote non disponible ».
     */
    private function withNeutralOptionOdds(TrackedMatch $trackedMatch, EngineResult $result): EngineResult
    {
        $index = null;
        foreach ($result->options as $position => $option) {
            if (($option['type'] ?? null) === 'neutral' && ($option['odds'] ?? null) === null) {
                $index = $position;
            }
        }
        if ($index === null) {
            return $result;
        }

        $line = trim(str_replace('Over', '', (string) $result->options[$index]['line']));
        try {
            $odds = $this->oddsProvider->getOverLineOdds()[$trackedMatch->provider_match_id][$line] ?? null;
        } catch (Throwable) {
            $odds = null;
        }
        if (! is_numeric($odds) || (float) $odds <= 0) {
            return $result;
        }

        $options = $result->options;
        $options[$index]['odds'] = (float) $odds;
        $reason = str_replace(
            $options[$index]['line'].', cote non disponible',
            $options[$index]['line'].', cote '.number_format((float) $odds, 2, '.', ''),
            $result->reason,
        );

        return new EngineResult(
            $result->shouldAlert,
            $result->convergenceScore,
            $result->rules,
            $result->filters,
            $reason,
            $result->steps,
            $result->decisiveRule,
            $result->level,
            $result->selection,
            $result->suggestedAction,
            $result->sides,
            $options,
        );
    }

    /**
     * @param  list<int>  $leagueIds
     */
    private function hasLiveMatchInLeagues(FootballFeed $footballFeed, array $leagueIds): bool
    {
        foreach ($footballFeed->matches as $match) {
            if ($match->inPlay !== false && in_array($match->leagueId, $leagueIds, true)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Une seule ligne au Journal quand un match passe en « pas de scan » (écart au-delà du seuil d’arrêt),
     * et une autre quand il en sort (à confirmer). Rien n’est écrit tant que l’état ne change pas.
     */
    private function recordNoScanTransition(
        TrackedMatch $trackedMatch,
        ?MatchSnapshot $snapshot,
        bool $noScan,
        float $noScanGap,
        CarbonImmutable $now,
    ): void {
        if ($noScan === ($trackedMatch->no_scan_since !== null)) {
            return;
        }

        $trackedMatch->forceFill(['no_scan_since' => $noScan ? $now : null])->save();
        $threshold = number_format($noScanGap, 2, '.', '');
        $this->recordOpportunity(
            $trackedMatch,
            $snapshot,
            null,
            $noScan ? 'scan_paused' : 'scan_resumed',
            'no_alert',
            $noScan
                ? "Écart supérieur à {$threshold} : match non scanné tant qu’il reste dans cet état (à confirmer)."
                : "Écart revenu à {$threshold} ou moins : scan du match repris.",
            $now,
        );
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

        $snapshot->forceFill(['odds_change_percent' => $this->strongestChange($this->sideTrendChanges(
            $trackedMatch,
            $oddsMatch->exactScoreOdds,
            $this->sideScoreKeys($footballMatch->homeScore, $footballMatch->awayScore),
            $settings,
            $now,
        ))])->save();
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
     * statistique confirmée. Les retraits manuels et les matchs terminés sont respectés (jamais réactivés). La fin d’un
     * match (statut ou absence prolongée du flux) est gérée par closeFinishedMatches pour tous les matchs suivis.
     *
     * @param  array<string, FootballMatch|OddsMatch>  $oddsMatches
     * @param  list<int>  $leagueIds
     */
    private function syncAutomaticMatches(FootballFeed $footballFeed, array $oddsMatches, array $leagueIds): int
    {
        $created = 0;
        foreach ($footballFeed->matches as $match) {
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
                    'kickoff_at' => is_string($match->kickoffAt) ? CarbonImmutable::parse($match->kickoffAt) : null,
                    'status' => $match->status,
                    'is_active' => true,
                    'tracking_mode' => 'auto',
                ],
            );
            if ($trackedMatch->wasRecentlyCreated) {
                $created++;
            }
        }

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

            $trackedMatch->forceFill([
                'last_goal_detected_at' => $now,
                'post_goal_reference_score' => null,
                'post_goal_reference_odds' => null,
                'post_goal_references' => null,
            ])->save();
            $this->goalMatchIds[] = $trackedMatch->id;
            $this->invalidateActiveAlerts($trackedMatch, $previous, $now, $footballMatch);
            $this->recordOpportunity(
                $trackedMatch,
                $previous,
                null,
                'goal_detected',
                'reevaluate',
                sprintf(
                    'Score modifié de %d-%d à %d-%d ; attente de la première cote après le but (le bookmaker rouvre ses cotes).',
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
        ?FootballMatch $footballMatch = null,
    ): void {
        $alerts = Alert::query()
            ->whereIn('status', ['queued', 'sent'])
            ->whereHas('opportunityLog', fn ($query) => $query->where('tracked_match_id', $trackedMatch->id))
            ->get();
        $adminWasAlerted = $alerts->contains(fn (Alert $alert): bool => $alert->status === 'sent');

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

        if ($adminWasAlerted && $footballMatch?->homeScore !== null && $footballMatch->awayScore !== null) {
            SendAdminNotification::dispatch($this->messageFormatter->goalScored(
                $trackedMatch->home_team,
                $trackedMatch->away_team,
                (int) $snapshot->home_score,
                (int) $snapshot->away_score,
                $footballMatch->homeScore,
                $footballMatch->awayScore,
                $footballMatch->minute,
            ));
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

        // Après un but (à confirmer) : les relevés antérieurs au but sont ignorés pour le calcul (ils restent en base).
        // Point de départ = première cote relevée après le dernier but ; la variation se calcule par rapport à lui dès
        // le relevé suivant, sans attendre. Au-delà, la référence redevient le relevé d’il y a deux minutes, postérieur au but.
        $referenceTime = $now->subMinutes(2);
        $lastGoalAt = $trackedMatch->last_goal_detected_at === null
            ? null
            : CarbonImmutable::instance($trackedMatch->last_goal_detected_at);
        $snapshotsWithOdds = fn () => $trackedMatch->snapshots()
            ->whereNotNull('exact_score_odds')
            ->whereNotNull('odds_captured_at')
            ->when($lastGoalAt !== null, fn ($query) => $query
                ->where('captured_at', '>=', $lastGoalAt)
                ->where('odds_captured_at', '>=', $lastGoalAt));
        $referenceSnapshot = $snapshotsWithOdds()
            ->where('captured_at', '<=', $referenceTime)
            ->where('odds_captured_at', '<=', $referenceTime)
            ->latest('captured_at')
            ->latest('id')
            ->first();
        if ($referenceSnapshot === null && $lastGoalAt !== null) {
            $referenceSnapshot = $snapshotsWithOdds()->oldest('captured_at')->oldest('id')->first();
        }
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

            $result = $this->withNeutralOptionOdds($trackedMatch, $result);
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
        $homeScore = $snapshot->home_score === null ? null : (int) $snapshot->home_score;
        $awayScore = $snapshot->away_score === null ? null : (int) $snapshot->away_score;
        $target = match ($result->selection) {
            'home' => $trackedMatch->home_team,
            'away' => $trackedMatch->away_team,
            default => null,
        };
        $oddsLines = [];
        if ($result->selection !== null && $homeScore !== null && $awayScore !== null) {
            $key = $result->selection === 'home' ? ($homeScore + 1).'-'.$awayScore : $homeScore.'-'.($awayScore + 1);
            $price = $snapshot->exact_score_odds[$key] ?? null;
            if (is_numeric($price)) {
                $oddsLines["Cote suggérée ({$key})"] = (float) $price;
            }
        } elseif ($result->decisiveRule === 'F121-E2') {
            $under = $result->rules['F121-E2']->details['under25Odds'] ?? null;
            if (is_numeric($under)) {
                $oddsLines['Cote Under 2.5'] = (float) $under;
            }
        } elseif ($result->decisiveRule === 'F121-D' && $homeScore !== null && $awayScore !== null) {
            $details = $result->rules['F121-D']->details ?? [];
            foreach ([($homeScore + 1).'-'.$awayScore => 'homeNextOdds', $homeScore.'-'.($awayScore + 1) => 'awayNextOdds'] as $score => $field) {
                if (is_numeric($details[$field] ?? null)) {
                    $oddsLines["Cote {$score}"] = (float) $details[$field];
                }
            }
        }
        $gap = $result->filters['gap']->details['selectedGap'] ?? null;
        $winner = collect($result->sides)->firstWhere('side', $result->selection);
        $trend = is_array($winner) && is_numeric($winner['change'] ?? null)
            ? (float) $winner['change']
            : ($snapshot->odds_change_percent === null ? null : (float) $snapshot->odds_change_percent);

        return $this->messageFormatter->opportunity(
            homeTeam: $trackedMatch->home_team,
            awayTeam: $trackedMatch->away_team,
            homeScore: $homeScore,
            awayScore: $awayScore,
            minute: $snapshot->minute === null ? null : (int) $snapshot->minute,
            level: (string) $result->level,
            rule: (string) $result->decisiveRule,
            target: $target,
            bet: $result->suggestedAction,
            oddsLines: $oddsLines,
            gap: $target !== null && is_numeric($gap) ? (float) $gap : null,
            vitality: $snapshot->vitality_score === null ? null : (float) $snapshot->vitality_score,
            trend: $trend,
            expiresAt: $expiresAt,
            confidence: $result->convergenceScore,
            options: $result->options,
            vitalityUnavailable: $trackedMatch->statistics_available === false,
        );
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
            $adminWasAlerted = $alert->status === 'sent';
            $alert->forceFill(['status' => 'expired'])->save();
            $opportunity = $alert->opportunityLog;
            if ($opportunity?->trackedMatch === null) {
                continue;
            }

            if ($adminWasAlerted) {
                SendAdminNotification::dispatch($this->messageFormatter->expired(
                    $opportunity->trackedMatch->home_team,
                    $opportunity->trackedMatch->away_team,
                    (string) $opportunity->rule_id,
                    CarbonImmutable::instance($alert->expires_at),
                ));
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
        // Relevé identique au précédent pour ce match (même décision, même justification) : la ligne existante est
        // mise à jour (horodatage, compteur) au lieu d’en créer une nouvelle, pour que le Journal ne grossisse pas à
        // chaque scan. Les alertes et les événements ponctuels créent toujours leur ligne.
        if (in_array($decision, ['no_alert', 'duplicate_suppressed'], true)
            && ! in_array($eventType, ['match_finished', 'scan_paused', 'scan_resumed'], true)) {
            $previous = OpportunityLog::query()
                ->where('tracked_match_id', $trackedMatch->id)
                ->latest('id')
                ->first();
            if ($previous !== null
                && $previous->event_type === $eventType
                && $previous->decision === $decision
                && $previous->reason === $reason
                && $previous->rule_id === $ruleId
                && $previous->selection === $selection) {
                $previous->forceFill([
                    'match_snapshot_id' => $snapshot?->id ?? $previous->match_snapshot_id,
                    'rule_profile_id' => $profile?->id ?? $previous->rule_profile_id,
                    'rule_results' => $ruleResults,
                    'filter_results' => $filterResults,
                    'evaluated_at' => $now,
                    'first_evaluated_at' => $previous->first_evaluated_at ?? $previous->evaluated_at,
                    'repeat_count' => (int) $previous->repeat_count + 1,
                ])->save();

                return $previous;
            }
        }

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
            'first_evaluated_at' => $now,
            'repeat_count' => 1,
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
