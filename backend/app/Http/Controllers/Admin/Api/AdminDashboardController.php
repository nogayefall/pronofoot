<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use App\Models\TrackedMatch;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

final class AdminDashboardController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $now = CarbonImmutable::now();
        $matches = TrackedMatch::query()
            ->where('is_active', true)
            ->orderBy('home_team')
            ->get()
            ->map(function (TrackedMatch $match): array {
                $snapshot = $match->snapshots()->latest('captured_at')->first();

                return [
                    'id' => $match->id,
                    'homeTeam' => $match->home_team,
                    'awayTeam' => $match->away_team,
                    'competition' => $match->competition,
                    'status' => $match->status,
                    'minute' => $snapshot?->minute,
                    'homeScore' => $snapshot?->home_score,
                    'awayScore' => $snapshot?->away_score,
                    'vitality' => $snapshot?->vitality_score,
                    'capturedAt' => $snapshot?->captured_at?->toIso8601String(),
                ];
            });

        $alerts = Alert::query()
            ->whereIn('status', ['queued', 'sent'])
            ->where(fn ($query) => $query->whereNull('expires_at')->orWhere('expires_at', '>', $now))
            ->with('opportunityLog.trackedMatch')
            ->orderBy('expires_at')
            ->get()
            ->map(function (Alert $alert): array {
                $match = $alert->opportunityLog?->trackedMatch;

                return [
                    'id' => $alert->id,
                    'message' => $alert->message,
                    'status' => $alert->status,
                    'channel' => $alert->channel,
                    'fallbackUsed' => $alert->fallback_used,
                    'expiresAt' => $alert->expires_at?->toIso8601String(),
                    'match' => $match === null ? null : "{$match->home_team} - {$match->away_team}",
                ];
            });

        $lastPassAt = Cache::get('pronofoot.scan.last_pass_at');
        $scanRunning = Cache::get('pronofoot.scan.running', false);
        $providerStatus = Cache::get('pronofoot.provider_status', []);

        return response()->json([
            'simulation' => config('services.pronofoot.football_driver') === 'fake'
                || config('services.pronofoot.odds_driver') === 'fake',
            'scan' => [
                'active' => $scanRunning === true,
                'lastPassAt' => is_string($lastPassAt) ? $lastPassAt : null,
            ],
            'trackedMatches' => $matches,
            'activeAlerts' => $alerts,
            'quotas' => [
                'football' => $providerStatus['football']['requestsRemaining'] ?? null,
                'odds' => $providerStatus['odds']['requestsRemaining'] ?? null,
            ],
            'providerStatus' => $providerStatus,
        ]);
    }
}
