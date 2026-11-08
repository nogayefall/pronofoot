<?php

namespace App\Providers\Data;

final readonly class OddsMatch
{
    /**
     * @param  array<string, int|float>  $exactScoreOdds
     * @param  array<string, int|float>  $overUnderOdds
     */
    public function __construct(
        public string $providerMatchId,
        public array $exactScoreOdds = [],
        public array $overUnderOdds = [],
        public ?int $minute = null,
        public ?int $homeScore = null,
        public ?int $awayScore = null,
    ) {}
}
