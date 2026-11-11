<?php

namespace App\Providers\Data;

final readonly class FootballMatch
{
    /**
     * @param  array<string, int|float|null>  $statistics
     * @param  array<string, int|float>  $methodScores
     * @param  array<string, int|float>  $exactScoreOdds
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
        public ?string $statusSeconds = null,
        public ?bool $stopped = null,
        public ?bool $blocked = null,
        public ?bool $finished = null,
        public ?string $updatedAt = null,
        public array $exactScoreOdds = [],
        public ?int $leagueId = null,
        public ?bool $statisticsCoverage = null,
        public bool $statisticsCoverageFallback = false,
        public ?int $statisticsCoverageSeason = null,
    ) {}
}
