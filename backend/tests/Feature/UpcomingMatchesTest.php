<?php

namespace Tests\Feature;

use App\Models\OpportunityLog;
use App\Models\RuleProfile;
use App\Models\Setting;
use App\Models\TrackedMatch;
use App\Models\User;
use App\Rules\RuleConfiguration;
use App\Services\ScanPassResult;
use App\Services\ScanService;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

/**
 * « Matchs à venir aujourd’hui » et suivi planifié : une requête par date en cache 15 minutes, aucun appel avant le
 * coup d’envoi, activation automatique quand le match passe en direct.
 */
class UpcomingMatchesTest extends TestCase
{
    use RefreshDatabase;

    /** @var list<int> Matchs présents dans le flux en direct. */
    private array $live = [];

    protected function setUp(): void
    {
        parent::setUp();
        config([
            'services.pronofoot.football_driver' => 'real',
            'services.pronofoot.odds_driver' => 'api_football',
            'services.football_api.base_url' => 'https://api.example.test',
            'services.football_api.api_key' => 'test-api-key',
        ]);
        Queue::fake();
        Http::preventStrayRequests();
        CarbonImmutable::setTestNow('2026-11-21 20:00:00');
        Setting::query()->where('key', 'scan.auto_mode')->update(['value' => '0']);
        RuleProfile::query()->create(['name' => 'Profil', 'is_active' => true, 'settings' => ['active_rules' => RuleConfiguration::DEFINED_RULES]]);
        $this->actingAs(User::factory()->create(['is_admin' => true]));
        $this->fakeApi();
    }

    protected function tearDown(): void
    {
        CarbonImmutable::setTestNow();
        parent::tearDown();
    }

    public function test_upcoming_matches_come_from_one_request_per_date_cached_fifteen_minutes(): void
    {
        $this->getJson(route('admin.api.matches.upcoming'))
            ->assertOk()
            ->assertJsonCount(2, 'matches')
            ->assertJsonPath('matches.0.providerMatchId', '901')
            ->assertJsonPath('matches.0.leagueId', 39)
            ->assertJsonPath('matches.0.kickoffAt', '2026-11-21T21:00:00+00:00')
            ->assertJsonPath('matches.1.providerMatchId', '902')
            ->assertJsonPath('matches.1.competition', 'Premier League · Armenia');
        $this->getJson(route('admin.api.matches.upcoming'))->assertOk();
        $this->assertSame(1, $this->dateRequests(), 'Deuxième ouverture de la page : pas de nouvelle requête.');
        Http::assertSent(fn (Request $request): bool => ($request->data()['date'] ?? null) === '2026-11-21');

        CarbonImmutable::setTestNow('2026-11-21 20:15:01');
        $this->getJson(route('admin.api.matches.upcoming'))->assertOk();
        $this->assertSame(2, $this->dateRequests(), 'Après 15 minutes : nouvelle requête.');
    }

    public function test_a_scheduled_match_costs_no_call_before_kickoff_and_starts_when_live(): void
    {
        $this->getJson(route('admin.api.matches.upcoming'))->assertOk();
        $calls = count(Http::recorded());

        $this->postJson(route('admin.api.matches.schedule'), ['provider_match_id' => '901'])
            ->assertCreated()
            ->assertJsonPath('message', 'Suivi planifié : il démarrera dès le coup d’envoi.');
        $match = TrackedMatch::query()->where('provider_match_id', '901')->sole();
        $this->assertSame('scheduled', $match->tracking_mode);
        $this->assertFalse($match->is_active);
        $this->assertSame(count(Http::recorded()), $calls, 'Planifier ne fait aucun appel (liste en cache).');
        $this->getJson(route('admin.api.matches.upcoming'))->assertJsonPath('matches.0.scheduled', true);

        $before = $this->scan();
        $this->assertSame(count(Http::recorded()), $calls, 'Avant le coup d’envoi : aucun appel API.');
        $this->assertSame(0, $before->scheduledActivated);

        CarbonImmutable::setTestNow('2026-11-21 21:01:00');
        $this->live = [901];
        $kickoff = $this->scan();
        $match->refresh();
        $this->assertSame(1, $kickoff->scheduledActivated);
        $this->assertTrue($match->is_active);
        $this->assertSame('manual', $match->tracking_mode);
        $this->assertSame(1, OpportunityLog::query()->where('event_type', 'scheduled_started')->count());
        $this->assertFalse($this->sent('/fixtures/statistics'), 'Pas de statistiques ni de cotes au tour d’activation.');
        $this->assertFalse($this->sent('/odds/live'));

        CarbonImmutable::setTestNow('2026-11-21 21:01:30');
        $this->scan();
        $this->assertTrue($this->sent('/fixtures/statistics'), 'Tour suivant : le match est scanné normalement.');
        $this->assertSame(1, $match->snapshots()->count());
    }

    public function test_a_late_kickoff_keeps_waiting_and_a_cancelled_schedule_is_never_activated(): void
    {
        $this->getJson(route('admin.api.matches.upcoming'))->assertOk();
        $this->postJson(route('admin.api.matches.schedule'), ['provider_match_id' => '901'])->assertCreated();
        $this->postJson(route('admin.api.matches.schedule'), ['provider_match_id' => '902'])->assertCreated();
        $cancelled = TrackedMatch::query()->where('provider_match_id', '902')->sole();
        $this->deleteJson(route('admin.api.matches.destroy', $cancelled))->assertOk();

        CarbonImmutable::setTestNow('2026-11-21 21:05:00');
        $late = $this->scan();
        $this->assertFalse($late->idle, 'Coup d’envoi passé mais match pas encore en direct : on attend, sans veille.');
        $this->assertSame(30, $late->nextPollIntervalSeconds);
        $this->assertFalse(TrackedMatch::query()->where('provider_match_id', '901')->sole()->is_active);

        CarbonImmutable::setTestNow('2026-11-21 22:30:00');
        $this->live = [901, 902];
        $this->scan();
        $this->assertTrue(TrackedMatch::query()->where('provider_match_id', '901')->sole()->is_active);
        $this->assertFalse($cancelled->fresh()->is_active, 'Planification annulée : jamais activé.');
    }

    private function scan(): ScanPassResult
    {
        app()->forgetInstance(ScanService::class);

        return app(ScanService::class)->runOnce(forceRefresh: true);
    }

    private function dateRequests(): int
    {
        return Http::recorded()->filter(fn (array $pair): bool => isset($pair[0]->data()['date']))->count();
    }

    private function sent(string $path): bool
    {
        return Http::recorded()->contains(fn (array $pair): bool => str_contains($pair[0]->url(), $path));
    }

    private function fakeApi(): void
    {
        $headers = ['x-ratelimit-requests-remaining' => '5000', 'x-ratelimit-requests-limit' => '7500'];
        $fixture = fn (int $id, string $short, string $long, ?int $elapsed, string $date, int $league, string $competition): array => [
            'fixture' => ['id' => $id, 'date' => $date, 'status' => ['short' => $short, 'long' => $long, 'elapsed' => $elapsed]],
            'league' => ['id' => $league, 'name' => explode(' · ', $competition)[0], 'country' => explode(' · ', $competition)[1], 'season' => 2026],
            'teams' => ['home' => ['id' => $id * 10 + 1, 'name' => "Home {$id}"], 'away' => ['id' => $id * 10 + 2, 'name' => "Away {$id}"]],
            'goals' => ['home' => $elapsed === null ? null : 0, 'away' => $elapsed === null ? null : 0],
        ];

        Http::fake(function (Request $request) use ($headers, $fixture) {
            $url = $request->url();
            if (str_contains($url, '/fixtures/statistics')) {
                $payload = json_decode((string) file_get_contents(database_path('fixtures/api-football/fixtures-statistics-covered.json')), true, flags: JSON_THROW_ON_ERROR);
                $payload['response'][0]['team']['id'] = 9011;
                $payload['response'][1]['team']['id'] = 9012;

                return Http::response(json_encode($payload, JSON_THROW_ON_ERROR), 200, $headers);
            }

            if (str_contains($url, '/fixtures') && isset($request->data()['date'])) {
                return Http::response(json_encode(['errors' => [], 'response' => [
                    $fixture(902, 'NS', 'Not Started', null, '2026-11-21T22:00:00+00:00', 342, 'Premier League · Armenia'),
                    $fixture(901, 'NS', 'Not Started', null, '2026-11-21T21:00:00+00:00', 39, 'Premier League · England'),
                    $fixture(903, 'FT', 'Match Finished', 90, '2026-11-21T15:00:00+00:00', 39, 'Premier League · England'),
                ]], JSON_THROW_ON_ERROR), 200, $headers);
            }

            if (str_contains($url, '/fixtures')) {
                return Http::response(json_encode(['errors' => [], 'response' => array_map(
                    fn (int $id): array => $fixture($id, '1H', 'First Half', 2, '2026-11-21T21:00:00+00:00', 39, 'Premier League · England'),
                    $this->live,
                )], JSON_THROW_ON_ERROR), 200, $headers);
            }

            if (str_contains($url, '/odds/live')) {
                return Http::response(json_encode(['errors' => [], 'response' => array_map(fn (int $id): array => [
                    'fixture' => ['id' => $id, 'status' => ['long' => 'First Half', 'elapsed' => 2]],
                    'status' => ['stopped' => false, 'blocked' => false, 'finished' => false],
                    'teams' => ['home' => ['goals' => 0], 'away' => ['goals' => 0]],
                    'odds' => [['id' => 23, 'name' => 'Final Score', 'values' => [
                        ['value' => '0-0', 'odd' => '7.50', 'suspended' => false],
                        ['value' => '1-0', 'odd' => '8.60', 'suspended' => false],
                        ['value' => '0-1', 'odd' => '9.80', 'suspended' => false],
                    ]]],
                ], $this->live)], JSON_THROW_ON_ERROR), 200, $headers);
            }

            return Http::response('', 404);
        });
    }
}
