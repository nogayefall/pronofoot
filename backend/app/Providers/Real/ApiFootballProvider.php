<?php

namespace App\Providers\Real;

use App\Providers\Contracts\FootballProvider;
use App\Providers\Data\FootballFeed;
use App\Services\MatchStatus;
use App\Services\QuotaGuard;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use InvalidArgumentException;

final class ApiFootballProvider implements FootballProvider
{
    public function __construct(private readonly ApiFootballMapper $mapper) {}

    public function getLiveMatches(
        int $scanNumber = 0,
        bool $includeStatistics = true,
        ?int $statisticsMatchLimit = 1,
        bool $includeCoverage = false,
        ?array $statisticsMatchIds = null,
        ?int $quotaAlertThreshold = null,
        ?array $coverageLeagueIds = null,
    ): FootballFeed {
        if ($statisticsMatchLimit !== null && $statisticsMatchLimit < 1) {
            throw new InvalidArgumentException('La limite de matchs statistiques doit être positive.');
        }

        $credentials = $this->credentials();
        if ($credentials === null) {
            return new FootballFeed(
                driver: 'real',
                reachable: null,
                statisticsAvailable: null,
                statusMessage: 'NON VÉRIFIÉ : configurez API_FOOTBALL_API_KEY avant tout appel.',
            );
        }

        [$baseUrl, $apiKey] = $credentials;
        if (parse_url($baseUrl, PHP_URL_SCHEME) !== 'https') {
            return new FootballFeed(
                driver: 'real',
                reachable: false,
                statisticsAvailable: null,
                statusMessage: 'API_FOOTBALL_BASE_URL doit utiliser HTTPS.',
            );
        }

        try {
            $liveResponse = $this->request($baseUrl.'/fixtures', ['live' => 'all'], $apiKey);
        } catch (ConnectionException) {
            return new FootballFeed(
                driver: 'real',
                reachable: false,
                statisticsAvailable: null,
                statusMessage: 'Échec de connexion au point API-Football fixtures?live=all.',
                requestsUsed: 1,
            );
        }

        $requestsUsed = 1;
        $requestsRemaining = $this->remaining($liveResponse);
        $requestsLimit = $this->limit($liveResponse);
        if (! $liveResponse->successful()) {
            return new FootballFeed(
                driver: 'real',
                reachable: false,
                statisticsAvailable: null,
                statusMessage: "API-Football a répondu HTTP {$liveResponse->status()} pour fixtures?live=all.",
                requestsUsed: $requestsUsed,
                requestsRemaining: $requestsRemaining,
                rawResponse: $liveResponse->body(),
                requestsLimit: $requestsLimit,
            );
        }

        $liveFeed = $this->mapper->mapFootball(
            rawResponse: $liveResponse->body(),
            requestsUsed: $requestsUsed,
            requestsRemaining: $requestsRemaining,
            requestsLimit: $requestsLimit,
        );
        if ($liveFeed->matches === []) {
            return $liveFeed;
        }

        $rawCoverageResponse = null;
        $coverageFailure = null;
        $coverageNeeded = $coverageLeagueIds === null
            || collect($liveFeed->matches)->contains(fn ($match): bool => in_array($match->leagueId, $coverageLeagueIds, true));
        if ($includeCoverage && $coverageNeeded) {
            $coverageCacheKey = 'api-football.leagues.current.'.hash('sha256', $baseUrl);
            $cachedCoverage = Cache::get($coverageCacheKey);
            if (is_string($cachedCoverage)) {
                $rawCoverageResponse = $cachedCoverage;
            } else {
                try {
                    $coverageResponse = $this->request($baseUrl.'/leagues', ['current' => 'true'], $apiKey);
                } catch (ConnectionException) {
                    $requestsUsed++;
                    $coverageFailure = 'Échec de connexion au point API-Football leagues?current=true.';
                }

                if (isset($coverageResponse)) {
                    $requestsUsed++;
                    $requestsRemaining = $this->remaining($coverageResponse) ?? $requestsRemaining;
                    $requestsLimit = $this->limit($coverageResponse) ?? $requestsLimit;
                    if ($coverageResponse->successful()) {
                        $rawCoverageResponse = $coverageResponse->body();
                        Cache::put($coverageCacheKey, $rawCoverageResponse, now()->addHour());
                    } else {
                        $coverageFailure = "API-Football a répondu HTTP {$coverageResponse->status()} pour leagues?current=true.";
                    }
                }
            }
        }

        if (! $includeStatistics) {
            $feed = $this->mapper->mapFootball(
                rawResponse: $liveResponse->body(),
                requestsUsed: $requestsUsed,
                requestsRemaining: $requestsRemaining,
                requestsLimit: $requestsLimit,
                rawCoverageResponse: $rawCoverageResponse,
            );

            return $coverageFailure === null ? $feed : new FootballFeed(
                driver: $feed->driver,
                reachable: $feed->reachable,
                statisticsAvailable: $feed->statisticsAvailable,
                statusMessage: $coverageFailure,
                matches: $feed->matches,
                requestsUsed: $feed->requestsUsed,
                requestsRemaining: $feed->requestsRemaining,
                rawResponse: $feed->rawResponse,
                requestsLimit: $feed->requestsLimit,
            );
        }

        // Aucun appel de statistiques pour un match terminé (FT, AET, PEN…) ni pendant les tirs au but (non analysés).
        $analysableMatches = array_values(array_filter(
            $liveFeed->matches,
            fn ($match): bool => ! MatchStatus::isFinished(MatchStatus::code($match)) && ! MatchStatus::isPenaltyShootout(MatchStatus::code($match)),
        ));
        $statisticsMatches = $statisticsMatchIds === null
            ? array_slice($analysableMatches, 0, $statisticsMatchLimit)
            : array_values(array_filter(
                $analysableMatches,
                fn ($match): bool => in_array($match->providerMatchId, $statisticsMatchIds, true),
            ));
        $statisticsMatchId = null;
        $rawStatisticsResponse = null;
        $rawStatisticsResponses = [];
        $statisticsFailures = [];
        $quotaThresholdReached = false;

        foreach ($statisticsMatches as $match) {
            if (QuotaGuard::reached($requestsRemaining, $quotaAlertThreshold)) {
                $quotaThresholdReached = true;

                break;
            }

            try {
                $statisticsResponse = $this->request(
                    $baseUrl.'/fixtures/statistics',
                    ['fixture' => $match->providerMatchId],
                    $apiKey,
                );
            } catch (ConnectionException) {
                $requestsUsed++;
                $statisticsFailures[$match->providerMatchId] = 'Échec de connexion au point API-Football fixtures/statistics.';

                continue;
            }

            $requestsUsed++;
            $requestsRemaining = $this->remaining($statisticsResponse) ?? $requestsRemaining;
            $requestsLimit = $this->limit($statisticsResponse) ?? $requestsLimit;
            if (! $statisticsResponse->successful()) {
                $statisticsFailures[$match->providerMatchId] = "API-Football a répondu HTTP {$statisticsResponse->status()} pour fixtures/statistics.";

                continue;
            }

            $errors = $statisticsResponse->json('errors');
            if (! empty($errors)) {
                $statisticsFailures[$match->providerMatchId] = 'API-Football a renvoyé une erreur pour fixtures/statistics.';

                continue;
            }

            $statisticsMatchId ??= $match->providerMatchId;
            $rawStatisticsResponse ??= $statisticsResponse->body();
            $rawStatisticsResponses[$match->providerMatchId] = $statisticsResponse->body();
        }

        if ($statisticsMatchId === null && $statisticsFailures !== []) {
            $statisticsMatchId = (string) array_key_first($statisticsFailures);
        }

        $feed = $this->mapper->mapFootball(
            rawResponse: $liveResponse->body(),
            rawStatisticsResponse: $rawStatisticsResponse,
            statisticsMatchId: $statisticsMatchId,
            requestsUsed: $requestsUsed,
            requestsRemaining: $requestsRemaining,
            requestsLimit: $requestsLimit,
            rawCoverageResponse: $rawCoverageResponse,
            rawStatisticsResponses: $rawStatisticsResponses,
        );

        $messages = array_filter([
            $statisticsFailures === [] ? null : sprintf(
                'Statistiques indisponibles pour %d match(s) : %s',
                count($statisticsFailures),
                reset($statisticsFailures),
            ),
            $quotaThresholdReached ? QuotaGuard::message($requestsRemaining, $quotaAlertThreshold) : null,
            $coverageFailure,
        ]);

        return new FootballFeed(
            driver: $feed->driver,
            reachable: $feed->reachable,
            statisticsAvailable: $feed->statisticsAvailable ?? ($statisticsFailures !== [] ? false : null),
            statusMessage: $messages === [] ? $feed->statusMessage : implode(' ', $messages),
            matches: $feed->matches,
            requestsUsed: $feed->requestsUsed,
            requestsRemaining: $feed->requestsRemaining,
            rawResponse: $feed->rawResponse,
            statisticsMatchId: $statisticsMatchId,
            rawStatisticsResponse: $rawStatisticsResponse,
            requestsLimit: $feed->requestsLimit,
            statisticsFailures: $statisticsFailures,
            quotaThresholdReached: $quotaThresholdReached,
        );
    }

    /**
     * @return array{string, string}|null
     */
    public function getFixturesByDate(string $date): FootballFeed
    {
        $credentials = $this->credentials();
        if ($credentials === null) {
            return new FootballFeed(driver: 'real', reachable: null, statisticsAvailable: null, statusMessage: 'NON VÉRIFIÉ : configurez API_FOOTBALL_API_KEY avant tout appel.');
        }

        [$baseUrl, $apiKey] = $credentials;
        if (parse_url($baseUrl, PHP_URL_SCHEME) !== 'https') {
            return new FootballFeed(driver: 'real', reachable: false, statisticsAvailable: null, statusMessage: 'API_FOOTBALL_BASE_URL doit utiliser HTTPS.');
        }

        try {
            $response = $this->request($baseUrl.'/fixtures', ['date' => $date], $apiKey);
        } catch (ConnectionException) {
            return new FootballFeed(driver: 'real', reachable: false, statisticsAvailable: null, statusMessage: 'Échec de connexion au point API-Football fixtures?date=.', requestsUsed: 1);
        }

        if (! $response->successful()) {
            return new FootballFeed(
                driver: 'real',
                reachable: false,
                statisticsAvailable: null,
                statusMessage: "API-Football a répondu HTTP {$response->status()} pour fixtures?date=.",
                requestsUsed: 1,
                requestsRemaining: $this->remaining($response),
                requestsLimit: $this->limit($response),
            );
        }

        return $this->mapper->mapFootball(
            rawResponse: $response->body(),
            requestsUsed: 1,
            requestsRemaining: $this->remaining($response),
            requestsLimit: $this->limit($response),
        );
    }

    public function getGoalEvents(string $providerMatchId): ?array
    {
        $credentials = $this->credentials();
        if ($credentials === null || parse_url($credentials[0], PHP_URL_SCHEME) !== 'https') {
            return null;
        }

        [$baseUrl, $apiKey] = $credentials;
        try {
            $response = $this->request($baseUrl.'/fixtures/events', ['fixture' => $providerMatchId], $apiKey);
        } catch (ConnectionException) {
            return null;
        }

        $events = $response->successful() ? $response->json('response') : null;
        if (! is_array($events)) {
            return null;
        }

        $goals = [];
        foreach ($events as $event) {
            $detail = is_array($event) ? (string) ($event['detail'] ?? '') : '';
            // Penalty manqué, et séance de tirs au but (« Penalty Shootout ») : jamais un but du match.
            if (($event['type'] ?? null) !== 'Goal' || $detail === 'Missed Penalty' || ($event['comments'] ?? null) === 'Penalty Shootout') {
                continue;
            }

            $goals[] = [
                'minute' => is_numeric($event['time']['elapsed'] ?? null) ? (int) $event['time']['elapsed'] : null,
                'extra' => is_numeric($event['time']['extra'] ?? null) ? (int) $event['time']['extra'] : null,
                'team' => (string) ($event['team']['name'] ?? ''),
                'detail' => $detail,
            ];
        }

        // Ordre chronologique (minute, puis temps additionnel) : l’API ne renvoie pas toujours les événements dans l’ordre.
        usort($goals, fn (array $first, array $second): int => [$first['minute'] ?? 0, $first['extra'] ?? 0] <=> [$second['minute'] ?? 0, $second['extra'] ?? 0]);

        return $goals;
    }

    private function credentials(): ?array
    {
        $baseUrl = rtrim(trim((string) config('services.football_api.base_url')), '/');
        $apiKey = trim((string) config('services.football_api.api_key'));

        if ($baseUrl === '' || $apiKey === '') {
            return null;
        }

        return [$baseUrl, $apiKey];
    }

    /**
     * @param  array<string, string>  $query
     */
    private function request(string $url, array $query, string $apiKey): Response
    {
        return Http::acceptJson()
            ->timeout((int) config('services.football_api.timeout', 10))
            ->withHeaders(['x-apisports-key' => $apiKey])
            ->get($url, $query);
    }

    private function remaining(Response $response): ?int
    {
        $remaining = $response->header('x-ratelimit-requests-remaining');

        return is_string($remaining) && ctype_digit($remaining) ? (int) $remaining : null;
    }

    private function limit(Response $response): ?int
    {
        $limit = $response->header('x-ratelimit-requests-limit');

        return is_string($limit) && ctype_digit($limit) ? (int) $limit : null;
    }
}
