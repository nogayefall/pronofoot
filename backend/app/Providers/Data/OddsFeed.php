<?php

namespace App\Providers\Data;

final readonly class OddsFeed
{
    /**
     * @param  list<OddsMatch>  $matches
     */
    public function __construct(
        public string $driver,
        public ?bool $reachable,
        public bool $exactScoreMarketAvailable,
        public ?bool $overUnderMarketAvailable,
        public string $statusMessage,
        public array $matches = [],
        public ?int $requestsUsed = null,
        public ?int $requestsRemaining = null,
        public ?string $rawResponse = null,
        public ?int $matchesWithExactScoreMarket = null,
        public ?int $requestsLimit = null,
    ) {}
}
