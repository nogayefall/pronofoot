<?php

namespace App\Rules;

/**
 * Tendance de la cote du score suggéré sur 2 minutes (complément 2) : seule une hausse bloque.
 * Une baisse de plus du seuil (5 %) est une « forte baisse » qui déclenche F162-Bis dans l’ordre de décision.
 * Une tendance non calculable (pas d’instantané à −2 min) donne une abstention, à confirmer.
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
        if ($change > 0) {
            return new FilterResult(false, 'La cote monte : abstention.', [...$details, 'trend' => 'rising']);
        }

        return new FilterResult(true, details: [...$details, 'trend' => match (true) {
            $change < -$threshold => 'strong_drop',
            $change < 0 => 'falling',
            default => 'stable',
        }]);
    }
}
