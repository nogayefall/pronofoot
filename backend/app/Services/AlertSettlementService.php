<?php

namespace App\Services;

use App\Models\Alert;
use App\Models\AlertOption;
use App\Models\TrackedMatch;
use App\Providers\Contracts\FootballProvider;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Résultat automatique des options des alertes d’un match, à la fin du match. Utilise les scores déjà enregistrés à
 * chaque relevé et le score final : celui du flux (fin par statut), sinon celui du match demandé au fournisseur (fin par
 * absence du flux : une requête par match ayant des options à noter). Une requête fixtures/events au plus par match, et
 * seulement si deux buts des deux équipes sont tombés entre deux relevés alors que l’ordre compte (option ciblée).
 */
final class AlertSettlementService
{
    public const CANCELLING_STATUSES = ['ABD', 'CANC', 'PST', 'AWD', 'WO'];

    public function __construct(
        private readonly FootballProvider $footballProvider,
        private readonly ScanSettings $settings,
        private readonly BetSettler $settler = new BetSettler,
    ) {}

    /**
     * @param  array{home: int, away: int, minute: int|null}|null  $finalScore  Score final lu dans le flux (fin par statut).
     * @return array{settled: int, eventRequests: int}
     */
    public function settleMatch(TrackedMatch $trackedMatch, bool $cancelled, ?array $finalScore = null, ?CarbonImmutable $now = null): array
    {
        $now ??= CarbonImmutable::now();
        $alerts = $this->alerts($trackedMatch, fn ($query) => $query->where('outcome', 'pending'));
        if ($alerts->isEmpty()) {
            return ['settled' => 0, 'eventRequests' => 0];
        }

        if ($finalScore === null && ! $cancelled) {
            $official = $this->footballProvider->getFinalScores([$trackedMatch->provider_match_id])[$trackedMatch->provider_match_id] ?? null;
            $cancelled = $official !== null && in_array($official['status'], self::CANCELLING_STATUSES, true);
            $finalScore = $this->finalScore($official);
        }

        $result = $this->outcomes($trackedMatch, $alerts, fn (AlertOption $option): bool => $option->outcome === 'pending', $cancelled, $finalScore, $now);
        foreach ($result['outcomes'] as ['alert' => $alert, 'option' => $option, 'outcome' => $outcome]) {
            $option->forceFill(['outcome' => $outcome, 'outcome_source' => 'auto', 'settled_at' => $now])->save();
            if ($option->position === 1) {
                $alert->opportunityLog?->forceFill(['outcome' => $outcome])->save();
            }
        }

        return ['settled' => count($result['outcomes']), 'eventRequests' => $result['eventRequests']];
    }

    /**
     * Recalcule les résultats automatiques déjà notés d’un match terminé, avec son score final officiel. Les résultats
     * manuels, en attente ou annulés ne sont jamais touchés. Sans $apply, rien n’est écrit.
     *
     * @param  array{status: string, home: int|null, away: int|null, minute: int|null}  $official
     * @return list<array{alert: Alert, option: AlertOption, before: string, after: string}> Options dont le résultat change.
     */
    public function recalculateMatch(TrackedMatch $trackedMatch, array $official, bool $apply): array
    {
        $rated = fn (AlertOption $option): bool => $option->outcome_source === 'auto' && in_array($option->outcome, ['won', 'lost'], true);
        $alerts = $this->alerts($trackedMatch, fn ($query) => $query->where('outcome_source', 'auto')->whereIn('outcome', ['won', 'lost']));
        $now = CarbonImmutable::now();
        $result = $this->outcomes($trackedMatch, $alerts, $rated, in_array($official['status'], self::CANCELLING_STATUSES, true), $this->finalScore($official), $now);

        $changes = [];
        foreach ($result['outcomes'] as ['alert' => $alert, 'option' => $option, 'outcome' => $outcome]) {
            if ($option->outcome !== $outcome) {
                $changes[] = ['alert' => $alert, 'option' => $option, 'before' => $option->outcome, 'after' => $outcome];
            }
        }

        if ($apply) {
            DB::transaction(function () use ($changes, $now): void {
                foreach ($changes as ['alert' => $alert, 'option' => $option, 'before' => $before, 'after' => $after]) {
                    // Condition répétée à l’écriture : un résultat corrigé à la main entre-temps n’est pas remplacé.
                    $updated = AlertOption::query()->whereKey($option->id)->where('outcome_source', 'auto')->where('outcome', $before)
                        ->update(['outcome' => $after, 'settled_at' => $now]);
                    if ($updated === 1 && $option->position === 1) {
                        $alert->opportunityLog()->where('outcome', $before)->update(['outcome' => $after]);
                    }
                }
            });
        }

        return $changes;
    }

    /**
     * @return Collection<int, Alert>
     */
    private function alerts(TrackedMatch $trackedMatch, \Closure $options): Collection
    {
        return Alert::query()
            ->whereHas('opportunityLog', fn ($query) => $query->where('tracked_match_id', $trackedMatch->id))
            ->whereHas('options', $options)
            ->with(['options', 'opportunityLog.matchSnapshot'])
            ->orderBy('id')
            ->get();
    }

    /**
     * @param  Collection<int, Alert>  $alerts
     * @param  \Closure(AlertOption): bool  $selected
     * @param  array{home: int, away: int, minute: int|null}|null  $finalScore
     * @return array{outcomes: list<array{alert: Alert, option: AlertOption, outcome: string}>, eventRequests: int}
     */
    private function outcomes(TrackedMatch $trackedMatch, Collection $alerts, \Closure $selected, bool $cancelled, ?array $finalScore, CarbonImmutable $now): array
    {
        $settings = $this->settings->all();
        $validityAlert = ($settings['results.bet_validity'] ?? 'match') === 'alert';
        $countExtraTime = ($settings['results.count_extra_time'] ?? true) !== false;
        $snapshots = $trackedMatch->snapshots()
            ->whereNotNull('home_score')
            ->whereNotNull('away_score')
            ->orderBy('captured_at')
            ->orderBy('id')
            ->get(['id', 'home_score', 'away_score', 'minute', 'captured_at']);
        $events = false;
        $eventRequests = 0;
        $outcomes = [];

        foreach ($alerts as $alert) {
            $base = $alert->opportunityLog?->matchSnapshot;
            if ($base === null || $base->home_score === null || $base->away_score === null) {
                continue;
            }

            $timeline = $snapshots
                ->filter(fn ($snapshot): bool => $snapshot->id > $base->id)
                ->map(fn ($snapshot): array => [
                    'home' => (int) $snapshot->home_score,
                    'away' => (int) $snapshot->away_score,
                    'minute' => $snapshot->minute === null ? null : (int) $snapshot->minute,
                    'at' => CarbonImmutable::instance($snapshot->captured_at),
                ])
                ->values()
                ->all();
            if ($finalScore !== null) {
                $timeline[] = ['home' => $finalScore['home'], 'away' => $finalScore['away'], 'minute' => $finalScore['minute'], 'at' => $now];
            }

            $chosen = $alert->options->filter($selected)->values();
            $options = $chosen->map(fn (AlertOption $option): array => ['type' => $option->type, 'side' => $option->side, 'line' => $option->line])->all();
            $baseScore = ['home' => (int) $base->home_score, 'away' => (int) $base->away_score];
            $validUntil = $validityAlert && $alert->expires_at !== null ? CarbonImmutable::instance($alert->expires_at) : null;
            $result = $this->settler->settle($options, $baseScore, $timeline, $cancelled, $countExtraTime, $validUntil);

            if ($result['needsEvents']) {
                if ($events === false) {
                    $events = $this->footballProvider->getGoalEvents($trackedMatch->provider_match_id);
                    $eventRequests++;
                }
                $goalOrder = $this->goalOrder($events, $trackedMatch, $result['baseGoals']);
                if ($goalOrder !== null) {
                    $result = $this->settler->settle($options, $baseScore, $timeline, $cancelled, $countExtraTime, $validUntil, $goalOrder);
                }
            }

            foreach ($chosen as $index => $option) {
                $outcome = $result['outcomes'][$index] ?? null;
                if ($outcome !== null) {
                    $outcomes[] = ['alert' => $alert, 'option' => $option, 'outcome' => $outcome];
                }
            }
        }

        return ['outcomes' => $outcomes, 'eventRequests' => $eventRequests];
    }

    /**
     * Score final officiel d’un match terminé ; null si le match n’est pas terminé ou si son score est inconnu.
     *
     * @param  array{status: string, home: int|null, away: int|null, minute: int|null}|null  $official
     * @return array{home: int, away: int, minute: int|null}|null
     */
    private function finalScore(?array $official): ?array
    {
        return $official === null || ! MatchStatus::isFinished($official['status']) || $official['home'] === null || $official['away'] === null
            ? null
            : ['home' => $official['home'], 'away' => $official['away'], 'minute' => $official['minute']];
    }

    /**
     * Équipes des buts marqués après l’alerte, dans l’ordre des événements.
     *
     * @param  list<array{minute: int|null, extra: int|null, team: string, detail: string}>|null  $events
     * @param  int  $baseGoals  Buts marqués avant l’alerte et non annulés depuis.
     * @return list<string>|null
     */
    private function goalOrder(?array $events, TrackedMatch $trackedMatch, int $baseGoals): ?array
    {
        if ($events === null) {
            return null;
        }

        $sides = [];
        foreach ($events as $event) {
            $side = match (mb_strtolower(trim($event['team']))) {
                mb_strtolower(trim($trackedMatch->home_team)) => 'home',
                mb_strtolower(trim($trackedMatch->away_team)) => 'away',
                default => null,
            };
            if ($side === null) {
                return null;
            }

            // API-Football donne pour un but contre son camp l’équipe qui en profite (vérifié : Canada–Maroc, 2022,
            // CSC de N. Aguerd attribué au Canada) : aucune inversion.
            $sides[] = $side;
        }

        $after = array_slice($sides, max(0, $baseGoals));

        return $after === [] ? null : $after;
    }
}
