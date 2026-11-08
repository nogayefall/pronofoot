<?php

namespace App\Rules;

final class VitalityFilter
{
    public function evaluate(RuleInput $input, RuleConfiguration $configuration): FilterResult
    {
        $score = $input->vitalityScore;
        if ($score === null || ! is_finite($score) || $score < 0 || $score > 100) {
            return new FilterResult(false, 'Un indice de vitalité valide entre 0 et 100 est nécessaire.');
        }

        $passed = $score >= $configuration->minimumVitality;

        return new FilterResult(
            passed: $passed,
            reason: $passed ? null : 'La vitalité est inférieure au seuil configuré.',
            details: ['score' => $score, 'minimum' => $configuration->minimumVitality],
        );
    }
}
