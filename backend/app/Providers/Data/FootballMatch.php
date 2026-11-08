<?php

namespace App\Providers\Data;

final readonly class FootballMatch
{
    /**
     * @param  array<string, int|float>  $statistics
     * @param  array<string, int|float>  $methodScores
     */
    public function __construct(
        public string $providerMatchId,
        public string $homeTeam,
        public string $awayTeam,
        public string $status,
        public ?string $scenario = null,
        public ?string $competition = null,
        public ?string $kickoffAt = null,
        public ?int $minute = null,
        public ?int $homeScore = null,
        public ?int $awayScore = null,
        public array $statistics = [],
        public ?float $vitalityScore = null,
        public array $methodScores = [],
    ) {}
}
