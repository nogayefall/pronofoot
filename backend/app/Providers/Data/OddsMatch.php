<?php

namespace App\Providers\Data;

final readonly class OddsMatch
{
    /**
     * @param  array<string, int|float>  $exactScoreOdds
     * @param  array<string, int|float>  $overUnderOdds
     * @param  array<string, float>  $overLineOdds  Cotes Over du total de buts par ligne (« 1.5 » => 1.85), pari 36.
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
        public array $overLineOdds = [],
    ) {}
}
