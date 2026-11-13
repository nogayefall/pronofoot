<?php

namespace App\Rules;

use InvalidArgumentException;

final readonly class RuleInput
{
    /**
     * @param  array<string, int|float>  $exactScoreOdds
     * @param  array<string, int|float>  $methodScores
     * @param  bool|null  $halftime  Match arrêté à la mi-temps.
     * @param  float|null  $under25Odds  Cote Under 2.5 buts (total du match), utilisée par F121-E2.
     */
    public function __construct(
        public int $homeScore,
        public int $awayScore,
        public array $exactScoreOdds,
        public ?float $vitalityScore = null,
        public ?float $oddsChangePercent = null,
        public array $methodScores = [],
        public ?bool $halftime = null,
        public ?float $under25Odds = null,
    ) {
        if ($homeScore < 0 || $awayScore < 0) {
            throw new InvalidArgumentException('Les scores du match doivent être positifs ou nuls.');
        }
    }
}
