<?php

namespace App\Rules;

final class TrendFilter
{
    public function evaluate(RuleInput $input, RuleConfiguration $configuration): FilterResult
    {
        $change = $input->oddsChangePercent;
        if ($change === null || ! is_finite($change)) {
            return new FilterResult(false, 'La variation de cote sur les deux dernières minutes est indisponible.');
        }

        if ($change < 0) {
            return new FilterResult(true, details: ['oddsChangePercent' => $change, 'trend' => 'falling']);
        }

        $tolerance = $configuration->stableOddsChangePercent;
        if ($tolerance !== null && $tolerance > 0 && abs($change) < $tolerance) {
            return new FilterResult(true, details: ['oddsChangePercent' => $change, 'trend' => 'stable']);
        }

        return new FilterResult(
            false,
            $tolerance === null
                ? 'La limite de variation définissant une tendance stable doit être confirmée.'
                : 'La tendance n’est ni baissière ni stable selon le seuil configuré.',
            ['oddsChangePercent' => $change, 'stableTolerancePercent' => $tolerance],
        );
    }
}
