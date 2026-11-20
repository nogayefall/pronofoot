<?php

namespace App\Providers\Real;

use App\Providers\Contracts\OddsProvider;
use App\Providers\Data\OddsFeed;
use App\Providers\Data\OddsMatch;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

final class ApiFootballOddsProvider implements OddsProvider
{
    public function __construct(private readonly ApiFootballMapper $mapper) {}

    public function getLiveOdds(int $scanNumber = 0, bool $includeUnder25 = false): OddsFeed
    {
        $baseUrl = rtrim(trim((string) config('services.football_api.base_url')), '/');
        $apiKey = trim((string) config('services.football_api.api_key'));
        if ($baseUrl === '' || $apiKey === '') {
            return new OddsFeed(
                driver: 'api_football',
                reachable: null,
                exactScoreMarketAvailable: false,
                overUnderMarketAvailable: null,
                statusMessage: 'NON VÉRIFIÉ : configurez API_FOOTBALL_API_KEY avant tout appel.',
            );
        }

        if (parse_url($baseUrl, PHP_URL_SCHEME) !== 'https') {
            return new OddsFeed(
                driver: 'api_football',
                reachable: false,
                exactScoreMarketAvailable: false,
                overUnderMarketAvailable: null,
                statusMessage: 'API_FOOTBALL_BASE_URL doit utiliser HTTPS.',
            );
        }

        try {
            $response = Http::acceptJson()
                ->timeout((int) config('services.football_api.timeout', 10))
                ->withHeaders(['x-apisports-key' => $apiKey])
                ->get($baseUrl.'/odds/live', ['bet' => 23]);
        } catch (ConnectionException) {
            return new OddsFeed(
                driver: 'api_football',
                reachable: false,
                exactScoreMarketAvailable: false,
                overUnderMarketAvailable: null,
                statusMessage: 'Échec de connexion au point API-Football odds/live?bet=23.',
                requestsUsed: 1,
            );
        }

        $remaining = $this->remaining($response);
        if (! $response->successful()) {
            return new OddsFeed(
                driver: 'api_football',
                reachable: false,
                exactScoreMarketAvailable: false,
                overUnderMarketAvailable: null,
                statusMessage: "API-Football a répondu HTTP {$response->status()} pour odds/live?bet=23.",
                requestsUsed: 1,
                requestsRemaining: $remaining,
                rawResponse: $response->body(),
            );
        }

        $feed = $this->mapper->mapOdds($response->body(), 1, $remaining, $this->limit($response));
        if (! $includeUnder25 || $feed->reachable !== true) {
            return $feed;
        }

        return $this->withUnder25Odds($feed, $baseUrl, $apiKey);
    }

    /**
     * Second appel odds/live?bet=36 (« Over/Under Line ») pour la cote Under 2.5 du total du match.
     * Un échec n’invalide pas les cotes de score exact : la cote Under 2.5 reste simplement indisponible.
     */
    private function withUnder25Odds(OddsFeed $feed, string $baseUrl, string $apiKey): OddsFeed
    {
        $requestsRemaining = $feed->requestsRemaining;
        $requestsLimit = $feed->requestsLimit;
        $under25Odds = [];
        $overLineOdds = [];
        $message = null;

        try {
            $response = Http::acceptJson()
                ->timeout((int) config('services.football_api.timeout', 10))
                ->withHeaders(['x-apisports-key' => $apiKey])
                ->get($baseUrl.'/odds/live', ['bet' => 36]);
            $requestsRemaining = $this->remaining($response) ?? $requestsRemaining;
            $requestsLimit = $this->limit($response) ?? $requestsLimit;
            $mapped = $response->successful() ? $this->mapper->mapUnder25Odds($response->body()) : null;
            if ($mapped === null) {
                $message = $response->successful()
                    ? 'Cote Under 2.5 indisponible : réponse odds/live?bet=36 inexploitable.'
                    : "Cote Under 2.5 indisponible : API-Football a répondu HTTP {$response->status()} pour odds/live?bet=36.";
            } else {
                $under25Odds = $mapped;
                $overLineOdds = $this->mapper->mapOverLineOdds($response->body()) ?? [];
            }
        } catch (ConnectionException) {
            $message = 'Cote Under 2.5 indisponible : échec de connexion au point odds/live?bet=36.';
        }

        $matches = array_map(fn (OddsMatch $match): OddsMatch => new OddsMatch(
            providerMatchId: $match->providerMatchId,
            exactScoreOdds: $match->exactScoreOdds,
            overUnderOdds: $match->overUnderOdds,
            minute: $match->minute,
            homeScore: $match->homeScore,
            awayScore: $match->awayScore,
            stopped: $match->stopped,
            under25Odds: $under25Odds[$match->providerMatchId] ?? null,
            overLineOdds: $overLineOdds[$match->providerMatchId] ?? [],
        ), $feed->matches);

        return new OddsFeed(
            driver: $feed->driver,
            reachable: $feed->reachable,
            exactScoreMarketAvailable: $feed->exactScoreMarketAvailable,
            overUnderMarketAvailable: $message === null,
            statusMessage: $message === null ? $feed->statusMessage : $feed->statusMessage.' '.$message,
            matches: $matches,
            requestsUsed: ($feed->requestsUsed ?? 1) + 1,
            requestsRemaining: $requestsRemaining,
            rawResponse: $feed->rawResponse,
            matchesWithExactScoreMarket: $feed->matchesWithExactScoreMarket,
            requestsLimit: $requestsLimit,
        );
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
