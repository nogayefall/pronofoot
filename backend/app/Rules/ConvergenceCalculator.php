<?php

namespace App\Rules;

use InvalidArgumentException;

final class ConvergenceCalculator
{
    /**
     * @param  array<string, int|float>  $scores
     * @param  array<string, int|float>  $weights
     */
    public function calculate(array $scores, array $weights): ?float
    {
        $weightedTotal = 0.0;
        $totalWeight = 0.0;

        foreach ($weights as $method => $weight) {
            if (! is_numeric($weight) || ! is_finite((float) $weight) || (float) $weight < 0) {
                throw new InvalidArgumentException("Le poids de {$method} doit être un nombre positif ou nul.");
            }

            $weight = (float) $weight;
            if ($weight === 0.0) {
                continue;
            }

            if (! array_key_exists($method, $scores)) {
                return null;
            }

            $score = $scores[$method];
            if (! is_numeric($score) || ! is_finite((float) $score) || (float) $score < 0 || (float) $score > 100) {
                throw new InvalidArgumentException("Le score de {$method} doit être compris entre 0 et 100.");
            }

            $weightedTotal += (float) $score * $weight;
            $totalWeight += $weight;
        }

        return $totalWeight > 0 ? $weightedTotal / $totalWeight : null;
    }
}
