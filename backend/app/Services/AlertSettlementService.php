<?php

namespace App\Services;

use App\Models\Alert;
use App\Models\AlertOption;
use App\Models\TrackedMatch;
use App\Providers\Contracts\FootballProvider;
use Carbon\CarbonImmutable;

/**
 * Résultat automatique des options en attente des alertes d’un match, à la fin du match. Utilise les scores déjà
 * enregistrés à chaque relevé (aucune requête) ; une seule requête fixtures/events par match, et seulement si deux
 * buts des deux équipes sont tombés entre deux relevés alors que l’ordre compte (option ciblée).
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
        $alerts = Alert::query()
            ->whereHas('opportunityLog', fn ($query) => $query->where('tracked_match_id', $trackedMatch->id))
            ->whereHas('options', fn ($query) => $query->where('outcome', 'pending'))
            ->with(['options', 'opportunityLog.matchSnapshot'])
            ->orderBy('id')
            ->get();
        if ($alerts->isEmpty()) {
            return ['settled' => 0, 'eventRequests' => 0];
        }

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
        $settled = 0;

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

            $pending = $alert->options->where('outcome', 'pending')->values();
            $options = $pending->map(fn (AlertOption $option): array => ['type' => $option->type, 'side' => $option->side, 'line' => $option->line])->all();
            $baseScore = ['home' => (int) $base->home_score, 'away' => (int) $base->away_score];
            $validUntil = $validityAlert && $alert->expires_at !== null ? CarbonImmutable::instance($alert->expires_at) : null;
            $result = $this->settler->settle($options, $baseScore, $timeline, $cancelled, $countExtraTime, $validUntil);

            if ($result['needsEvents']) {
                if ($events === false) {
                    $events = $this->footballProvider->getGoalEvents($trackedMatch->provider_match_id);
                    $eventRequests++;
                }
                $goalOrder = $this->goalOrder($events, $trackedMatch, $baseScore);
                if ($goalOrder !== null) {
                    $result = $this->settler->settle($options, $baseScore, $timeline, $cancelled, $countExtraTime, $validUntil, $goalOrder);
                }
            }

            foreach ($pending as $index => $option) {
                $outcome = $result['outcomes'][$index] ?? null;
                if ($outcome === null) {
                    continue;
                }

                $option->forceFill(['outcome' => $outcome, 'outcome_source' => 'auto', 'settled_at' => $now])->save();
                $settled++;
                if ($option->position === 1) {
                    $alert->opportunityLog?->forceFill(['outcome' => $outcome])->save();
                }
            }
        }

        return ['settled' => $settled, 'eventRequests' => $eventRequests];
    }

    /**
     * Équipes des buts marqués après l’alerte, dans l’ordre des événements. Un but contre son camp profite à l’autre
     * équipe que celle indiquée par l’événement (convention API-Football à confirmer sur une capture réelle).
     *
     * @param  list<array{minute: int|null, extra: int|null, team: string, detail: string}>|null  $events
     * @param  array{home: int, away: int}  $base
     * @return list<string>|null
     */
    private function goalOrder(?array $events, TrackedMatch $trackedMatch, array $base): ?array
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

        $after = array_slice($sides, $base['home'] + $base['away']);

        return $after === [] ? null : $after;
    }
}
