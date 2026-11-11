<?php

namespace App\Providers\Real;

use App\Providers\Contracts\OddsProvider;
use App\Providers\Data\OddsFeed;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

final class ApiFootballOddsProvider implements OddsProvider
{
    public function __construct(private readonly ApiFootballMapper $mapper) {}

    public function getLiveOdds(int $scanNumber = 0): OddsFeed
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

        return $this->mapper->mapOdds($response->body(), 1, $remaining, $this->limit($response));
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
