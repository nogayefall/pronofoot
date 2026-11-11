<?php

namespace App\Providers\Real;

use App\Providers\Contracts\FootballProvider;
use App\Providers\Data\FootballFeed;
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
        if ($includeCoverage) {
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

        $statisticsMatches = array_slice($liveFeed->matches, 0, $statisticsMatchLimit);
        $statisticsMatchId = null;
        $rawStatisticsResponse = null;
        $statisticsFailure = null;

        foreach ($statisticsMatches as $match) {
            $statisticsMatchId ??= $match->providerMatchId;
            try {
                $statisticsResponse = $this->request(
                    $baseUrl.'/fixtures/statistics',
                    ['fixture' => $match->providerMatchId],
                    $apiKey,
                );
            } catch (ConnectionException) {
                $requestsUsed++;
                $statisticsFailure = 'Échec de connexion au point API-Football fixtures/statistics.';

                break;
            }

            $requestsUsed++;
            $requestsRemaining = $this->remaining($statisticsResponse) ?? $requestsRemaining;
            $requestsLimit = $this->limit($statisticsResponse) ?? $requestsLimit;
            $rawStatisticsResponse ??= $statisticsResponse->body();
            if (! $statisticsResponse->successful()) {
                $statisticsFailure = "API-Football a répondu HTTP {$statisticsResponse->status()} pour fixtures/statistics.";

                break;
            }
        }

        $feed = $this->mapper->mapFootball(
            rawResponse: $liveResponse->body(),
            rawStatisticsResponse: $rawStatisticsResponse,
            statisticsMatchId: $statisticsMatchId,
            requestsUsed: $requestsUsed,
            requestsRemaining: $requestsRemaining,
            requestsLimit: $requestsLimit,
            rawCoverageResponse: $rawCoverageResponse,
        );

        if ($statisticsFailure === null && $coverageFailure === null) {
            return $feed;
        }

        return new FootballFeed(
            driver: $feed->driver,
            reachable: $feed->reachable,
            statisticsAvailable: $statisticsFailure === null ? $feed->statisticsAvailable : false,
            statusMessage: $statisticsFailure ?? $coverageFailure,
            matches: $feed->matches,
            requestsUsed: $feed->requestsUsed,
            requestsRemaining: $feed->requestsRemaining,
            rawResponse: $feed->rawResponse,
            statisticsMatchId: $feed->statisticsMatchId,
            rawStatisticsResponse: $rawStatisticsResponse,
            requestsLimit: $feed->requestsLimit,
        );
    }

    /**
     * @return array{string, string}|null
     */
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
