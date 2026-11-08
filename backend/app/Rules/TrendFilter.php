<?php

namespace App\Rules;

final class TrendFilter
{
    public function evaluate(RuleInput $input, RuleConfiguration $configuration): FilterResult
    {
        $change = $input->oddsChangePercent;
        $tolerance = $configuration->stableOddsChangePercent;
        if ($configuration->trendSource !== 'cote_suggeree'
            || $tolerance === null
            || $change === null
            || ! is_finite($change)) {
            return new FilterResult(false, 'La tendance est non calculable : sa source, son seuil ou un instantané valide manque.');
        }

        if ($change < 0) {
            return new FilterResult(true, details: ['oddsChangePercent' => $change, 'trend' => 'falling']);
        }

        if (abs($change) <= $tolerance) {
            return new FilterResult(true, details: ['oddsChangePercent' => $change, 'trend' => 'stable']);
        }

        return new FilterResult(
            false,
            'La tendance n’est ni baissière ni stable selon le seuil configuré.',
            ['oddsChangePercent' => $change, 'stableTolerancePercent' => $tolerance],
        );
    }
}
