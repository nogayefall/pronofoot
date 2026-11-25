<?php

namespace App\Services;

use Carbon\CarbonImmutable;

/**
 * Résultat automatique des options d’une alerte, à partir des scores relevés après l’alerte (classe pure).
 *
 *  - Ciblée : gagnée si l’équipe désignée marque le prochain but après l’alerte ; perdue si l’autre équipe marque
 *    d’abord ou si aucun but n’est marqué. Un but contre son camp compte pour l’équipe dont le score augmente.
 *  - Neutre « un but de plus » : se note sur sa ligne (Over = buts au moment de l’alerte + 0.5), gagnée si le total final
 *    dépasse la ligne, perdue sinon.
 *  - But annulé (le score redescend) : retiré, il ne compte ni pour la ciblée ni pour le total.
 *  - Over 4.5 (F121-D) : gagnée si le total final est de 5 buts ou plus.
 *  - Over 0.5 2e mi-temps (F121-E2) : gagnée si au moins un but est marqué en 2e mi-temps (prolongation exclue).
 *  - Plancher central / prudent (Over N.5 sur le total du match) : gagnée si le total final dépasse la ligne.
 *  - Match arrêté, abandonné ou annulé : annulée.
 *
 * Paramètres (confirmés par le client) : validité jusqu’à la fin du match ou pendant la durée de l’alerte (ciblée, neutre) ;
 * prolongation comptée ou non (minute > 90). Si les deux équipes marquent entre deux relevés et que le prochain but
 * compte (option ciblée), l’ordre des buts doit venir des événements du match : sans eux, le résultat reste en attente.
 */
final class BetSettler
{
    public const REGULATION_MINUTES = 90;

    /**
     * @param  list<array{type: string, side?: string|null, line?: string|null}>  $options
     * @param  array{home: int, away: int}  $base  Score au moment de l’alerte.
     * @param  list<array{home: int, away: int, minute: int|null, at: CarbonImmutable}>  $timeline  Scores relevés après l’alerte.
     * @param  CarbonImmutable|null  $validUntil  Fin de validité (durée de l’alerte) ; null = jusqu’à la fin du match.
     * @param  list<string>|null  $goalOrder  Équipes des buts marqués après l’alerte, dans l’ordre (événements du match).
     * @return array{outcomes: list<string|null>, needsEvents: bool, baseGoals: int} baseGoals : buts marqués avant l’alerte et non annulés depuis.
     */
    public function settle(
        array $options,
        array $base,
        array $timeline,
        bool $cancelled,
        bool $countExtraTime,
        ?CarbonImmutable $validUntil = null,
        ?array $goalOrder = null,
    ): array {
        if ($cancelled) {
            return ['outcomes' => array_fill(0, count($options), 'cancelled'), 'needsEvents' => false, 'baseGoals' => $base['home'] + $base['away']];
        }

        $counted = array_values(array_filter(
            $timeline,
            fn (array $step): bool => $countExtraTime || $step['minute'] === null || $step['minute'] <= self::REGULATION_MINUTES,
        ));
        $withinValidity = $validUntil === null
            ? $counted
            : array_values(array_filter($counted, fn (array $step): bool => $step['at']->lessThanOrEqualTo($validUntil)));
        $regulation = array_values(array_filter(
            $timeline,
            fn (array $step): bool => $step['minute'] === null || $step['minute'] <= self::REGULATION_MINUTES,
        ));

        $needsEvents = false;
        $outcomes = [];
        foreach ($options as $option) {
            $outcomes[] = match ($option['type']) {
                'targeted' => $this->targeted((string) ($option['side'] ?? ''), $base, $withinValidity, $goalOrder, $needsEvents),
                'neutral' => $this->overLine($option['line'] ?? 'Over '.($base['home'] + $base['away'] + 0.5), $base, $withinValidity),
                'over45' => $this->finalTotal($base, $counted) >= 5 ? 'won' : 'lost',
                'halftime_over05' => $this->goals($base, $regulation)['goals'] === [] ? 'lost' : 'won',
                'plancher_central', 'plancher_prudent' => $this->overLine($option['line'] ?? null, $base, $counted),
                default => null,
            };
        }

        return ['outcomes' => $outcomes, 'needsEvents' => $needsEvents, 'baseGoals' => $this->goals($base, $withinValidity)['baseGoals']];
    }

    /**
     * @param  array{home: int, away: int}  $base
     * @param  list<array{home: int, away: int, minute: int|null, at: CarbonImmutable}>  $steps
     * @param  list<string>|null  $goalOrder
     */
    private function targeted(string $side, array $base, array $steps, ?array $goalOrder, bool &$needsEvents): ?string
    {
        $first = $this->goals($base, $steps)['goals'][0] ?? null;
        if ($first === null) {
            return 'lost';
        }

        $scorer = match (true) {
            $first['home'] > 0 && $first['away'] === 0 => 'home',
            $first['away'] > 0 && $first['home'] === 0 => 'away',
            default => $goalOrder[0] ?? null,
        };
        if ($scorer === null) {
            $needsEvents = true;

            return null;
        }

        return $scorer === $side ? 'won' : 'lost';
    }

    /**
     * Buts marqués après l’alerte et non annulés, relevé par relevé (augmentations du score). Quand le score d’une équipe
     * redescend (but annulé), son dernier but est retiré ; s’il date d’avant l’alerte, il est retiré du score de départ.
     *
     * @param  array{home: int, away: int}  $base
     * @param  list<array{home: int, away: int, minute: int|null, at: CarbonImmutable}>  $steps
     * @return array{goals: list<array{home: int, away: int}>, baseGoals: int}
     */
    private function goals(array $base, array $steps): array
    {
        $previous = $base;
        $baseGoals = $base['home'] + $base['away'];
        $goals = [];
        foreach ($steps as $step) {
            foreach (['home', 'away'] as $side) {
                $cancelled = max(0, $previous[$side] - $step[$side]);
                for ($index = count($goals) - 1; $index >= 0 && $cancelled > 0; $index--) {
                    $removed = min($cancelled, $goals[$index][$side]);
                    $goals[$index][$side] -= $removed;
                    $cancelled -= $removed;
                }
                $baseGoals -= $cancelled;
            }
            $goals = array_values(array_filter($goals, fn (array $goal): bool => $goal['home'] + $goal['away'] > 0));

            $home = max(0, $step['home'] - $previous['home']);
            $away = max(0, $step['away'] - $previous['away']);
            if ($home + $away > 0) {
                $goals[] = ['home' => $home, 'away' => $away];
            }
            $previous = ['home' => $step['home'], 'away' => $step['away']];
        }

        return ['goals' => $goals, 'baseGoals' => $baseGoals];
    }

    /**
     * Over N.5 sur le total du match (buts marqués avant l’alerte inclus) : gagnée si le total final dépasse la ligne.
     *
     * @param  array{home: int, away: int}  $base
     * @param  list<array{home: int, away: int, minute: int|null, at: CarbonImmutable}>  $steps
     */
    private function overLine(?string $line, array $base, array $steps): ?string
    {
        if ($line === null || ! preg_match('/(\d+(?:\.\d+)?)/', $line, $match)) {
            return null;
        }

        return $this->finalTotal($base, $steps) > (float) $match[1] ? 'won' : 'lost';
    }

    /**
     * @param  array{home: int, away: int}  $base
     * @param  list<array{home: int, away: int, minute: int|null, at: CarbonImmutable}>  $steps
     */
    private function finalTotal(array $base, array $steps): int
    {
        $last = $steps === [] ? $base : $steps[array_key_last($steps)];

        return $last['home'] + $last['away'];
    }
}
