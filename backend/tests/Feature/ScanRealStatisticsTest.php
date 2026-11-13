<?php

namespace Tests\Feature;

use App\Jobs\SendQuotaNotification;
use App\Models\Alert;
use App\Models\MatchSnapshot;
use App\Models\OpportunityLog;
use App\Models\RuleProfile;
use App\Models\Setting;
use App\Models\TrackedMatch;
use App\Rules\RuleConfiguration;
use App\Services\QuotaGuard;
use App\Services\ScanService;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
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

    public function test_real_halftime_under_2_5_in_range_creates_the_f121_e2_alert(): void
    {
        Queue::fake();
        RuleProfile::query()->create([
            'name' => 'Profil réel',
            'is_active' => true,
            'settings' => ['active_rules' => RuleConfiguration::DEFINED_RULES, 'method_weights' => []],
        ]);
        $this->fakeApi(stoppedOdds: [109], halftime: [109], under25: [109 => '1.36']);

        $result = app(ScanService::class)->runOnce();

        $this->assertSame(1, $result->alertsCreated);
        $log = OpportunityLog::query()->where('decision', 'alert')->sole();
        $this->assertSame('F121-E2', $log->rule_id);
        $this->assertSame('Over 0.5 buts en 2ème mi-temps', $log->suggested_action);
        Http::assertSent(fn (Request $request): bool => str_ends_with($request->url(), '/odds/live?bet=36'));
    }

    public function test_bet_36_is_not_requested_when_no_tracked_match_is_at_halftime(): void
    {
        $this->fakeApi();

        app(ScanService::class)->runOnce();

        Http::assertNotSent(fn (Request $request): bool => str_ends_with($request->url(), '/odds/live?bet=36'));
    }

    public function test_quota_is_counted_after_each_statistics_call_and_stops_at_zero(): void
    {
        Queue::fake();
        $this->fakeApi(liveRemaining: 2, statisticsRemainingStart: 1);

        $result = app(ScanService::class)->runOnce();

        $this->assertTrue($result->quotaStopped);
        $this->assertCount(2, $this->statisticsRequests());
        Http::assertNotSent(fn (Request $request): bool => str_contains($request->url(), '/odds/live'));
        $this->assertSame(3, OpportunityLog::query()->where('event_type', 'quota_threshold_reached')->count());
        $this->assertSame(QuotaGuard::EXHAUSTED_MESSAGE, OpportunityLog::query()->firstOrFail()->reason);
        Queue::assertPushed(SendQuotaNotification::class, fn (SendQuotaNotification $job): bool => $job->body === QuotaGuard::EXHAUSTED_MESSAGE);
    }

    public function test_an_exhausted_quota_stops_the_live_with_the_client_message(): void
    {
        Queue::fake();
        $this->fakeApi(liveRemaining: 0);

        $result = app(ScanService::class)->runOnce();

        $this->assertTrue($result->quotaStopped);
        $this->assertCount(0, $this->statisticsRequests());
        Http::assertSentCount(1);
        $this->assertSame('Quota épuisé. Le live est arrêté. Rechargez le quota.', OpportunityLog::query()->firstOrFail()->reason);
        Queue::assertPushed(SendQuotaNotification::class, 1);

        $this->artisan('scan:run', ['--max-passes' => 3])
            ->expectsOutputToContain('Quota épuisé. Le live est arrêté. Rechargez le quota.')
            ->assertExitCode(1);
        Queue::assertPushed(SendQuotaNotification::class, 1);
    }

    public function test_reaching_ten_percent_of_the_daily_quota_sends_one_alert_and_enables_economy_mode(): void
    {
        Queue::fake();
        $this->fakeApi(liveRemaining: 10, statisticsRemainingStart: 9, limit: 100);

        $first = app(ScanService::class)->runOnce();
        $this->assertFalse($first->economyMode, 'Le mode se décide sur le quota connu avant le passage.');
        Queue::assertPushed(SendQuotaNotification::class, fn (SendQuotaNotification $job): bool => str_contains($job->body, '7 requêtes restantes sur 100')
            && str_contains($job->body, 'Mode économie'));

        CarbonImmutable::setTestNow('2026-11-11 19:00:30');
        $second = app(ScanService::class)->runOnce();
        $this->assertTrue($second->economyMode);
        Queue::assertPushed(SendQuotaNotification::class, 1);
    }

    public function test_economy_mode_scans_hot_matches_every_30_seconds_calm_every_2_minutes_and_skips_closed_ones(): void
    {
        Queue::fake();
        Cache::put('pronofoot.provider_status', ['football' => ['requestsRemaining' => 50, 'requestsLimit' => 1000]]);
        $past = CarbonImmutable::now()->subSeconds(60);
        $this->snapshot('103', ['0-0' => 3.0, '1-0' => 4.0, '0-1' => 9.0], $past);
        $this->snapshot('106', ['0-0' => 3.0, '1-0' => 4.8, '0-1' => 9.0], $past);
        $this->snapshot('109', ['0-0' => 3.0, '1-0' => 5.5, '0-1' => 9.0], $past);
        $this->fakeApi(liveRemaining: 49, limit: 1000);

        $result = app(ScanService::class)->runOnce();

        $this->assertTrue($result->economyMode);
        $this->assertSame(2, $result->skippedByEconomy);
        $this->assertSame(['103'], $this->statisticsRequests());

        TrackedMatch::query()->where('provider_match_id', '106')->firstOrFail()->snapshots()->update(['captured_at' => CarbonImmutable::now()->subSeconds(120)]);
        CarbonImmutable::setTestNow('2026-11-11 19:00:30');
        $scanner = app(ScanService::class);
        $this->assertSame(1, $scanner->runOnce()->skippedByEconomy, 'Le match calme est scanné après 2 minutes ; le match fermé jamais.');
    }

    public function test_match_heat_classifies_gap_and_falling_odds(): void
    {
        $scanner = app(ScanService::class);
        $snapshot = fn (array $odds, ?float $trend = null): MatchSnapshot => new MatchSnapshot([
            'home_score' => 0,
            'away_score' => 0,
            'exact_score_odds' => $odds,
            'odds_change_percent' => $trend,
        ]);

        $this->assertSame('hot', $scanner->matchHeat($snapshot(['0-0' => 3.0, '1-0' => 4.49, '0-1' => 9.0]), 1.5, 2.0));
        $this->assertSame('calm', $scanner->matchHeat($snapshot(['0-0' => 3.0, '1-0' => 4.5, '0-1' => 9.0]), 1.5, 2.0));
        $this->assertSame('calm', $scanner->matchHeat($snapshot(['0-0' => 3.0, '1-0' => 5.0, '0-1' => 9.0]), 1.5, 2.0));
        $this->assertSame('none', $scanner->matchHeat($snapshot(['0-0' => 3.0, '1-0' => 5.01, '0-1' => 9.0]), 1.5, 2.0));
        $this->assertSame('hot', $scanner->matchHeat($snapshot(['0-0' => 3.0, '1-0' => 5.5, '0-1' => 9.0], -1.0), 1.5, 2.0));
        $this->assertSame('calm', $scanner->matchHeat(null, 1.5, 2.0));
    }

    public function test_automatic_mode_tracks_major_league_matches_with_exact_score_odds_and_statistics(): void
    {
        $this->fakeApi(leagues: [101 => 39, 102 => 140, 104 => 61, 105 => 2], withoutOdds: [104], coveredLeagues: [39, 61]);

        $result = app(ScanService::class)->runOnce();

        $this->assertSame(1, $result->autoTracked);
        $auto = TrackedMatch::query()->where('tracking_mode', 'auto')->pluck('provider_match_id')->all();
        $this->assertSame(['101'], $auto, '102 : statistiques non couvertes ; 104 : pas de cote exacte ; 105 : ligue non couverte.');
        Http::assertSent(fn (Request $request): bool => str_contains($request->url(), '/leagues'));
    }

    public function test_automatic_mode_respects_manual_removal_and_drops_finished_matches(): void
    {
        TrackedMatch::query()->create([
            'provider' => 'real',
            'provider_match_id' => '102',
            'home_team' => 'Home 102',
            'away_team' => 'Away 102',
            'is_active' => false,
            'tracking_mode' => 'manual',
        ]);
        TrackedMatch::query()->create([
            'provider' => 'real',
            'provider_match_id' => '999',
            'home_team' => 'Fini',
            'away_team' => 'Fini',
            'is_active' => true,
            'tracking_mode' => 'auto',
        ]);
        $this->fakeApi(leagues: [101 => 39, 102 => 39], coveredLeagues: [39]);

        app(ScanService::class)->runOnce();

        $this->assertFalse(TrackedMatch::query()->where('provider_match_id', '102')->firstOrFail()->is_active);
        $this->assertTrue(TrackedMatch::query()->where('provider_match_id', '101')->firstOrFail()->is_active);
        $this->assertFalse(TrackedMatch::query()->where('provider_match_id', '999')->firstOrFail()->is_active);
    }

    public function test_automatic_mode_can_be_disabled_and_skips_the_coverage_call_outside_listed_leagues(): void
    {
        $this->fakeApi();
        app(ScanService::class)->runOnce();
        Http::assertNotSent(fn (Request $request): bool => str_contains($request->url(), '/leagues'));

        Setting::query()->where('key', 'scan.auto_mode')->update(['value' => '0']);
        $this->fakeApi(leagues: [101 => 39], coveredLeagues: [39]);
        app(ScanService::class)->runOnce();
        $this->assertSame(0, TrackedMatch::query()->where('tracking_mode', 'auto')->count());
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
     * @param  list<int>  $halftime
     * @param  array<int, int>  $leagues  Ligue par identifiant de match (1 par défaut).
     * @param  list<int>  $withoutOdds
     * @param  list<int>  $coveredLeagues  Ligues dont la saison 2026 couvre les statistiques.
     */
    private function fakeApi(
        array $failingStatistics = [],
        array $stoppedOdds = [],
        int $liveRemaining = 100,
        ?int $statisticsRemainingStart = null,
        array $halftime = [],
        ?int $limit = null,
        array $leagues = [],
        array $withoutOdds = [],
        array $coveredLeagues = [],
        array $under25 = [],
    ): void {
        $statisticsRemaining = $statisticsRemainingStart ?? $liveRemaining - 1;
        $headers = fn (int $remaining): array => array_filter([
            'x-ratelimit-requests-remaining' => (string) $remaining,
            'x-ratelimit-requests-limit' => $limit === null ? null : (string) $limit,
        ], fn (?string $value): bool => $value !== null);

        Http::fake(function (Request $request) use ($failingStatistics, $stoppedOdds, $liveRemaining, $halftime, $leagues, $withoutOdds, $coveredLeagues, $under25, $headers, &$statisticsRemaining) {
            $url = $request->url();
            if (str_contains($url, '/fixtures/statistics')) {
                $fixtureId = (int) $request->data()['fixture'];
                $responseHeaders = $headers($statisticsRemaining--);

                return in_array($fixtureId, $failingStatistics, true)
                    ? Http::response('{"errors":["server"]}', 500, $responseHeaders)
                    : Http::response($this->statisticsBody($fixtureId), 200, $responseHeaders);
            }

            if (str_contains($url, '/fixtures')) {
                return Http::response($this->liveBody($halftime, $leagues), 200, $headers($liveRemaining));
            }

            if (str_contains($url, '/leagues')) {
                return Http::response($this->coverageBody($coveredLeagues), 200, $headers(max(0, $statisticsRemaining)));
            }

            if (str_contains($url, '/odds/live') && (string) ($request->data()['bet'] ?? '') === '36') {
                return Http::response($this->overUnderBody($under25), 200, $headers(max(0, $statisticsRemaining)));
            }

            if (str_contains($url, '/odds/live')) {
                return Http::response($this->oddsBody($stoppedOdds, $withoutOdds), 200, $headers(max(0, $statisticsRemaining)));
            }

            return Http::response('', 404);
        });
    }

    /**
     * @param  list<int>  $halftime
     * @param  array<int, int>  $leagues
     */
    private function liveBody(array $halftime = [], array $leagues = []): string
    {
        return json_encode(['errors' => [], 'response' => array_map(fn (int $id): array => [
            'fixture' => ['id' => $id, 'status' => in_array($id, $halftime, true)
                ? ['long' => 'Halftime', 'short' => 'HT', 'elapsed' => 45]
                : ['long' => 'Second Half', 'short' => '2H', 'elapsed' => 60]],
            'league' => ['id' => $leagues[$id] ?? 1, 'name' => 'Ligue de test', 'season' => 2026],
            'teams' => [
                'home' => ['id' => $id * 10 + 1, 'name' => "Home {$id}"],
                'away' => ['id' => $id * 10 + 2, 'name' => "Away {$id}"],
            ],
            'goals' => ['home' => 0, 'away' => 0],
        ], self::LIVE_FIXTURES)], JSON_THROW_ON_ERROR);
    }

    /**
     * @param  list<int>  $coveredLeagues
     */
    private function coverageBody(array $coveredLeagues): string
    {
        return json_encode(['response' => array_map(fn (int $leagueId): array => [
            'league' => ['id' => $leagueId],
            'seasons' => [['year' => 2026, 'current' => true, 'coverage' => ['fixtures' => ['statistics_fixtures' => in_array($leagueId, $coveredLeagues, true)]]]],
        ], [39, 140, 135, 78, 61, 2, 3])], JSON_THROW_ON_ERROR);
    }

    /**
     * Réponse bet 36 au format de la capture réelle (database/fixtures/api-football/odds-live-bet36.json).
     *
     * @param  array<int, string>  $under25  Cote Under 2.5 par match.
     */
    private function overUnderBody(array $under25): string
    {
        return json_encode(['errors' => [], 'response' => array_map(fn (int $id): array => [
            'fixture' => ['id' => $id, 'status' => ['long' => 'Halftime', 'elapsed' => 45]],
            'status' => ['stopped' => true, 'blocked' => false, 'finished' => false],
            'odds' => [[
                'id' => 36,
                'name' => 'Over/Under Line',
                'values' => [
                    ['value' => 'Over', 'odd' => '2.9', 'handicap' => '2.5', 'main' => true, 'suspended' => false],
                    ['value' => 'Under', 'odd' => $under25[$id], 'handicap' => '2.5', 'main' => true, 'suspended' => false],
                ],
            ]],
        ], array_keys($under25))], JSON_THROW_ON_ERROR);
    }

    private function snapshot(string $providerMatchId, array $odds, CarbonImmutable $capturedAt): void
    {
        TrackedMatch::query()->where('provider_match_id', $providerMatchId)->firstOrFail()->snapshots()->create([
            'minute' => 50,
            'home_score' => 0,
            'away_score' => 0,
            'exact_score_odds' => $odds,
            'statistics' => [],
            'odds_captured_at' => $capturedAt,
            'captured_at' => $capturedAt,
        ]);
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
    private function oddsBody(array $stoppedOdds, array $withoutOdds = []): string
    {
        return json_encode(['errors' => [], 'response' => array_map(fn (int $id): array => [
            'fixture' => ['id' => $id, 'status' => ['long' => 'Second Half', 'elapsed' => 60]],
            'status' => ['stopped' => in_array($id, $stoppedOdds, true), 'blocked' => false, 'finished' => false],
            'teams' => ['home' => ['goals' => 0], 'away' => ['goals' => 0]],
            'odds' => [[
                'id' => 23,
                'name' => 'Final Score',
                'values' => in_array($id, $withoutOdds, true) ? [] : [
                    ['value' => '0-0', 'odd' => '7.50', 'suspended' => false],
                    ['value' => '1-0', 'odd' => '8.60', 'suspended' => false],
                    ['value' => '0-1', 'odd' => '9.80', 'suspended' => false],
                ],
            ]],
        ], self::LIVE_FIXTURES)], JSON_THROW_ON_ERROR);
    }
}
