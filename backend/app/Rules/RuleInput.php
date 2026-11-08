<?php

namespace App\Rules;

use InvalidArgumentException;

final readonly class RuleInput
{
    /**
     * @param  array<string, int|float>  $exactScoreOdds
     * @param  array<string, int|float>  $methodScores
     */
    public function __construct(
        public int $homeScore,
        public int $awayScore,
        public array $exactScoreOdds,
        public ?float $vitalityScore = null,
        public ?float $oddsChangePercent = null,
        public array $methodScores = [],
    ) {
        if ($homeScore < 0 || $awayScore < 0) {
            throw new InvalidArgumentException('Les scores du match doivent être positifs ou nuls.');
        }
    }
}
