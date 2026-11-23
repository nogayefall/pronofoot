<?php

namespace App\Providers\Real;

use App\Providers\Contracts\OddsProvider;
use App\Providers\Data\OddsFeed;
use App\Providers\Data\OddsMatch;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

final class ApiFootballOddsProvider implements OddsProvider
{
    public function __construct(private readonly ApiFootballMapper $mapper) {}

    public function getLiveOdds(int $scanNumber = 0, bool $includeUnder25 = false, bool $includeGoalLines = false): OddsFeed
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
        if ((! $includeUnder25 && ! $includeGoalLines) || $feed->reachable !== true) {
            return $feed;
        }

        return $this->withTotalOdds($feed, $baseUrl, $apiKey, $includeGoalLines);
    }

    /**
     * Appel odds/live?bet=36 (« Over/Under Line ») pour la cote Under 2.5 du total du match (F121-E2) et, pour le mode
     * Plancher, appel odds/live?bet=25 (« Match Goals ») : constaté en direct le 23 novembre 2026, bet 36 ne donne souvent
     * que la ligne principale (parfois un quart de ligne) et bet 25 les lignes .5 ; les deux sont réunis, bet 25 d’abord.
     * Un échec n’invalide pas les cotes de score exact : les cotes manquantes restent simplement indisponibles.
     */
    private function withTotalOdds(OddsFeed $feed, string $baseUrl, string $apiKey, bool $goalLines): OddsFeed
    {
        $requestsRemaining = $feed->requestsRemaining;
        $requestsLimit = $feed->requestsLimit;
        $requestsUsed = $feed->requestsUsed ?? 1;
        $under25Odds = [];
        $overLineOdds = [];
        $underLineOdds = [];
        $messages = [];
        $lineAvailable = false;

        foreach ($goalLines ? [25, 36] : [36] as $bet) {
            try {
                $response = Http::acceptJson()
                    ->timeout((int) config('services.football_api.timeout', 10))
                    ->withHeaders(['x-apisports-key' => $apiKey])
                    ->get($baseUrl.'/odds/live', ['bet' => $bet]);
                $requestsUsed++;
                $requestsRemaining = $this->remaining($response) ?? $requestsRemaining;
                $requestsLimit = $this->limit($response) ?? $requestsLimit;
            } catch (ConnectionException) {
                $requestsUsed++;
                $messages[] = $bet === 36
                    ? 'Cote Under 2.5 indisponible : échec de connexion au point odds/live?bet=36.'
                    : 'Lignes Over/Under (Plancher) incomplètes : échec de connexion au point odds/live?bet=25.';

                continue;
            }

            if ($bet === 36) {
                $mapped = $response->successful() ? $this->mapper->mapUnder25Odds($response->body()) : null;
                if ($mapped === null) {
                    $messages[] = $response->successful()
                        ? 'Cote Under 2.5 indisponible : réponse odds/live?bet=36 inexploitable.'
                        : "Cote Under 2.5 indisponible : API-Football a répondu HTTP {$response->status()} pour odds/live?bet=36.";

                    continue;
                }
                $under25Odds = $mapped;
            } elseif (! $response->successful()) {
                $messages[] = "Lignes Over/Under (Plancher) incomplètes : API-Football a répondu HTTP {$response->status()} pour odds/live?bet=25.";

                continue;
            }

            $over = $bet === 36 && ! $goalLines
                ? $this->mapper->mapOverLineOdds($response->body())
                : $this->mapper->mapGoalLineOdds($response->body(), $bet, 'Over');
            $under = $goalLines ? $this->mapper->mapGoalLineOdds($response->body(), $bet, 'Under') : [];
            if ($over === null) {
                continue;
            }
            $lineAvailable = true;
            // Lignes déjà lues dans bet 25 conservées : bet 36 ne fait que compléter.
            foreach ($over as $fixtureId => $lines) {
                $overLineOdds[$fixtureId] = ($overLineOdds[$fixtureId] ?? []) + $lines;
            }
            foreach ($under ?? [] as $fixtureId => $lines) {
                $underLineOdds[$fixtureId] = ($underLineOdds[$fixtureId] ?? []) + $lines;
            }
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
            underLineOdds: $underLineOdds[$match->providerMatchId] ?? [],
        ), $feed->matches);

        return new OddsFeed(
            driver: $feed->driver,
            reachable: $feed->reachable,
            exactScoreMarketAvailable: $feed->exactScoreMarketAvailable,
            overUnderMarketAvailable: $goalLines ? $lineAvailable : $messages === [],
            statusMessage: $messages === [] ? $feed->statusMessage : $feed->statusMessage.' '.implode(' ', $messages),
            matches: $matches,
            requestsUsed: $requestsUsed,
            requestsRemaining: $requestsRemaining,
            rawResponse: $feed->rawResponse,
            matchesWithExactScoreMarket: $feed->matchesWithExactScoreMarket,
            requestsLimit: $requestsLimit,
        );
    }

    public function getOverLineOdds(): array
    {
        $baseUrl = rtrim(trim((string) config('services.football_api.base_url')), '/');
        $apiKey = trim((string) config('services.football_api.api_key'));
        if ($baseUrl === '' || $apiKey === '' || parse_url($baseUrl, PHP_URL_SCHEME) !== 'https') {
            return [];
        }

        // Une seule requête odds/live?bet=36 par minute au plus, quel que soit le nombre d’alertes créées.
        return Cache::remember('pronofoot.odds.over_lines', 60, function () use ($baseUrl, $apiKey): array {
            try {
                $response = Http::acceptJson()
                    ->timeout((int) config('services.football_api.timeout', 10))
                    ->withHeaders(['x-apisports-key' => $apiKey])
                    ->get($baseUrl.'/odds/live', ['bet' => 36]);
            } catch (ConnectionException) {
                return [];
            }

            return $response->successful() ? ($this->mapper->mapOverLineOdds($response->body()) ?? []) : [];
        });
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
