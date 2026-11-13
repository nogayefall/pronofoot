<?php

namespace App\Rules;

/**
 * Tendance de la cote du score suggéré : seule une baisse strictement supérieure au seuil valide le filtre.
 * Stable (variation inférieure au seuil) ou hausse : abstention. Baisse exactement égale au seuil : à confirmer, abstention.
 */
final class TrendFilter
{
    public function evaluate(RuleInput $input, RuleConfiguration $configuration): FilterResult
    {
        $change = $input->oddsChangePercent;
        $threshold = $configuration->stableOddsChangePercent;
        if ($configuration->trendSource !== 'cote_suggeree'
            || $threshold === null
            || $change === null
            || ! is_finite($change)) {
            return new FilterResult(false, 'La tendance est non calculable : sa source, son seuil ou un instantané valide manque.');
        }

        $details = ['oddsChangePercent' => $change, 'thresholdPercent' => $threshold];
        if (abs($change + $threshold) < 1e-9) {
            return new FilterResult(
                false,
                'Baisse exactement égale au seuil : cas à confirmer par le client, abstention.',
                [...$details, 'trend' => 'threshold'],
            );
        }

        if ($change < -$threshold) {
            return new FilterResult(true, details: [...$details, 'trend' => 'falling']);
        }

        return new FilterResult(
            false,
            $change > 0 ? 'La cote monte : abstention.' : 'La cote est stable : abstention.',
            [...$details, 'trend' => $change > 0 ? 'rising' : 'stable'],
        );
    }
}
