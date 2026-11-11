<?php

namespace App\Rules;

use InvalidArgumentException;

final readonly class RuleConfiguration
{
    /**
     * @param  list<string>  $activeRules
     * @param  array<string, int|float>  $methodWeights
     */
    public function __construct(
        public array $activeRules = ['F121-C', 'F121-C.2', 'F121-D', 'F121-E'],
        public float $maximumDirectionalGap = 1.5,
        public float $zeroZeroOddsWaitThreshold = 2.5,
        public float $zeroZeroGapThreshold = 1.0,
        public float $upcomingScoreOddsLimit = 7.0,
        public float $minimumVitality = 40.0,
        public ?string $trendSource = null,
        public ?float $stableOddsChangePercent = null,
        public float $minimumConvergenceScore = 75.0,
        public array $methodWeights = [],
        public ?string $conditionalOverSuggestion = null,
        public ?string $negativeGapBehavior = null,
    ) {
        foreach ([
            'maximumDirectionalGap' => $maximumDirectionalGap,
            'zeroZeroOddsWaitThreshold' => $zeroZeroOddsWaitThreshold,
            'zeroZeroGapThreshold' => $zeroZeroGapThreshold,
            'upcomingScoreOddsLimit' => $upcomingScoreOddsLimit,
            'minimumVitality' => $minimumVitality,
            'minimumConvergenceScore' => $minimumConvergenceScore,
        ] as $name => $value) {
            if (! is_finite($value) || $value < 0) {
                throw new InvalidArgumentException("Le paramètre {$name} doit être un nombre positif ou nul.");
            }
        }

        if ($minimumVitality > 100 || $minimumConvergenceScore > 100) {
            throw new InvalidArgumentException('La vitalité et la convergence ne peuvent pas dépasser 100.');
        }

        if ($stableOddsChangePercent !== null
            && (! is_finite($stableOddsChangePercent) || $stableOddsChangePercent < 0)) {
            throw new InvalidArgumentException('La tolérance de stabilité doit être un nombre positif ou nul.');
        }

        foreach ($activeRules as $ruleId) {
            if (! is_string($ruleId) || $ruleId === '') {
                throw new InvalidArgumentException('Chaque identifiant de règle active doit être une chaîne non vide.');
            }
        }
    }
}
