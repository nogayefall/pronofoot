<?php

namespace App\Providers\Real;

use App\Providers\Data\FootballFeed;

final class ApiFootballMapper
{
    public function map(string $rawResponse): FootballFeed
    {
        return new FootballFeed(
            driver: 'real',
            reachable: true,
            statisticsAvailable: null,
            statusMessage: 'NON VÉRIFIÉ : le mapper ne lit aucun champ tant qu’une vraie réponse documentée n’a pas été validée.',
            rawResponse: $rawResponse,
        );
    }
}
