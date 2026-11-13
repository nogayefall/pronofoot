<?php

namespace App\Providers\Contracts;

use App\Providers\Data\OddsFeed;

interface OddsProvider
{
    /**
     * @param  bool  $includeUnder25  Ajoute la cote Under 2.5 buts (total du match) nécessaire à F121-E2.
     */
    public function getLiveOdds(int $scanNumber = 0, bool $includeUnder25 = false): OddsFeed;
}
