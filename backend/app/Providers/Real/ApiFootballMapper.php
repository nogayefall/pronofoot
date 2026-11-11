<?php

namespace App\Providers\Real;

use App\Providers\Data\FootballFeed;
use App\Providers\Data\FootballMatch;
use App\Providers\Data\OddsFeed;
use App\Providers\Data\OddsMatch;
use JsonException;

final class ApiFootballMapper
{
    public function map(string $rawResponse): FootballFeed
    {
        return $this->mapFootball($rawResponse);
    }

    public function mapFootball(
        string $rawResponse,
        ?string $rawStatisticsResponse = null,
        ?string $statisticsMatchId = null,
        ?int $requestsUsed = null,
        ?int $requestsRemaining = null,
        ?int $requestsLimit = null,
        ?string $rawCoverageResponse = null,
    ): FootballFeed {
        try {
            $payload = json_decode($rawResponse, true, flags: JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            return new FootballFeed(
                driver: 'real',
                reachable: false,
                statisticsAvailable: null,
                statusMessage: 'La réponse fixtures?live=all ne contient pas un document JSON valide.',
                requestsUsed: $requestsUsed,
                requestsRemaining: $requestsRemaining,
                requestsLimit: $requestsLimit,
                rawResponse: $rawResponse,
                statisticsMatchId: $statisticsMatchId,
                rawStatisticsResponse: $rawStatisticsResponse,
            );
        }

        if (! is_array($payload) || ! is_array($payload['response'] ?? null)) {
            return new FootballFeed(
                driver: 'real',
                reachable: true,
                statisticsAvailable: null,
                statusMessage: 'La réponse fixtures?live=all ne contient pas la liste response attendue.',
                requestsUsed: $requestsUsed,
                requestsRemaining: $requestsRemaining,
                requestsLimit: $requestsLimit,
                rawResponse: $rawResponse,
                statisticsMatchId: $statisticsMatchId,
                rawStatisticsResponse: $rawStatisticsResponse,
            );
        }

        $coverage = $this->statisticsCoverageByLeague($rawCoverageResponse);
        $matches = [];
        foreach ($payload['response'] as $item) {
            if (! is_array($item) || ! is_array($item['fixture'] ?? null)) {
                continue;
            }

            $fixtureId = $item['fixture']['id'] ?? null;
            if ((! is_string($fixtureId) || ! ctype_digit($fixtureId))
                && (! is_int($fixtureId) || $fixtureId < 1)) {
                continue;
            }

            $status = $item['fixture']['status'] ?? [];
            $teams = $item['teams'] ?? [];
            $goals = $item['goals'] ?? [];
            $league = is_array($item['league'] ?? null) ? $item['league'] : [];
            $leagueId = is_numeric($league['id'] ?? null) ? (int) $league['id'] : null;
            $matchSeason = is_numeric($league['season'] ?? null) ? (int) $league['season'] : null;
            $leagueCoverage = $leagueId === null ? null : ($coverage[(string) $leagueId] ?? null);
            $coverageSeason = $matchSeason;
            $coverageFallback = false;
            $statisticsCoverage = null;
            if ($leagueCoverage !== null) {
                if ($matchSeason !== null && array_key_exists((string) $matchSeason, $leagueCoverage['seasons'])) {
                    $statisticsCoverage = $leagueCoverage['seasons'][(string) $matchSeason];
                } elseif ($leagueCoverage['current'] !== null) {
                    $coverageFallback = true;
                    $coverageSeason = $leagueCoverage['current'];
                    $statisticsCoverage = $leagueCoverage['seasons'][(string) $coverageSeason] ?? null;
                }
            }
            $matches[] = new FootballMatch(
                providerMatchId: (string) $fixtureId,
                homeTeam: $this->availableString($teams['home']['name'] ?? null),
                awayTeam: $this->availableString($teams['away']['name'] ?? null),
                status: $this->availableString($status['long'] ?? null),
                minute: is_numeric($status['elapsed'] ?? null) ? (int) $status['elapsed'] : null,
                homeScore: is_numeric($goals['home'] ?? null) ? (int) $goals['home'] : null,
                awayScore: is_numeric($goals['away'] ?? null) ? (int) $goals['away'] : null,
                competition: $this->availableString($league['name'] ?? null),
                statistics: [
                    'shots' => null,
                    'shots_on_target' => null,
                    'possession' => null,
                    'corners' => null,
                ],
                leagueId: $leagueId,
                statisticsCoverage: $statisticsCoverage,
                statisticsCoverageFallback: $coverageFallback,
                statisticsCoverageSeason: $coverageSeason,
            );
        }

        $statisticsAvailable = $rawStatisticsResponse === null
            ? null
            : false;
        $statisticsMessage = $this->statisticsStatusMessage($rawStatisticsResponse);

        return new FootballFeed(
            driver: 'real',
            reachable: true,
            statisticsAvailable: $statisticsAvailable,
            statusMessage: $statisticsMessage,
            matches: $matches,
            requestsUsed: $requestsUsed,
            requestsRemaining: $requestsRemaining,
            requestsLimit: $requestsLimit,
            rawResponse: $rawResponse,
            statisticsMatchId: $statisticsMatchId,
            rawStatisticsResponse: $rawStatisticsResponse,
        );
    }

    /**
     * @return array<string, array{seasons: array<string, bool|null>, current: int|null}>
     */
    private function statisticsCoverageByLeague(?string $rawResponse): array
    {
        if ($rawResponse === null) {
            return [];
        }

        try {
            $payload = json_decode($rawResponse, true, flags: JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            return [];
        }

        if (! is_array($payload) || ! is_array($payload['response'] ?? null)) {
            return [];
        }

        $coverage = [];
        foreach ($payload['response'] as $entry) {
            if (! is_array($entry)
                || ! is_array($entry['league'] ?? null)
                || ! is_array($entry['seasons'] ?? null)) {
                continue;
            }

            $leagueId = $entry['league']['id'] ?? null;
            if (! is_int($leagueId) && ! (is_string($leagueId) && ctype_digit($leagueId))) {
                continue;
            }

            $coverage[(string) $leagueId] ??= ['seasons' => [], 'current' => null];
            foreach ($entry['seasons'] as $season) {
                if (! is_array($season)) {
                    continue;
                }

                $year = $season['year'] ?? null;
                if (! is_int($year) && ! (is_string($year) && ctype_digit($year))) {
                    continue;
                }

                $statistics = $season['coverage']['fixtures']['statistics_fixtures'] ?? null;
                $coverage[(string) $leagueId]['seasons'][(string) $year] = is_bool($statistics) ? $statistics : null;
                if (($season['current'] ?? null) === true) {
                    $coverage[(string) $leagueId]['current'] = (int) $year;
                }
            }
        }

        return $coverage;
    }

    public function mapOdds(
        string $rawResponse,
        ?int $requestsUsed = null,
        ?int $requestsRemaining = null,
        ?int $requestsLimit = null,
    ): OddsFeed {
        try {
            $payload = json_decode($rawResponse, true, flags: JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            return new OddsFeed(
                driver: 'api_football',
                reachable: false,
                exactScoreMarketAvailable: false,
                overUnderMarketAvailable: null,
                statusMessage: 'La réponse odds/live?bet=23 ne contient pas un document JSON valide.',
                requestsUsed: $requestsUsed,
                requestsRemaining: $requestsRemaining,
                rawResponse: $rawResponse,
                matchesWithExactScoreMarket: 0,
                requestsLimit: $requestsLimit,
            );
        }

        if (! is_array($payload) || ! is_array($payload['response'] ?? null)) {
            return new OddsFeed(
                driver: 'api_football',
                reachable: true,
                exactScoreMarketAvailable: false,
                overUnderMarketAvailable: null,
                statusMessage: 'La réponse odds/live?bet=23 ne contient pas la liste response attendue.',
                requestsUsed: $requestsUsed,
                requestsRemaining: $requestsRemaining,
                rawResponse: $rawResponse,
                matchesWithExactScoreMarket: 0,
                requestsLimit: $requestsLimit,
            );
        }

        $matches = [];
        $matchesWithMarket = 0;
        foreach ($payload['response'] as $item) {
            if (! is_array($item) || ! is_array($item['odds'] ?? null)) {
                continue;
            }

            $exactScoreOdds = [];
            $hasMarket = false;
            foreach ($item['odds'] as $market) {
                if (! is_array($market)
                    || ($market['id'] ?? null) !== 23
                    || ! is_array($market['values'] ?? null)) {
                    continue;
                }

                $hasMarket = true;
                foreach ($market['values'] as $value) {
                    if (! is_array($value)
                        || ($value['suspended'] ?? false) === true
                        || ! is_string($value['value'] ?? null)
                        || ! preg_match('/^\d{1,2}-\d{1,2}$/', $value['value'])
                        || ! is_numeric($value['odd'] ?? null)
                        || ! is_finite((float) $value['odd'])
                        || (float) $value['odd'] <= 0) {
                        continue;
                    }

                    $exactScoreOdds[$value['value']] = (float) $value['odd'];
                }
            }

            if ($hasMarket) {
                $matchesWithMarket++;
            }

            if (! $hasMarket
                || ! is_array($item['fixture'] ?? null)
                || ! is_array($item['fixture']['status'] ?? null)
                || ! is_array($item['status'] ?? null)
                || ! isset($item['fixture']['id'])) {
                continue;
            }

            $fixtureStatus = $item['fixture']['status'];
            $status = $item['status'];
            if (strcasecmp((string) ($fixtureStatus['long'] ?? ''), 'Not Started') === 0
                || ($status['stopped'] ?? false) === true) {
                continue;
            }

            $teams = $item['teams'] ?? [];
            $matches[] = new OddsMatch(
                providerMatchId: (string) $item['fixture']['id'],
                exactScoreOdds: $exactScoreOdds,
                minute: is_numeric($fixtureStatus['elapsed'] ?? null) ? (int) $fixtureStatus['elapsed'] : null,
                homeScore: is_numeric($teams['home']['goals'] ?? null) ? (int) $teams['home']['goals'] : null,
                awayScore: is_numeric($teams['away']['goals'] ?? null) ? (int) $teams['away']['goals'] : null,
            );
        }

        return new OddsFeed(
            driver: 'api_football',
            reachable: true,
            exactScoreMarketAvailable: $matchesWithMarket > 0,
            overUnderMarketAvailable: null,
            statusMessage: $matchesWithMarket > 0
                ? 'Marché API-Football bet 23 disponible ; les cotes suspendues sont ignorées.'
                : 'Aucun match ne contient le marché API-Football bet 23.',
            matches: $matches,
            requestsUsed: $requestsUsed,
            requestsRemaining: $requestsRemaining,
            rawResponse: $rawResponse,
            matchesWithExactScoreMarket: $matchesWithMarket,
            requestsLimit: $requestsLimit,
        );
    }

    private function availableString(mixed $value): string
    {
        return is_string($value) && trim($value) !== '' ? $value : 'Non disponible';
    }

    private function statisticsStatusMessage(?string $rawStatisticsResponse): string
    {
        if ($rawStatisticsResponse === null) {
            return 'Les champs football live sont lus ; les statistiques ne sont pas demandées.';
        }

        try {
            $payload = json_decode($rawStatisticsResponse, true, flags: JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            return 'Les statistiques du match échantillon ne sont pas disponibles : réponse JSON invalide.';
        }

        if (is_array($payload) && ($payload['results'] ?? null) === 0) {
            return 'Les statistiques du match échantillon ne sont pas disponibles : API-Football a renvoyé results=0.';
        }

        return 'Les statistiques sont non disponibles : la capture ne fournit pas de réponse non vide permettant de vérifier leur structure.';
    }
}
