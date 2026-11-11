<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\TrackedMatch;
use App\Providers\Contracts\FootballProvider;
use App\Providers\Contracts\OddsProvider;
use App\Providers\Data\FootballFeed;
use App\Providers\Data\FootballMatch;
use App\Providers\Data\OddsMatch;
use App\Providers\Data\ProviderUnavailable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;

final class TrackedMatchController extends Controller
{
    public function index(FootballProvider $provider, OddsProvider $oddsProvider): JsonResponse
    {
        try {
            $feed = $provider->getLiveMatches(includeStatistics: false, includeCoverage: true);
        } catch (ProviderUnavailable $exception) {
            return response()->json(['message' => $exception->getMessage()], 503);
        }

        if ($feed->reachable !== true) {
            return response()->json(['message' => $feed->statusMessage], 503);
        }

        try {
            $oddsFeed = $oddsProvider->getLiveOdds();
        } catch (ProviderUnavailable) {
            $oddsFeed = null;
        }
        $oddsByMatch = collect($oddsFeed?->matches ?? [])->keyBy('providerMatchId');

        $providerName = $feed->driver;
        $tracked = TrackedMatch::query()
            ->where('provider', $providerName)
            ->get()
            ->keyBy('provider_match_id');

        $providerStatus = Cache::get('pronofoot.provider_status', []);
        $providerStatus['football'] = [
            'driver' => $feed->driver,
            'requestsUsed' => $feed->requestsUsed,
            'requestsRemaining' => $feed->requestsRemaining,
            'checkedAt' => now()->toIso8601String(),
            'message' => $feed->statusMessage,
        ];
        Cache::put('pronofoot.provider_status', $providerStatus, now()->addDay());

        return response()->json([
            'simulation' => $feed->driver === 'fake',
            'message' => $feed->statusMessage,
            'quotaRemaining' => $feed->requestsRemaining,
            'matches' => array_map(
                fn (FootballMatch $match): array => [
                    'providerMatchId' => $match->providerMatchId,
                    'homeTeam' => $match->homeTeam,
                    'awayTeam' => $match->awayTeam,
                    'competition' => $match->competition,
                    'kickoffAt' => $match->kickoffAt,
                    'status' => $match->status,
                    'minute' => $match->minute,
                    'homeScore' => $match->homeScore,
                    'awayScore' => $match->awayScore,
                    'exactScoreMarketAvailable' => ($oddsByMatch->get($match->providerMatchId)?->exactScoreOdds ?? []) !== [],
                    'statisticsCoverage' => $match->statisticsCoverage,
                    'statisticsCoverageFallback' => $match->statisticsCoverageFallback,
                    'statisticsCoverageSeason' => $match->statisticsCoverageSeason,
                    'tracked' => (bool) ($tracked->get($match->providerMatchId)?->is_active ?? false),
                    'trackedId' => $tracked->get($match->providerMatchId)?->id,
                ],
                $feed->matches,
            ),
        ]);
    }

    public function store(Request $request, FootballProvider $provider, OddsProvider $oddsProvider): JsonResponse
    {
        $validated = $request->validate([
            'provider_match_id' => ['required', 'string', 'max:255'],
        ]);
        $feed = $this->loadFeed($provider);

        if ($feed->requestsRemaining !== null && $feed->requestsRemaining <= 0) {
            throw ValidationException::withMessages([
                'provider_match_id' => 'Le fournisseur indique qu’aucune requête ne reste dans le quota.',
            ]);
        }

        $match = collect($feed->matches)->first(
            fn (FootballMatch $candidate): bool => $candidate->providerMatchId === $validated['provider_match_id'],
        );
        if (! $match instanceof FootballMatch) {
            return response()->json(['message' => 'Ce match ne figure pas dans la liste actuelle du fournisseur.'], 404);
        }

        if ($match->statisticsCoverage === false) {
            throw ValidationException::withMessages([
                'provider_match_id' => 'Ce match ne peut pas être suivi : la ligue indique que les statistiques ne sont pas couvertes.',
            ]);
        }

        try {
            $oddsFeed = $oddsProvider->getLiveOdds();
        } catch (ProviderUnavailable $exception) {
            throw ValidationException::withMessages(['provider' => $exception->getMessage()]);
        }
        $marketMatch = collect($oddsFeed->matches)->first(
            fn (OddsMatch $candidate): bool => $candidate->providerMatchId === $match->providerMatchId
                && $candidate->exactScoreOdds !== [],
        );
        if (! $marketMatch) {
            throw ValidationException::withMessages([
                'provider_match_id' => 'Ce match ne peut pas être suivi : aucune cote de score exact non suspendue n’est disponible.',
            ]);
        }

        $trackedMatch = TrackedMatch::query()->updateOrCreate(
            ['provider' => $feed->driver, 'provider_match_id' => $match->providerMatchId],
            [
                'home_team' => $match->homeTeam,
                'away_team' => $match->awayTeam,
                'competition' => $match->competition,
                'kickoff_at' => $match->kickoffAt,
                'status' => $match->status,
                'is_active' => true,
            ],
        );

        $warnings = [];
        if ($match->statisticsCoverage === null) {
            $warnings[] = 'Statistiques non confirmées.';
        }
        if ($match->statisticsCoverageFallback) {
            $warnings[] = 'Valeur de couverture reprise de la saison courante '.$match->statisticsCoverageSeason.' faute de saison correspondante.';
        }

        return response()->json(['match' => $trackedMatch, 'warnings' => $warnings], 201);
    }

    public function destroy(TrackedMatch $trackedMatch): JsonResponse
    {
        $trackedMatch->forceFill(['is_active' => false])->save();

        return response()->json(['message' => 'Le match a été retiré du suivi.']);
    }

    private function loadFeed(FootballProvider $provider): FootballFeed
    {
        try {
            $feed = $provider->getLiveMatches(includeStatistics: false, includeCoverage: true);
        } catch (ProviderUnavailable $exception) {
            throw ValidationException::withMessages(['provider' => $exception->getMessage()]);
        }

        if ($feed->reachable !== true) {
            throw ValidationException::withMessages(['provider' => $feed->statusMessage]);
        }

        return $feed;
    }
}
