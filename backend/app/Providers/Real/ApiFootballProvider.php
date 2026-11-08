<?php

namespace App\Providers\Real;

use App\Providers\Contracts\FootballProvider;
use App\Providers\Data\FootballFeed;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

final class ApiFootballProvider implements FootballProvider
{
    public function __construct(private readonly ApiFootballMapper $mapper) {}

    public function getLiveMatches(int $scanNumber = 0, bool $includeStatistics = true): FootballFeed
    {
        $url = trim((string) config('services.football_api.probe_url', ''));
        $key = trim((string) config('services.football_api.api_key', ''));
        $header = trim((string) config('services.football_api.api_key_header', ''));

        if ($url === '' || $key === '' || $header === '') {
            return new FootballFeed(
                driver: 'real',
                reachable: null,
                statisticsAvailable: null,
                statusMessage: 'NON VÉRIFIÉ : configurez l’URL, la clé et le nom de son en-tête documenté avant tout appel.',
            );
        }

        if (parse_url($url, PHP_URL_SCHEME) !== 'https') {
            return new FootballFeed(
                driver: 'real',
                reachable: false,
                statisticsAvailable: null,
                statusMessage: 'L’URL de vérification doit utiliser HTTPS.',
            );
        }

        try {
            $response = Http::acceptJson()
                ->timeout((int) config('services.football_api.timeout', 10))
                ->retry(2, 250)
                ->withHeaders([$header => $key])
                ->get($url);
        } catch (ConnectionException) {
            return new FootballFeed(
                driver: 'real',
                reachable: false,
                statisticsAvailable: null,
                statusMessage: 'Échec de connexion au point de vérification API-Football après les nouvelles tentatives.',
            );
        }

        if (! $response->successful()) {
            return new FootballFeed(
                driver: 'real',
                reachable: false,
                statisticsAvailable: null,
                statusMessage: "API-Football a répondu avec le statut HTTP {$response->status()}.",
                rawResponse: $response->body(),
            );
        }

        return $this->mapper->map($response->body());
    }
}
