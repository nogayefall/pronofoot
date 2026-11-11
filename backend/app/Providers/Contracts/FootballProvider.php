<?php

namespace App\Providers\Contracts;

use App\Providers\Data\FootballFeed;

interface FootballProvider
{
    public function getLiveMatches(
        int $scanNumber = 0,
        bool $includeStatistics = true,
        ?int $statisticsMatchLimit = 1,
        bool $includeCoverage = false,
    ): FootballFeed;
}
