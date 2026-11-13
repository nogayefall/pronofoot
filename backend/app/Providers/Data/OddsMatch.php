<?php

namespace App\Providers\Data;

final readonly class OddsMatch
{
    /**
     * @param  array<string, int|float>  $exactScoreOdds
     * @param  array<string, int|float>  $overUnderOdds
     * @param  float|null  $under25Odds  Cote Under 2.5 buts (total du match). Pilote réel : non branché tant que le format de bet 36 n’est pas capturé.
     */
    public function __construct(
        public string $providerMatchId,
        public array $exactScoreOdds = [],
        public array $overUnderOdds = [],
        public ?int $minute = null,
        public ?int $homeScore = null,
        public ?int $awayScore = null,
        public ?bool $stopped = null,
        public ?float $under25Odds = null,
    ) {}
}
