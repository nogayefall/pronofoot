<?php

namespace App\Providers\Real;

use App\Providers\Data\FootballFeed;
use App\Providers\Data\FootballMatch;
use App\Providers\Data\OddsFeed;
use App\Providers\Data\OddsMatch;
use JsonException;

final class ApiFootballMapper
{
    /**
     * Codes « In Play » de la documentation API-Football (docs/api-football-documentation.md).
     */
    private const IN_PLAY_STATUS_CODES = ['1H', 'HT', '2H', 'ET', 'BT', 'P', 'SUSP', 'INT', 'LIVE'];

    public function map(string $rawResponse): FootballFeed
    {
        return $this->mapFootball($rawResponse);
    }

    /**
     * @param  array<string, string>  $rawStatisticsResponses  Réponses fixtures/statistics brutes, indexées par identifiant de match.
     */
    public function mapFootball(
        string $rawResponse,
        ?string $rawStatisticsResponse = null,
        ?string $statisticsMatchId = null,
        ?int $requestsUsed = null,
        ?int $requestsRemaining = null,
        ?int $requestsLimit = null,
        ?string $rawCoverageResponse = null,
        array $rawStatisticsResponses = [],
    ): FootballFeed {
        $statisticsResponses = $rawStatisticsResponses;
        if ($rawStatisticsResponse !== null && $statisticsMatchId !== null) {
            $statisticsResponses[$statisticsMatchId] ??= $rawStatisticsResponse;
        }

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
            $homeTeamId = $this->teamId($teams['home']['id'] ?? null);
            $awayTeamId = $this->teamId($teams['away']['id'] ?? null);
            $rawMatchStatistics = $statisticsResponses[(string) $fixtureId] ?? null;
            $matches[] = new FootballMatch(
                providerMatchId: (string) $fixtureId,
                homeTeam: $this->availableString($teams['home']['name'] ?? null),
                awayTeam: $this->availableString($teams['away']['name'] ?? null),
                status: $this->availableString($status['long'] ?? null),
                minute: is_numeric($status['elapsed'] ?? null) ? (int) $status['elapsed'] : null,
                homeScore: is_numeric($goals['home'] ?? null) ? (int) $goals['home'] : null,
                awayScore: is_numeric($goals['away'] ?? null) ? (int) $goals['away'] : null,
                competition: $this->competition($league),
                kickoffAt: is_string($item['fixture']['date'] ?? null) && trim($item['fixture']['date']) !== ''
                    ? $item['fixture']['date']
                    : null,
                statistics: $rawMatchStatistics === null
                    ? []
                    : $this->teamStatistics($rawMatchStatistics, $homeTeamId, $awayTeamId),
                leagueId: $leagueId,
                statisticsCoverage: $statisticsCoverage,
                statisticsCoverageFallback: $coverageFallback,
                statisticsCoverageSeason: $coverageSeason,
                homeTeamId: $homeTeamId,
                awayTeamId: $awayTeamId,
                inPlay: is_string($status['short'] ?? null)
                    ? in_array($status['short'], self::IN_PLAY_STATUS_CODES, true)
                    : null,
            );
        }

        $statisticsAvailable = $statisticsResponses === []
            ? null
            : collect($matches)->contains(fn (FootballMatch $match): bool => $this->hasStatisticValue($match->statistics));
        $statisticsMessage = $statisticsAvailable === true
            ? 'Statistiques API-Football lues par équipe : tirs, tirs cadrés, corners et possession. La vitalité est calculée par le scan selon le barème de l’annexe.'
            : $this->statisticsStatusMessage($statisticsResponses === [] ? null : (string) reset($statisticsResponses));

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
            if (strcasecmp((string) ($fixtureStatus['long'] ?? ''), 'Not Started') === 0) {
                continue;
            }

            $teams = $item['teams'] ?? [];
            $matches[] = new OddsMatch(
                providerMatchId: (string) $item['fixture']['id'],
                exactScoreOdds: $exactScoreOdds,
                minute: is_numeric($fixtureStatus['elapsed'] ?? null) ? (int) $fixtureStatus['elapsed'] : null,
                homeScore: is_numeric($teams['home']['goals'] ?? null) ? (int) $teams['home']['goals'] : null,
                awayScore: is_numeric($teams['away']['goals'] ?? null) ? (int) $teams['away']['goals'] : null,
                stopped: is_bool($status['stopped'] ?? null) ? $status['stopped'] : null,
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

    /**
     * Nom de la ligue suivi du pays fourni par API-Football (sauf « World »), pour distinguer les homonymes.
     *
     * @param  array<string, mixed>  $league
     */
    private function competition(array $league): string
    {
        $name = $this->availableString($league['name'] ?? null);
        $country = $league['country'] ?? null;
        if ($name === 'Non disponible' || ! is_string($country) || trim($country) === '' || $country === 'World') {
            return $name;
        }

        return "{$name} · {$country}";
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

        return 'Les statistiques sont non disponibles : aucune valeur de tirs, tirs cadrés, corners ou possession n’est associée aux équipes du match.';
    }

    /**
     * Lit uniquement les quatre statistiques retenues, associées au domicile et à l’extérieur par team.id.
     *
     * @return array{}|array{home: array{shots: int|float|null, shots_on_target: int|float|null, corners: int|float|null, possession: int|float|null}, away: array{shots: int|float|null, shots_on_target: int|float|null, corners: int|float|null, possession: int|float|null}}
     */
    private function teamStatistics(string $rawStatisticsResponse, ?int $homeTeamId, ?int $awayTeamId): array
    {
        try {
            $payload = json_decode($rawStatisticsResponse, true, flags: JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            return [];
        }

        if (! is_array($payload) || ! is_array($payload['response'] ?? null)) {
            return [];
        }

        $byTeam = [];
        foreach ($payload['response'] as $entry) {
            if (! is_array($entry) || ! is_array($entry['statistics'] ?? null)) {
                continue;
            }

            $teamId = $this->teamId($entry['team']['id'] ?? null);
            if ($teamId !== null) {
                $byTeam[$teamId] = $entry['statistics'];
            }
        }

        $home = $homeTeamId === null ? null : ($byTeam[$homeTeamId] ?? null);
        $away = $awayTeamId === null ? null : ($byTeam[$awayTeamId] ?? null);
        if ($home === null && $away === null) {
            return [];
        }

        return [
            'home' => $this->readStatistics($home ?? []),
            'away' => $this->readStatistics($away ?? []),
        ];
    }

    /**
     * @param  array<int, mixed>  $statistics
     * @return array{shots: int|float|null, shots_on_target: int|float|null, corners: int|float|null, possession: int|float|null}
     */
    private function readStatistics(array $statistics): array
    {
        $types = [
            'Total Shots' => 'shots',
            'Shots on Goal' => 'shots_on_target',
            'Corner Kicks' => 'corners',
            'Ball Possession' => 'possession',
        ];
        $values = array_fill_keys(array_values($types), null);

        foreach ($statistics as $statistic) {
            if (! is_array($statistic) || ! is_string($statistic['type'] ?? null)) {
                continue;
            }

            $key = $types[$statistic['type']] ?? null;
            if ($key === null) {
                continue;
            }

            $values[$key] = $key === 'possession'
                ? $this->percentage($statistic['value'] ?? null)
                : $this->count($statistic['value'] ?? null);
        }

        return $values;
    }

    private function count(mixed $value): ?int
    {
        if (is_int($value) && $value >= 0) {
            return $value;
        }

        return is_string($value) && ctype_digit($value) ? (int) $value : null;
    }

    private function percentage(mixed $value): int|float|null
    {
        if (is_string($value) && preg_match('/^\s*(\d{1,3}(?:\.\d+)?)\s*%\s*$/', $value, $matches) === 1) {
            $number = (float) $matches[1];
        } elseif (is_int($value) || is_float($value)) {
            $number = (float) $value;
        } else {
            return null;
        }

        if ($number < 0 || $number > 100) {
            return null;
        }

        return floor($number) === $number ? (int) $number : $number;
    }

    private function teamId(mixed $value): ?int
    {
        if (is_int($value) && $value > 0) {
            return $value;
        }

        return is_string($value) && ctype_digit($value) && (int) $value > 0 ? (int) $value : null;
    }

    /**
     * @param  array<string, mixed>  $statistics
     */
    private function hasStatisticValue(array $statistics): bool
    {
        foreach (['home', 'away'] as $side) {
            foreach (is_array($statistics[$side] ?? null) ? $statistics[$side] : [] as $value) {
                if ($value !== null) {
                    return true;
                }
            }
        }

        return false;
    }
}
