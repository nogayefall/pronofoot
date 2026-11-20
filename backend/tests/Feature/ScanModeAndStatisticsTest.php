<?php

namespace Tests\Feature;

use App\Models\Alert;
use App\Models\OpportunityLog;
use App\Models\RuleProfile;
use App\Models\Setting;
use App\Models\SettingChange;
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
 * Suivi sans statistiques et mode de scan (automatique, manuel, pause).
 */
class ScanModeAndStatisticsTest extends TestCase
{
    use RefreshDatabase;

    /** @var list<int> */
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
        RuleProfile::query()->create([
            'name' => 'Profil',
            'is_active' => true,
            'settings' => ['active_rules' => RuleConfiguration::DEFINED_RULES],
        ]);
        $this->fakeApi();
    }

    protected function tearDown(): void
    {
        CarbonImmutable::setTestNow();
        parent::tearDown();
    }

    public function test_a_match_without_statistics_is_analysed_on_its_odds_without_any_statistics_call(): void
    {
        $match = $this->track(701, ['statistics_available' => false, 'home_team' => 'Grimsby', 'away_team' => 'Cheltenham']);
        $before = CarbonImmutable::now()->subMinutes(3);
        $match->snapshots()->create([
            'minute' => 65, 'home_score' => 1, 'away_score' => 1,
            'exact_score_odds' => ['1-1' => 3.19, '2-1' => 3.10, '1-2' => 10.00],
            'statistics' => [], 'odds_captured_at' => $before, 'captured_at' => $before,
        ]);
        $this->live = [701];

        $result = $this->scan();

        $this->assertSame(1, $result->alertsCreated, 'Écart −0.09 : alerte critique, sans filtre vitalité.');
        $this->assertFalse($this->sent('/fixtures/statistics'), 'Aucun appel de statistiques pour ce match.');
        $this->assertNull($match->snapshots()->latest('id')->firstOrFail()->vitality_score);

        $decision = OpportunityLog::query()->where('decision', 'alert')->sole();
        $this->assertStringContainsString('Vitalité non disponible (statistiques non couvertes)', $decision->reason);
        $message = Alert::query()->sole()->message;
        $this->assertStringContainsString('Vitalité : non disponible (statistiques non couvertes)', $message);
        $this->assertStringContainsString('Option 1 (ciblée) : prochain but Grimsby — score 2-1, cote 3.10, écart -0.09', $message);
        $this->assertStringContainsString('Option 2 (neutre) : un but de plus dans le match — Over 2.5, cote non disponible', $message);
        $this->assertStringContainsString('Aucune option n’est jouée automatiquement.', $message);
    }

    public function test_manual_mode_only_scans_the_matches_added_by_hand(): void
    {
        Setting::query()->where('key', 'scan.auto_mode')->update(['value' => '0']);
        $this->track(702, ['tracking_mode' => 'manual']);
        $this->track(703, ['tracking_mode' => 'auto']);
        $this->live = [702, 703];

        $this->scan();

        $this->assertSame(['702'], $this->statisticsRequests(), 'Mode manuel : le match suivi automatiquement n’est pas scanné.');
        $this->assertSame(0, TrackedMatch::query()->where('provider_match_id', '703')->sole()->snapshots()->count());
        $this->assertFalse($this->sent('/leagues'), 'Pas de suivi automatique.');
    }

    public function test_pause_stops_every_api_call_and_resuming_applies_at_the_next_pass(): void
    {
        $this->track(704);
        $this->live = [704];
        Setting::query()->where('key', 'scan.paused')->update(['value' => '1']);

        $paused = $this->scan();
        $this->assertTrue($paused->paused);
        Http::assertNothingSent();

        Setting::query()->where('key', 'scan.paused')->update(['value' => '0']);
        $resumed = $this->scan();
        $this->assertFalse($resumed->paused);
        $this->assertTrue($this->sent('/fixtures'), 'Reprise prise en compte au tour suivant, sans redémarrage.');
    }

    public function test_switching_the_scan_mode_applies_at_the_next_pass_and_is_logged(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $this->track(705, ['tracking_mode' => 'auto']);
        $this->live = [705];
        $this->scan();
        $this->assertSame(1, TrackedMatch::query()->where('provider_match_id', '705')->sole()->snapshots()->count(), 'Mode automatique : scanné.');

        $this->actingAs($admin)->patchJson(route('admin.api.settings.update'), ['settings' => ['scan.auto_mode' => false]])->assertOk();
        $this->scan();

        $this->assertSame(1, TrackedMatch::query()->where('provider_match_id', '705')->sole()->snapshots()->count(), 'Mode manuel au tour suivant : plus scanné.');
        $change = SettingChange::query()->where('setting_key', 'scan.auto_mode')->sole();
        $this->assertSame($admin->id, $change->user_id);
        $this->assertSame(['1', '0'], [$change->old_value, $change->new_value]);
        $this->actingAs($admin)->getJson(route('admin.api.dashboard'))->assertJsonPath('scanMode', ['mode' => 'manual', 'paused' => false]);
    }

    private function scan(): ScanPassResult
    {
        app()->forgetInstance(ScanService::class);

        return app(ScanService::class)->runOnce(forceRefresh: true);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function track(int $fixtureId, array $attributes = []): TrackedMatch
    {
        return TrackedMatch::query()->create([
            'provider' => 'real',
            'provider_match_id' => (string) $fixtureId,
            'home_team' => "Home {$fixtureId}",
            'away_team' => "Away {$fixtureId}",
            'is_active' => true,
            ...$attributes,
        ]);
    }

    private function sent(string $path): bool
    {
        return Http::recorded()->contains(fn (array $pair): bool => str_contains($pair[0]->url(), $path));
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

    private function fakeApi(): void
    {
        $headers = ['x-ratelimit-requests-remaining' => '5000', 'x-ratelimit-requests-limit' => '7500'];

        Http::fake(function (Request $request) use ($headers) {
            $url = $request->url();
            if (str_contains($url, '/fixtures/statistics')) {
                $payload = json_decode((string) file_get_contents(database_path('fixtures/api-football/fixtures-statistics-covered.json')), true, flags: JSON_THROW_ON_ERROR);
                $fixtureId = (int) $request->data()['fixture'];
                $payload['response'][0]['team']['id'] = $fixtureId * 10 + 1;
                $payload['response'][1]['team']['id'] = $fixtureId * 10 + 2;

                return Http::response(json_encode($payload, JSON_THROW_ON_ERROR), 200, $headers);
            }

            if (str_contains($url, '/fixtures')) {
                return Http::response(json_encode(['errors' => [], 'response' => array_map(fn (int $id): array => [
                    'fixture' => ['id' => $id, 'date' => '2026-11-21T19:00:00+00:00', 'status' => ['short' => '2H', 'long' => 'Second Half', 'elapsed' => 67]],
                    'league' => ['id' => 1, 'name' => 'Ligue de test', 'season' => 2026],
                    'teams' => ['home' => ['id' => $id * 10 + 1, 'name' => "Home {$id}"], 'away' => ['id' => $id * 10 + 2, 'name' => "Away {$id}"]],
                    'goals' => ['home' => 1, 'away' => 1],
                ], $this->live)], JSON_THROW_ON_ERROR), 200, $headers);
            }

            if (str_contains($url, '/leagues')) {
                return Http::response(json_encode(['response' => []], JSON_THROW_ON_ERROR), 200, $headers);
            }

            if (str_contains($url, '/odds/live')) {
                return Http::response(json_encode(['errors' => [], 'response' => array_map(fn (int $id): array => [
                    'fixture' => ['id' => $id, 'status' => ['long' => 'Second Half', 'elapsed' => 67]],
                    'status' => ['stopped' => false, 'blocked' => false, 'finished' => false],
                    'teams' => ['home' => ['goals' => 1], 'away' => ['goals' => 1]],
                    'odds' => [['id' => 23, 'name' => 'Final Score', 'values' => [
                        ['value' => '1-1', 'odd' => '3.19', 'suspended' => false],
                        ['value' => '2-1', 'odd' => '3.10', 'suspended' => false],
                        ['value' => '1-2', 'odd' => '10.00', 'suspended' => false],
                    ]]],
                ], $this->live)], JSON_THROW_ON_ERROR), 200, $headers);
            }

            return Http::response('', 404);
        });
    }
}
