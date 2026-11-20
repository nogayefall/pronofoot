<?php

namespace App\Providers\Contracts;

use App\Providers\Data\OddsFeed;

interface OddsProvider
{
    /**
     * @param  bool  $includeUnder25  Ajoute la cote Under 2.5 buts (total du match) nécessaire à F121-E2.
     */
    public function getLiveOdds(int $scanNumber = 0, bool $includeUnder25 = false): OddsFeed;

    /**
     * Cotes Over du total de buts par match et par ligne (« 2.5 » => 1.95), marché Over/Under (pari 36).
     * Appelée seulement à la création d’une alerte (option neutre), jamais à chaque relevé ; réponse gardée 60 s.
     *
     * @return array<string, array<string, float>>
     */
    public function getOverLineOdds(): array;
}
