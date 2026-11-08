<?php

namespace App\Providers\Contracts;

use App\Providers\Data\FootballFeed;

interface FootballProvider
{
    public function getLiveMatches(int $scanNumber = 0, bool $includeStatistics = true): FootballFeed;
}
