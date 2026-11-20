<?php

namespace Tests\Feature;

use App\Models\Alert;
use App\Models\OpportunityLog;
use App\Models\RuleProfile;
use App\Models\TrackedMatch;
use App\Rules\RuleConfiguration;
use App\Services\ScanService;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

/**
 * Cote de l’option neutre : marché Over/Under (pari 36) demandé une seule fois à la création d’une alerte, jamais à
 * chaque relevé.
 */
class NeutralOptionOddsTest extends TestCase
{
    use RefreshDatabase;

    /** @var array<string, string> */
    private array $exactScoreOdds = ['1-1' => '3.19', '2-1' => '3.10', '1-2' => '10.00'];

    /** @var array<int, string> Cote Over 2.5 par match dans le pari 36 (vide : marché indisponible). */
    private array $over25 = [];

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
        RuleProfile::query()->create(['name' => 'Profil', 'is_active' => true, 'settings' => ['active_rules' => RuleConfiguration::DEFINED_RULES]]);
        $this->fakeApi();
    }

    protected function tearDown(): void
    {
        CarbonImmutable::setTestNow();
        parent::tearDown();
    }

    public function test_one_over_under_call_per_alert_and_none_at_the_following_readings(): void
    {
        $this->track(801);
        $this->over25 = [801 => '1.95'];

        $this->scan();
        $this->assertSame(1, Alert::query()->count());
        $this->assertSame(1, $this->overUnderCalls(), 'Un seul appel du pari 36, à la création de l’alerte.');
        $this->assertStringContainsString('Option 2 (neutre) : un but de plus dans le match — Over 2.5, cote 1.95', Alert::query()->sole()->message);
        $this->assertStringContainsString('Over 2.5, cote 1.95', OpportunityLog::query()->where('decision', 'alert')->sole()->reason);

        $requestsPerPass = [];
        foreach ([30, 90, 150] as $seconds) {
            CarbonImmutable::setTestNow(CarbonImmutable::parse('2026-11-21 20:00:00')->addSeconds($seconds));
            $before = count(Http::recorded());
            $this->scan();
            $requestsPerPass[] = count(Http::recorded()) - $before;
        }

        $this->assertSame(1, $this->overUnderCalls(), 'Alerte déjà active (doublon évité) : aucun nouvel appel.');
        $this->assertCount(1, array_unique($requestsPerPass), 'Le nombre de requêtes par tour n’augmente pas.');
    }

    public function test_no_over_under_call_without_alert(): void
    {
        $this->exactScoreOdds = ['1-1' => '3.19', '2-1' => '9.00', '1-2' => '10.00'];
        $this->track(801);
        $this->over25 = [801 => '1.95'];

        foreach ([0, 30, 60] as $seconds) {
            CarbonImmutable::setTestNow(CarbonImmutable::parse('2026-11-21 20:00:00')->addSeconds($seconds));
            $this->scan();
        }

        $this->assertSame(0, Alert::query()->count());
        $this->assertSame(0, $this->overUnderCalls());
    }

    public function test_alerts_created_within_sixty_seconds_share_one_call_and_an_unavailable_market_keeps_no_odds(): void
    {
        $this->track(801);
        $this->track(802);
        $this->over25 = [801 => '1.95'];

        $this->scan();

        $this->assertSame(2, Alert::query()->count());
        $this->assertSame(1, $this->overUnderCalls(), 'Deux alertes au même tour : une seule requête (cache de 60 s).');
        $messages = Alert::query()->orderBy('id')->pluck('message')->all();
        $this->assertStringContainsString('Over 2.5, cote 1.95', $messages[0]);
        $this->assertStringContainsString('Over 2.5, cote non disponible', $messages[1], 'Pas de ligne Over 2.5 pour ce match.');
    }

    private function scan(): void
    {
        app()->forgetInstance(ScanService::class);
        app(ScanService::class)->runOnce(forceRefresh: true);
    }

    private function track(int $fixtureId): TrackedMatch
    {
        $match = TrackedMatch::query()->create([
            'provider' => 'real',
            'provider_match_id' => (string) $fixtureId,
            'home_team' => "Home {$fixtureId}",
            'away_team' => "Away {$fixtureId}",
            'is_active' => true,
        ]);
        $before = CarbonImmutable::now()->subMinutes(3);
        $match->snapshots()->create([
            'minute' => 60, 'home_score' => 1, 'away_score' => 1,
            'exact_score_odds' => array_map('floatval', $this->exactScoreOdds),
            'statistics' => [], 'odds_captured_at' => $before, 'captured_at' => $before,
        ]);

        return $match;
    }

    private function overUnderCalls(): int
    {
        return Http::recorded()->filter(fn (array $pair): bool => str_contains($pair[0]->url(), '/odds/live')
            && (string) ($pair[0]->data()['bet'] ?? '') === '36')->count();
    }

    private function fakeApi(): void
    {
        $headers = ['x-ratelimit-requests-remaining' => '5000', 'x-ratelimit-requests-limit' => '7500'];

        Http::fake(function (Request $request) use ($headers) {
            $url = $request->url();
            $ids = TrackedMatch::query()->pluck('provider_match_id')->map(fn ($id): int => (int) $id)->all();
            if (str_contains($url, '/fixtures/statistics')) {
                $payload = json_decode((string) file_get_contents(database_path('fixtures/api-football/fixtures-statistics-covered.json')), true, flags: JSON_THROW_ON_ERROR);
                $fixtureId = (int) $request->data()['fixture'];
                $payload['response'][0]['team']['id'] = $fixtureId * 10 + 1;
                $payload['response'][1]['team']['id'] = $fixtureId * 10 + 2;

                return Http::response(json_encode($payload, JSON_THROW_ON_ERROR), 200, $headers);
            }

            if (str_contains($url, '/fixtures')) {
                return Http::response(json_encode(['errors' => [], 'response' => array_map(fn (int $id): array => [
                    'fixture' => ['id' => $id, 'date' => '2026-11-21T19:00:00+00:00', 'status' => ['short' => '2H', 'long' => 'Second Half', 'elapsed' => 62]],
                    'league' => ['id' => 1, 'name' => 'Ligue de test', 'season' => 2026],
                    'teams' => ['home' => ['id' => $id * 10 + 1, 'name' => "Home {$id}"], 'away' => ['id' => $id * 10 + 2, 'name' => "Away {$id}"]],
                    'goals' => ['home' => 1, 'away' => 1],
                ], $ids)], JSON_THROW_ON_ERROR), 200, $headers);
            }

            if (str_contains($url, '/odds/live') && (string) ($request->data()['bet'] ?? '') === '36') {
                return Http::response(json_encode(['errors' => [], 'response' => array_map(fn (int $id): array => [
                    'fixture' => ['id' => $id, 'status' => ['long' => 'Second Half', 'elapsed' => 62]],
                    'status' => ['stopped' => false, 'blocked' => false, 'finished' => false],
                    'odds' => [['id' => 36, 'name' => 'Over/Under Line', 'values' => [
                        ['value' => 'Over', 'odd' => $this->over25[$id], 'handicap' => '2.5', 'main' => true, 'suspended' => false],
                        ['value' => 'Under', 'odd' => '1.80', 'handicap' => '2.5', 'main' => true, 'suspended' => false],
                    ]]],
                ], array_keys($this->over25))], JSON_THROW_ON_ERROR), 200, $headers);
            }

            if (str_contains($url, '/odds/live')) {
                return Http::response(json_encode(['errors' => [], 'response' => array_map(fn (int $id): array => [
                    'fixture' => ['id' => $id, 'status' => ['long' => 'Second Half', 'elapsed' => 62]],
                    'status' => ['stopped' => false, 'blocked' => false, 'finished' => false],
                    'teams' => ['home' => ['goals' => 1], 'away' => ['goals' => 1]],
                    'odds' => [['id' => 23, 'name' => 'Final Score', 'values' => array_map(
                        fn (string $score, string $price): array => ['value' => $score, 'odd' => $price, 'suspended' => false],
                        array_keys($this->exactScoreOdds),
                        $this->exactScoreOdds,
                    )]],
                ], $ids)], JSON_THROW_ON_ERROR), 200, $headers);
            }

            return Http::response('', 404);
        });
    }
}
