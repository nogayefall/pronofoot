<?php

namespace App\Providers\Contracts;

use App\Providers\Data\FootballFeed;

interface FootballProvider
{
    /**
     * @param  list<string>|null  $statisticsMatchIds  Matchs dont les statistiques sont demandées (un appel par match). Null : échantillon limité par $statisticsMatchLimit.
     * @param  list<int>|null  $coverageLeagueIds  Avec $includeCoverage : la couverture n’est demandée que si un match live appartient à l’une de ces ligues.
     * @param  int|null  $quotaAlertThreshold  Aucun appel statistiques supplémentaire si le quota restant est nul ou inférieur à ce seuil.
     */
    public function getLiveMatches(
        int $scanNumber = 0,
        bool $includeStatistics = true,
        ?int $statisticsMatchLimit = 1,
        bool $includeCoverage = false,
        ?array $statisticsMatchIds = null,
        ?int $quotaAlertThreshold = null,
        ?array $coverageLeagueIds = null,
    ): FootballFeed;
}
