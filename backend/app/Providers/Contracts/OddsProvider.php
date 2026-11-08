<?php

namespace App\Providers\Contracts;

use App\Providers\Data\OddsFeed;

interface OddsProvider
{
    public function getLiveOdds(int $scanNumber = 0): OddsFeed;
}
