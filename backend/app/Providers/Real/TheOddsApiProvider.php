<?php

namespace App\Providers\Real;

use App\Providers\Contracts\OddsProvider;
use App\Providers\Data\OddsFeed;

final class TheOddsApiProvider implements OddsProvider
{
    /**
     * Marché Over/Under non branché pour ce fournisseur : l’option neutre reste sans cote.
     */
    public function getOverLineOdds(): array
    {
        return [];
    }

    public function getLiveOdds(int $scanNumber = 0, bool $includeUnder25 = false, bool $includeGoalLines = false): OddsFeed
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
