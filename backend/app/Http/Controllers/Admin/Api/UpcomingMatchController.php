<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\TrackedMatch;
use App\Providers\Contracts\FootballProvider;
use App\Providers\Data\FootballMatch;
use App\Providers\Data\ProviderUnavailable;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;
use Throwable;

/**
 * « Matchs à venir aujourd’hui » : une requête fixtures?date= pour toutes les compétitions, gardée 15 minutes en cache
 * (jamais à chaque chargement de page). « Suivre dès le coup d’envoi » enregistre un suivi planifié, sans appel API :
 * le scan l’active quand le match passe en direct. Pas de cotes pré-match ni de statistiques avant le coup d’envoi.
 */
final class UpcomingMatchController extends Controller
{
    public const CACHE_SECONDS = 900;

    public function index(FootballProvider $provider): JsonResponse
    {
        try {
            $day = $this->day($provider);
        } catch (ProviderUnavailable $exception) {
            return response()->json(['message' => $exception->getMessage()], 503);
        }

        $now = CarbonImmutable::now();
        $scheduled = TrackedMatch::query()
            ->where('tracking_mode', 'scheduled')
            ->where('is_active', false)
            ->whereNull('ended_at')
            ->whereIn('provider_match_id', array_column($day['matches'], 'providerMatchId'))
            ->get()
            ->keyBy('provider_match_id');

        $matches = array_values(array_filter(
            $day['matches'],
            fn (array $match): bool => $match['kickoffAt'] === null || CarbonImmutable::parse($match['kickoffAt'])->greaterThan($now),
        ));
        usort($matches, fn (array $left, array $right): int => [$left['kickoffAt'] ?? '9999', $left['competition'] ?? ''] <=> [$right['kickoffAt'] ?? '9999', $right['competition'] ?? '']);

        return response()->json([
            'date' => $day['date'],
            'cachedAt' => $day['cachedAt'],
            'message' => $day['message'],
            'matches' => array_map(fn (array $match): array => [
                ...$match,
                'scheduled' => $scheduled->has($match['providerMatchId']),
                'trackedId' => $scheduled->get($match['providerMatchId'])?->id,
            ], $matches),
        ]);
    }

    public function store(Request $request, FootballProvider $provider): JsonResponse
    {
        $validated = $request->validate(['provider_match_id' => ['required', 'string', 'max:255']]);

        try {
            $day = $this->day($provider);
        } catch (ProviderUnavailable $exception) {
            throw ValidationException::withMessages(['provider' => $exception->getMessage()]);
        }

        $match = collect($day['matches'])->firstWhere('providerMatchId', $validated['provider_match_id']);
        if (! is_array($match)) {
            return response()->json(['message' => 'Ce match ne figure pas dans les matchs à venir aujourd’hui.'], 404);
        }

        $trackedMatch = TrackedMatch::query()->updateOrCreate(
            ['provider' => $day['driver'], 'provider_match_id' => $match['providerMatchId']],
            [
                'home_team' => $match['homeTeam'],
                'away_team' => $match['awayTeam'],
                'competition' => $match['competition'],
                'kickoff_at' => $match['kickoffAt'] === null ? null : CarbonImmutable::parse($match['kickoffAt']),
                'status' => 'Planifié',
                'is_active' => false,
                'tracking_mode' => 'scheduled',
                'statistics_available' => null,
                'ended_at' => null,
                'ended_reason' => null,
                'missing_readings' => 0,
            ],
        );

        return response()->json(['match' => $trackedMatch, 'message' => 'Suivi planifié : il démarrera dès le coup d’envoi.'], 201);
    }

    /**
     * Matchs du jour (UTC), en cache 15 minutes : une seule requête fournisseur par quart d’heure au plus.
     *
     * @return array{date: string, driver: string, cachedAt: string, message: string, matches: list<array<string, mixed>>}
     */
    private function day(FootballProvider $provider): array
    {
        $date = CarbonImmutable::now()->toDateString();
        $key = "pronofoot.fixtures.{$date}";
        $cached = Cache::get($key);
        if (is_array($cached)) {
            return $cached;
        }

        $feed = $provider->getFixturesByDate($date);
        if ($feed->reachable !== true) {
            throw new ProviderUnavailable($feed->statusMessage);
        }

        $day = [
            'date' => $date,
            'driver' => $feed->driver,
            'cachedAt' => CarbonImmutable::now()->toIso8601String(),
            'message' => $feed->statusMessage,
            'matches' => array_values(array_map(
                fn (FootballMatch $match): array => [
                    'providerMatchId' => $match->providerMatchId,
                    'homeTeam' => $match->homeTeam,
                    'awayTeam' => $match->awayTeam,
                    'competition' => $match->competition,
                    'leagueId' => $match->leagueId,
                    'kickoffAt' => $this->isoDate($match->kickoffAt),
                ],
                array_filter($feed->matches, fn (FootballMatch $match): bool => in_array($match->statusShort, ['NS', 'TBD'], true)),
            )),
        ];
        Cache::put($key, $day, self::CACHE_SECONDS);

        return $day;
    }

    private function isoDate(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        try {
            return CarbonImmutable::parse($value)->toIso8601String();
        } catch (Throwable) {
            return null;
        }
    }
}
