<?php

namespace App\Services;

final readonly class ScanPassResult
{
    /**
     * @param  list<array{match: string, type: string, reason: string}>  $incidents  Incidents consignés pendant ce passage.
     */
    public function __construct(
        public int $matchesScanned,
        public int $snapshotsStored,
        public int $alertsCreated,
        public int $alertsExpired,
        public int $goalsDetected,
        public int $errors,
        public int $nextPollIntervalSeconds,
        public bool $quotaStopped = false,
        public array $incidents = [],
        public bool $economyMode = false,
        public int $matchesNotScanned = 0,
        public int $autoTracked = 0,
        public int $matchesEnded = 0,
        public bool $idle = false,
    ) {}
}
