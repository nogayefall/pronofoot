<?php

namespace App\Providers\Data;

final readonly class FootballFeed
{
    /**
     * @param  list<FootballMatch>  $matches
     * @param  array<string, int|float|string|null>  $simulationSettings
     */
    public function __construct(
        public string $driver,
        public ?bool $reachable,
        public ?bool $statisticsAvailable,
        public string $statusMessage,
        public array $matches = [],
        public ?int $requestsUsed = null,
        public ?int $requestsRemaining = null,
        public ?string $rawResponse = null,
        public array $simulationSettings = [],
    ) {}
}
