<?php

namespace App\Services;

final readonly class ScanPassResult
{
    public function __construct(
        public int $matchesScanned,
        public int $snapshotsStored,
        public int $alertsCreated,
        public int $alertsExpired,
        public int $goalsDetected,
        public int $errors,
        public int $nextPollIntervalSeconds,
    ) {}
}
