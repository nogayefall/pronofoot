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

    /**
     * Tous les matchs d’une date (AAAA-MM-JJ), toutes compétitions, en une requête (fixtures?date=).
     */
    public function getFixturesByDate(string $date): FootballFeed;

    /**
     * Buts d’un match, dans l’ordre (fixtures/events) : une requête, seulement pour départager l’ordre de deux buts
     * marqués entre deux relevés d’un match terminé ayant une alerte.
     *
     * @return list<array{minute: int|null, extra: int|null, team: string, detail: string}>|null Null si indisponible.
     */
    public function getGoalEvents(string $providerMatchId): ?array;

    /**
     * Statut et score final (champ goals : prolongation comprise, tirs au but exclus) de matchs, 20 par requête au plus
     * (fixtures?ids=). Les matchs indisponibles sont absents du résultat.
     *
     * @param  list<string>  $providerMatchIds
     * @return array<string, array{status: string, home: int|null, away: int|null, minute: int|null}>
     */
    public function getFinalScores(array $providerMatchIds): array;
}
