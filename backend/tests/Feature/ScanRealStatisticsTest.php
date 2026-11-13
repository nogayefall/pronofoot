<?php

namespace Tests\Feature;

use App\Models\Alert;
use App\Models\OpportunityLog;
use App\Models\RuleProfile;
use App\Models\Setting;
use App\Models\TrackedMatch;
use App\Rules\RuleConfiguration;
use App\Services\ScanService;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ScanRealStatisticsTest extends TestCase
{
    use RefreshDatabase;

    /** @var list<int> */
    private const LIVE_FIXTURES = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110];

    /** @var list<int> */
    private const TRACKED_FIXTURES = [103, 106, 109];

    protected function setUp(): void
    {
        parent::setUp();
        config([
            'services.pronofoot.football_driver' => 'real',
            'services.pronofoot.odds_driver' => 'api_football',
            'services.football_api.base_url' => 'https://api.example.test',
            'services.football_api.api_key' => 'test-api-key',
        ]);
        Http::preventStrayRequests();
        CarbonImmutable::setTestNow('2026-11-11 19:00:00');
        foreach (self::TRACKED_FIXTURES as $fixtureId) {
            TrackedMatch::query()->create([
                'provider' => 'real',
                'provider_match_id' => (string) $fixtureId,
                'home_team' => "Home {$fixtureId}",
                'away_team' => "Away {$fixtureId}",
                'is_active' => true,
            ]);
        }
    }

    protected function tearDown(): void
    {
        CarbonImmutable::setTestNow();
        parent::tearDown();
    }

    public function test_statistics_are_requested_only_for_the_three_tracked_matches(): void
    {
        $this->fakeApi();

        $result = app(ScanService::class)->runOnce();

        $statisticsRequests = $this->statisticsRequests();
        $this->assertCount(3, $statisticsRequests);
        $this->assertEqualsCanonicalizing(['103', '106', '109'], $statisticsRequests);
        Http::assertSentCount(5);
        $this->assertSame(3, $result->snapshotsStored);
        $this->assertFalse($result->quotaStopped);

        $snapshot = TrackedMatch::query()->where('provider_match_id', '106')->firstOrFail()->snapshots()->firstOrFail();
        $this->assertSame(
            ['shots' => 5, 'shots_on_target' => 3, 'corners' => 2, 'possession' => 40],
            $snapshot->statistics['home'],
        );
        $this->assertNotNull($snapshot->statistics_captured_at);
        $this->assertSame(60.0, $snapshot->vitality_score, 'Tirs 14 : 20 pts, cadrés 4 : 20 pts, possession 60 : 20 pts, corners 3 : 0 pt.');
    }

    public function test_statistics_follow_the_configured_interval(): void
    {
        $this->fakeApi();
        $scanner = app(ScanService::class);

        $scanner->runOnce(forceRefresh: false);
        CarbonImmutable::setTestNow('2026-11-11 19:00:30');
        $scanner->runOnce(forceRefresh: false);
        $this->assertCount(3, $this->statisticsRequests());

        CarbonImmutable::setTestNow('2026-11-11 19:01:00');
        $scanner->runOnce(forceRefresh: false);
        $this->assertCount(6, $this->statisticsRequests());
    }

    public function test_a_failed_statistics_call_only_marks_that_match_unavailable(): void
    {
        $this->fakeApi(failingStatistics: [106]);

        app(ScanService::class)->runOnce();

        $this->assertCount(3, $this->statisticsRequests());
        $failed = TrackedMatch::query()->where('provider_match_id', '106')->firstOrFail();
        $incident = OpportunityLog::query()
            ->where('tracked_match_id', $failed->id)
            ->where('event_type', 'statistics_unavailable')
            ->firstOrFail();
        $this->assertSame('no_alert', $incident->decision);
        $this->assertStringContainsString('HTTP 500', $incident->reason);
        $this->assertSame([], $failed->snapshots()->firstOrFail()->statistics);
        $this->assertNull($failed->snapshots()->firstOrFail()->vitality_score);

        foreach (['103', '109'] as $fixtureId) {
            $match = TrackedMatch::query()->where('provider_match_id', $fixtureId)->firstOrFail();
            $this->assertSame(5, $match->snapshots()->firstOrFail()->statistics['home']['shots']);
            $this->assertFalse(OpportunityLog::query()
                ->where('tracked_match_id', $match->id)
                ->where('event_type', 'statistics_unavailable')
                ->exists());
        }
        $this->assertSame(0, Alert::query()->count());
    }

    public function test_a_stopped_match_keeps_its_statistics_but_receives_no_alert(): void
    {
        $this->fakeApi(stoppedOdds: [109]);

        app(ScanService::class)->runOnce();

        $match = TrackedMatch::query()->where('provider_match_id', '109')->firstOrFail();
        $this->assertSame(9, $match->snapshots()->firstOrFail()->statistics['away']['shots']);
        $log = OpportunityLog::query()->where('tracked_match_id', $match->id)->sole();
        $this->assertSame('match_stopped', $log->event_type);
        $this->assertSame('no_alert', $log->decision);
        $this->assertSame(0, Alert::query()->count());
    }

    public function test_real_halftime_match_keeps_statistics_and_waits_for_under_2_5_odds(): void
    {
        RuleProfile::query()->create([
            'name' => 'Profil réel',
            'is_active' => true,
            'settings' => ['active_rules' => RuleConfiguration::DEFINED_RULES, 'method_weights' => []],
        ]);
        $this->fakeApi(stoppedOdds: [109], halftime: [109]);

        app(ScanService::class)->runOnce();

        $match = TrackedMatch::query()->where('provider_match_id', '109')->firstOrFail();
        $this->assertSame(9, $match->snapshots()->firstOrFail()->statistics['away']['shots']);
        $log = OpportunityLog::query()->where('tracked_match_id', $match->id)->sole();
        $this->assertSame('no_alert', $log->decision);
        $this->assertStringContainsString('Under 2.5', $log->reason);
        $this->assertSame(0, Alert::query()->count());
    }

    public function test_scan_stops_before_statistics_when_quota_is_below_the_configured_threshold(): void
    {
        Setting::query()->where('key', 'scan.quota_alert_threshold')->update(['value' => '10']);
        $this->fakeApi(liveRemaining: 9);

        $result = app(ScanService::class)->runOnce();

        $this->assertTrue($result->quotaStopped);
        $this->assertCount(0, $this->statisticsRequests());
        Http::assertNotSent(fn (Request $request): bool => str_contains($request->url(), '/odds/live'));
        Http::assertSentCount(1);
        $this->assertSame(3, OpportunityLog::query()->where('event_type', 'quota_threshold_reached')->count());
        $this->assertStringContainsString('9 < 10', OpportunityLog::query()->firstOrFail()->reason);
        $this->assertSame(0, Alert::query()->count());
    }

    public function test_quota_is_counted_after_each_statistics_call(): void
    {
        Setting::query()->where('key', 'scan.quota_alert_threshold')->update(['value' => '10']);
        $this->fakeApi(liveRemaining: 11, statisticsRemainingStart: 10);

        $result = app(ScanService::class)->runOnce();

        $this->assertTrue($result->quotaStopped);
        $this->assertCount(2, $this->statisticsRequests());
        Http::assertNotSent(fn (Request $request): bool => str_contains($request->url(), '/odds/live'));
    }

    public function test_without_a_confirmed_threshold_the_scan_stops_only_at_zero(): void
    {
        $this->fakeApi(liveRemaining: 6, statisticsRemainingStart: 5);

        $result = app(ScanService::class)->runOnce();

        $this->assertFalse($result->quotaStopped);
        $this->assertCount(3, $this->statisticsRequests());
        $this->assertSame(0, OpportunityLog::query()->where('event_type', 'quota_threshold_reached')->count());
    }

    public function test_an_exhausted_quota_stops_the_scan_without_statistics_calls(): void
    {
        $this->fakeApi(liveRemaining: 0);

        $result = app(ScanService::class)->runOnce();

        $this->assertTrue($result->quotaStopped);
        $this->assertCount(0, $this->statisticsRequests());
        Http::assertSentCount(1);
        $this->assertStringContainsString('Quota API-Football épuisé', OpportunityLog::query()->firstOrFail()->reason);
    }

    public function test_scan_once_lists_each_incident_with_match_type_and_french_reason(): void
    {
        TrackedMatch::query()->create([
            'provider' => 'real',
            'provider_match_id' => '999',
            'home_team' => 'Avenir du Nord',
            'away_team' => 'Union du Sud',
            'is_active' => true,
        ]);
        TrackedMatch::query()->where('provider_match_id', '109')->update([
            'home_team' => 'France U17',
            'away_team' => 'Armenia U17',
        ]);
        $this->fakeApi(stoppedOdds: [109]);

        $this->artisan('scan:once')
            ->expectsOutputToContain('Incidents : 2')
            ->expectsOutputToContain('Avenir du Nord – Union du Sud : données du match manquantes — Match introuvable dans le flux en direct.')
            ->expectsOutputToContain('France U17 – Armenia U17 : match arrêté — Match arrêté par le fournisseur : aucune alerte, statistiques conservées.')
            ->assertExitCode(1);
    }

    /**
     * @return list<string>
     */
    private function statisticsRequests(): array
    {
        return Http::recorded()
            ->map(fn (array $pair): Request => $pair[0])
            ->filter(fn (Request $request): bool => str_contains($request->url(), '/fixtures/statistics'))
            ->map(fn (Request $request): string => (string) $request->data()['fixture'])
            ->values()
            ->all();
    }

    /**
     * @param  list<int>  $failingStatistics
     * @param  list<int>  $stoppedOdds
     */
    private function fakeApi(
        array $failingStatistics = [],
        array $stoppedOdds = [],
        int $liveRemaining = 100,
        ?int $statisticsRemainingStart = null,
        array $halftime = [],
    ): void {
        $statisticsRemaining = $statisticsRemainingStart ?? $liveRemaining - 1;

        Http::fake(function (Request $request) use ($failingStatistics, $stoppedOdds, $liveRemaining, $halftime, &$statisticsRemaining) {
            $url = $request->url();
            if (str_contains($url, '/fixtures/statistics')) {
                $fixtureId = (int) $request->data()['fixture'];
                $headers = ['x-ratelimit-requests-remaining' => (string) $statisticsRemaining--];

                return in_array($fixtureId, $failingStatistics, true)
                    ? Http::response('{"errors":["server"]}', 500, $headers)
                    : Http::response($this->statisticsBody($fixtureId), 200, $headers);
            }

            if (str_contains($url, '/fixtures')) {
                return Http::response($this->liveBody($halftime), 200, ['x-ratelimit-requests-remaining' => (string) $liveRemaining]);
            }

            if (str_contains($url, '/odds/live')) {
                return Http::response($this->oddsBody($stoppedOdds), 200, ['x-ratelimit-requests-remaining' => (string) max(0, $statisticsRemaining)]);
            }

            return Http::response('', 404);
        });
    }

    /**
     * @param  list<int>  $halftime
     */
    private function liveBody(array $halftime = []): string
    {
        return json_encode(['errors' => [], 'response' => array_map(fn (int $id): array => [
            'fixture' => ['id' => $id, 'status' => in_array($id, $halftime, true)
                ? ['long' => 'Halftime', 'short' => 'HT', 'elapsed' => 45]
                : ['long' => 'Second Half', 'short' => '2H', 'elapsed' => 60]],
            'league' => ['id' => 1, 'name' => 'Ligue de test', 'season' => 2026],
            'teams' => [
                'home' => ['id' => $id * 10 + 1, 'name' => "Home {$id}"],
                'away' => ['id' => $id * 10 + 2, 'name' => "Away {$id}"],
            ],
            'goals' => ['home' => 0, 'away' => 0],
        ], self::LIVE_FIXTURES)], JSON_THROW_ON_ERROR);
    }

    private function statisticsBody(int $fixtureId): string
    {
        $payload = json_decode(
            (string) file_get_contents(database_path('fixtures/api-football/fixtures-statistics-covered.json')),
            true,
            flags: JSON_THROW_ON_ERROR,
        );
        $payload['parameters']['fixture'] = (string) $fixtureId;
        $payload['response'][0]['team']['id'] = $fixtureId * 10 + 1;
        $payload['response'][1]['team']['id'] = $fixtureId * 10 + 2;

        return json_encode($payload, JSON_THROW_ON_ERROR);
    }

    /**
     * @param  list<int>  $stoppedOdds
     */
    private function oddsBody(array $stoppedOdds): string
    {
        return json_encode(['errors' => [], 'response' => array_map(fn (int $id): array => [
            'fixture' => ['id' => $id, 'status' => ['long' => 'Second Half', 'elapsed' => 60]],
            'status' => ['stopped' => in_array($id, $stoppedOdds, true), 'blocked' => false, 'finished' => false],
            'teams' => ['home' => ['goals' => 0], 'away' => ['goals' => 0]],
            'odds' => [[
                'id' => 23,
                'name' => 'Final Score',
                'values' => [
                    ['value' => '0-0', 'odd' => '7.50', 'suspended' => false],
                    ['value' => '1-0', 'odd' => '8.60', 'suspended' => false],
                    ['value' => '0-1', 'odd' => '9.80', 'suspended' => false],
                ],
            ]],
        ], self::LIVE_FIXTURES)], JSON_THROW_ON_ERROR);
    }
}
