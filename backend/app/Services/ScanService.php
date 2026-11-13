<?php

namespace App\Services;

use App\Jobs\SendAlertNotification;
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

final class ScanService
{
    private ?CarbonImmutable $lastOddsFetchAt = null;

    /** @var list<array{match: string, type: string, reason: string}> */
    private array $incidents = [];

    private ?CarbonImmutable $lastStatisticsFetchAt = null;

    private ?OddsFeed $cachedOddsFeed = null;

    public function __construct(
        private readonly FootballProvider $footballProvider,
        private readonly OddsProvider $oddsProvider,
        private readonly RuleEngine $ruleEngine,
        private readonly ScanSettings $settings,
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
        $quotaAlertThreshold = $this->settings->nullableInteger($settingValues, 'scan.quota_alert_threshold');
        $vitalityScale = is_array($settingValues['rules.vitality_normalization_references'] ?? null)
            ? $settingValues['rules.vitality_normalization_references']
            : VitalityCalculator::DEFAULT_SCALE;
        $expiredAlerts = $this->expireAlerts($now);
        $trackedMatches = TrackedMatch::query()->where('is_active', true)->get();

        if ($trackedMatches->isEmpty()) {
            return new ScanPassResult(0, 0, 0, $expiredAlerts, 0, 0, $oddsInterval, incidents: $this->incidents);
        }

        $includeStatistics = $forceRefresh
            || $this->lastStatisticsFetchAt === null
            || $this->lastStatisticsFetchAt->addSeconds($statisticsInterval)->lessThanOrEqualTo($now);
        $footballFeed = $this->fetchFootball($scanNumber, $includeStatistics, $trackedMatches, $quotaAlertThreshold, $now);
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

        if ($includeStatistics) {
            $this->lastStatisticsFetchAt = $now;
        }

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
                $oddsFeed = $this->oddsProvider->getLiveOdds($scanNumber);
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
        $profile = RuleProfile::query()->where('is_active', true)->first();
        $alertsCreated = 0;
        $snapshotsStored = 0;
        $errors = 0;

        foreach ($trackedMatches as $trackedMatch) {
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
            $snapshot = $this->storeSnapshot(
                $trackedMatch,
                $footballMatch,
                $oddsMatch,
                $includeStatistics,
                $statisticsInterval,
                $vitalityScale,
                $now,
            );
            $snapshotsStored++;

            $statisticsFailure = $footballFeed->statisticsFailures[$trackedMatch->provider_match_id] ?? null;
            if ($includeStatistics && $statisticsFailure !== null) {
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
            $configuration = $this->ruleConfiguration($profile, $settingValues);
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
        );
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
    ): ?FootballFeed {
        try {
            $feed = $this->footballProvider->getLiveMatches(
                scanNumber: $scanNumber,
                includeStatistics: $includeStatistics,
                statisticsMatchLimit: null,
                statisticsMatchIds: $trackedMatches->pluck('provider_match_id')->map(fn ($id): string => (string) $id)->values()->all(),
                quotaAlertThreshold: $quotaAlertThreshold,
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
     * @param  array<string, int|float|bool|array|string|null>  $settings
     */
    private function ruleConfiguration(RuleProfile $profile, array $settings): RuleConfiguration
    {
        $profileSettings = $profile->settings ?? [];
        $activeRules = $profileSettings['active_rules'] ?? RuleConfiguration::DEFINED_RULES;
        $methodWeights = $profileSettings['method_weights'] ?? [];

        if (! is_array($activeRules) || ! is_array($methodWeights)) {
            throw new \InvalidArgumentException('Le profil actif contient une liste de règles ou des poids invalides.');
        }

        return new RuleConfiguration(
            activeRules: $activeRules,
            maximumDirectionalGap: $this->settings->decimal($settings, 'rules.maximum_directional_gap'),
            zeroZeroOddsWaitThreshold: $this->settings->decimal($settings, 'rules.zero_zero_odds_wait_threshold'),
            zeroZeroGapThreshold: $this->settings->decimal($settings, 'rules.zero_zero_gap_threshold'),
            upcomingScoreOddsLimit: $this->settings->decimal($settings, 'rules.upcoming_score_odds_limit'),
            minimumVitality: $this->settings->decimal($settings, 'rules.minimum_vitality'),
            trendSource: $this->settings->nullableString($settings, 'tendance_source'),
            stableOddsChangePercent: $this->settings->nullableFloat($settings, 'tendance_seuil_stable'),
            minimumConvergenceScore: $this->settings->decimal($settings, 'rules.minimum_convergence_score'),
            methodWeights: $methodWeights,
            openMatchScores: $this->stringList($settings, 'rules.open_match_scores', ['2-2', '2-3', '3-2']),
            halftimeUnderMinimum: $this->settings->decimal($settings, 'rules.halftime_under25_min'),
            halftimeUnderMaximum: $this->settings->decimal($settings, 'rules.halftime_under25_max'),
            negativeGapLevel: $this->settings->nullableString($settings, 'alerts.level_negative_gap') ?? 'Critique',
            positiveGapLevel: $this->settings->nullableString($settings, 'alerts.level_positive_gap') ?? 'Haute',
            pipeline: $this->stringList($settings, 'rules.decision_pipeline', RuleConfiguration::DEFAULT_PIPELINE),
        );
    }

    /**
     * @param  array<string, int|float|bool|array|string|null>  $settings
     * @param  list<string>  $default
     * @return list<string>
     */
    private function stringList(array $settings, string $key, array $default): array
    {
        $value = $settings[$key] ?? null;
        if (! is_array($value)) {
            return $default;
        }

        return array_values(array_map('strval', $value));
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
