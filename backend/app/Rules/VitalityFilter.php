<?php

namespace App\Rules;

final class VitalityFilter
{
    public function evaluate(RuleInput $input, RuleConfiguration $configuration): FilterResult
    {
        $score = $input->vitalityScore;
        if ($score === null || ! is_finite($score) || $score < 0 || $score > 100) {
            return new FilterResult(false, 'Vitalité non calculable : une statistique manque.');
        }

        $passed = $score >= $configuration->minimumVitality;

        return new FilterResult(
            passed: $passed,
            reason: $passed ? null : 'Match « mort » : vitalité inférieure au minimum configuré.',
            details: ['score' => $score, 'minimum' => $configuration->minimumVitality],
        );
    }
}
