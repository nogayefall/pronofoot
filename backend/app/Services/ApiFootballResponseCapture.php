<?php

namespace App\Services;

use Closure;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use JsonException;
use RuntimeException;

final class ApiFootballResponseCapture
{
    public function __construct(private readonly ?string $directory = null) {}

    /**
     * @return array{
     *     live_matches: int,
     *     fixture_id: string|null,
     *     requests_remaining: int|null,
     *     requests_limit: int|null,
     *     paths: list<string>,
     *     candidate_fixture_ids: list<string>,
     *     fallback_fixture_ids: list<string>,
     *     cancelled: bool
     * }
     */
    public function capture(
        string $apiKey,
        ?string $fixtureId = null,
        bool $autoCovered = false,
        ?Closure $beforeRequest = null,
        ?Closure $reviewCandidates = null,
    ): array {
        if ($fixtureId !== null && $autoCovered) {
            throw new RuntimeException('Choisissez soit --fixture, soit --auto-covered, pas les deux.');
        }

        $baseUrl = rtrim((string) config('services.football_api.base_url'), '/');
        if ($baseUrl === '' || parse_url($baseUrl, PHP_URL_SCHEME) !== 'https') {
            throw new RuntimeException('API_FOOTBALL_BASE_URL doit être une URL HTTPS.');
        }

        $directory = $this->directory ?? storage_path('feasibility/api-football');
        if (! is_dir($directory) && ! mkdir($directory, 0700, true) && ! is_dir($directory)) {
            throw new RuntimeException('Impossible de créer le dossier de capture API-Football.');
        }

        $capturedAt = now()->format('Ymd-His-u');
        $paths = [];
        $quotaRemaining = null;
        $quotaLimit = null;

        $beforeRequest?->__invoke('fixtures?live=all', $quotaRemaining);
        $this->assertQuotaAvailable($quotaRemaining, 'fixtures?live=all');
        $liveResponse = $this->request($baseUrl.'/fixtures', ['live' => 'all'], $apiKey);
        $paths[] = $this->save($directory, "fixtures-live-{$capturedAt}.json", $liveResponse->body());
        [$quotaRemaining, $quotaLimit] = $this->readQuota($liveResponse, $quotaRemaining, $quotaLimit);
        $this->assertSuccessful($liveResponse, 'fixtures?live=all');

        try {
            $livePayload = json_decode($liveResponse->body(), true, flags: JSON_THROW_ON_ERROR);
        } catch (JsonException $exception) {
            throw new RuntimeException('La réponse fixtures?live=all n’est pas un JSON valide.', previous: $exception);
        }

        $liveMatches = $livePayload['response'] ?? null;
        if (! is_array($liveMatches)) {
            throw new RuntimeException('La réponse fixtures?live=all ne contient pas la liste response.');
        }

        $liveMatchCount = count($liveMatches);
        $candidateFixtureIds = [];
        $fallbackFixtureIds = [];
        $cancelled = false;
        if ($autoCovered) {
            $beforeRequest?->__invoke('leagues?current=true', $quotaRemaining);
            $this->assertQuotaAvailable($quotaRemaining, 'leagues?current=true');
            $leaguesResponse = $this->request($baseUrl.'/leagues', ['current' => 'true'], $apiKey);
            $paths[] = $this->save($directory, "leagues-current-{$capturedAt}.json", $leaguesResponse->body());
            [$quotaRemaining, $quotaLimit] = $this->readQuota($leaguesResponse, $quotaRemaining, $quotaLimit);
            $this->assertSuccessful($leaguesResponse, 'leagues?current=true');
            $candidates = $this->coveredFixtureIds($liveMatches, $leaguesResponse->body());
            $candidateFixtureIds = $candidates['ids'];
            $fallbackFixtureIds = $candidates['fallback_ids'];
            $fixtureId = $candidateFixtureIds[0] ?? null;
            if ($fixtureId !== null && $reviewCandidates !== null) {
                $cancelled = ! $reviewCandidates($candidateFixtureIds, $fallbackFixtureIds, $fixtureId);
            }
        } elseif ($fixtureId !== null) {
            $fixtureId = $this->findFixtureId($liveMatches, $fixtureId);
            if ($fixtureId === null) {
                throw new RuntimeException('Le match indiqué par --fixture ne figure pas dans la liste live actuelle.');
            }
        } else {
            $fixtureId = $this->firstFixtureId($liveMatches);
        }

        if ($fixtureId !== null && ! $cancelled) {
            $beforeRequest?->__invoke("fixtures/statistics?fixture={$fixtureId}", $quotaRemaining);
            $this->assertQuotaAvailable($quotaRemaining, "fixtures/statistics?fixture={$fixtureId}");
            $statisticsResponse = $this->request(
                $baseUrl.'/fixtures/statistics',
                ['fixture' => $fixtureId],
                $apiKey,
            );
            $paths[] = $this->save(
                $directory,
                "fixtures-statistics-{$fixtureId}-{$capturedAt}.json",
                $statisticsResponse->body(),
            );
            [$quotaRemaining, $quotaLimit] = $this->readQuota($statisticsResponse, $quotaRemaining, $quotaLimit);
            $this->assertSuccessful($statisticsResponse, 'fixtures/statistics');
        }

        if ($cancelled) {
            return [
                'live_matches' => $liveMatchCount,
                'fixture_id' => $fixtureId,
                'requests_remaining' => $quotaRemaining,
                'requests_limit' => $quotaLimit,
                'paths' => $paths,
                'candidate_fixture_ids' => $candidateFixtureIds,
                'fallback_fixture_ids' => $fallbackFixtureIds,
                'cancelled' => true,
            ];
        }

        $beforeRequest?->__invoke('odds/live?bet=23', $quotaRemaining);
        $this->assertQuotaAvailable($quotaRemaining, 'odds/live?bet=23');
        $oddsResponse = $this->request($baseUrl.'/odds/live', ['bet' => 23], $apiKey);
        $paths[] = $this->save($directory, "odds-live-bet23-{$capturedAt}.json", $oddsResponse->body());
        [$quotaRemaining, $quotaLimit] = $this->readQuota($oddsResponse, $quotaRemaining, $quotaLimit);
        $this->assertSuccessful($oddsResponse, 'odds/live?bet=23');

        return [
            'live_matches' => $liveMatchCount,
            'fixture_id' => $fixtureId,
            'requests_remaining' => $quotaRemaining,
            'requests_limit' => $quotaLimit,
            'paths' => $paths,
            'candidate_fixture_ids' => $candidateFixtureIds,
            'fallback_fixture_ids' => $fallbackFixtureIds,
            'cancelled' => false,
        ];
    }

    /**
     * @param  array<string, string|int>  $query
     */
    private function request(string $url, array $query, string $apiKey): Response
    {
        try {
            return Http::acceptJson()
                ->timeout((int) config('services.football_api.timeout', 10))
                ->withHeaders(['x-apisports-key' => $apiKey])
                ->get($url, $query);
        } catch (ConnectionException $exception) {
            throw new RuntimeException('Échec de connexion à API-Football pendant la capture.', previous: $exception);
        }
    }

    /**
     * @param  array<mixed>  $matches
     */
    private function firstFixtureId(array $matches): ?string
    {
        foreach ($matches as $match) {
            $id = is_array($match) ? ($match['fixture']['id'] ?? null) : null;
            if ((is_string($id) && ctype_digit($id)) || (is_int($id) && $id > 0)) {
                return (string) $id;
            }
        }

        return null;
    }

    /**
     * @param  array<mixed>  $matches
     */
    private function findFixtureId(array $matches, string $requestedId): ?string
    {
        foreach ($matches as $match) {
            $id = is_array($match) ? ($match['fixture']['id'] ?? null) : null;
            if (((is_string($id) && ctype_digit($id)) || (is_int($id) && $id > 0))
                && (string) $id === $requestedId) {
                return (string) $id;
            }
        }

        return null;
    }

    /**
     * @param  array<mixed>  $liveMatches
     * @return array{ids: list<string>, fallback_ids: list<string>}
     */
    private function coveredFixtureIds(array $liveMatches, string $leaguesResponse): array
    {
        try {
            $payload = json_decode($leaguesResponse, true, flags: JSON_THROW_ON_ERROR);
        } catch (JsonException $exception) {
            throw new RuntimeException('La réponse leagues?current=true n’est pas un JSON valide.', previous: $exception);
        }

        if (! is_array($payload) || ! is_array($payload['response'] ?? null)) {
            throw new RuntimeException('La réponse leagues?current=true ne contient pas la liste response.');
        }

        $coverageByLeague = [];
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

            $coverageByLeague[(string) $leagueId] ??= [
                'seasons' => [],
                'current' => null,
            ];
            foreach ($entry['seasons'] as $season) {
                if (! is_array($season)) {
                    continue;
                }

                $year = $season['year'] ?? null;
                if (! is_int($year) && ! (is_string($year) && ctype_digit($year))) {
                    continue;
                }

                $value = $season['coverage']['fixtures']['statistics_fixtures'] ?? null;
                $coverageByLeague[(string) $leagueId]['seasons'][(string) $year] = is_bool($value) ? $value : null;
                if (($season['current'] ?? null) === true) {
                    $coverageByLeague[(string) $leagueId]['current'] = (int) $year;
                }
            }
        }

        $fixtureIds = [];
        $fallbackFixtureIds = [];
        foreach ($liveMatches as $match) {
            if (! is_array($match)) {
                continue;
            }
            $id = $match['fixture']['id'] ?? null;
            $leagueId = $match['league']['id'] ?? null;
            if ((! is_int($id) && ! (is_string($id) && ctype_digit($id)))
                || (! is_int($leagueId) && ! (is_string($leagueId) && ctype_digit($leagueId)))) {
                continue;
            }

            $leagueCoverage = $coverageByLeague[(string) $leagueId] ?? null;
            $matchSeason = $match['league']['season'] ?? null;
            if ($leagueCoverage === null) {
                continue;
            }

            $fallback = false;
            $hasMatchSeason = is_int($matchSeason) || (is_string($matchSeason) && ctype_digit($matchSeason));
            if ($hasMatchSeason && array_key_exists((string) $matchSeason, $leagueCoverage['seasons'])) {
                $value = $leagueCoverage['seasons'][(string) $matchSeason];
            } elseif ($leagueCoverage['current'] !== null) {
                $fallback = true;
                $value = $leagueCoverage['seasons'][(string) $leagueCoverage['current']] ?? null;
            } else {
                $value = null;
            }
            if ($value === true) {
                $fixtureIds[] = (string) $id;
                if ($fallback) {
                    $fallbackFixtureIds[] = (string) $id;
                }
            }
        }

        return [
            'ids' => array_values(array_unique($fixtureIds)),
            'fallback_ids' => array_values(array_unique($fallbackFixtureIds)),
        ];
    }

    private function save(string $directory, string $filename, string $body): string
    {
        $path = $directory.DIRECTORY_SEPARATOR.$filename;
        if (file_put_contents($path, $body, LOCK_EX) === false) {
            throw new RuntimeException('Impossible d’enregistrer une réponse API-Football.');
        }

        return $path;
    }

    /**
     * @return array{int|null, int|null}
     */
    private function readQuota(Response $response, ?int $remaining, ?int $limit): array
    {
        $remainingHeader = $response->header('x-ratelimit-requests-remaining');
        $limitHeader = $response->header('x-ratelimit-requests-limit');

        return [
            is_string($remainingHeader) && ctype_digit($remainingHeader) ? (int) $remainingHeader : $remaining,
            is_string($limitHeader) && ctype_digit($limitHeader) ? (int) $limitHeader : $limit,
        ];
    }

    private function assertSuccessful(Response $response, string $endpoint): void
    {
        if (! $response->successful()) {
            throw new RuntimeException("API-Football a répondu HTTP {$response->status()} pour {$endpoint}.");
        }
    }

    private function assertQuotaAvailable(?int $remaining, string $endpoint): void
    {
        if ($remaining !== null && $remaining <= 0) {
            throw new RuntimeException("Quota API-Football épuisé : appel {$endpoint} évité.");
        }
    }
}
