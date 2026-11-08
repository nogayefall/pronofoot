<?php

namespace App\Providers\Real;

use App\Providers\Contracts\OddsProvider;
use App\Providers\Data\OddsFeed;

final class TheOddsApiProvider implements OddsProvider
{
    public function getLiveOdds(int $scanNumber = 0): OddsFeed
    {
        return new OddsFeed(
            driver: 'real',
            reachable: null,
            exactScoreMarketAvailable: false,
            overUnderMarketAvailable: null,
            statusMessage: 'Marché des scores exacts non disponible dans le catalogue officiel consulté ; aucune requête ni conversion de marché équivalente n’est tentée.',
        );
    }
}
