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
 * Scan réel : la tendance est calculée pour le prochain but de chaque équipe, à partir des cotes d’il y a 2 minutes.
 */
class TwoSidedScanTest extends TestCase
{
    use RefreshDatabase;

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
        CarbonImmutable::setTestNow('2026-11-20 20:00:00');
        RuleProfile::query()->create([
            'name' => 'Deux équipes',
            'is_active' => true,
            'settings' => ['active_rules' => RuleConfiguration::DEFINED_RULES],
        ]);
    }

    protected function tearDown(): void
    {
        CarbonImmutable::setTestNow();
        parent::tearDown();
    }

    public function test_the_away_team_falling_odds_alert_although_the_home_team_has_the_smaller_gap(): void
    {
        $match = TrackedMatch::query()->create([
            'provider' => 'real',
            'provider_match_id' => '601',
            'home_team' => 'Rennes',
            'away_team' => 'Racing',
            'is_active' => true,
        ]);
        $twoMinutesAgo = CarbonImmutable::now()->subMinutes(3);
        $match->snapshots()->create([
            'minute' => 57,
            'home_score' => 2,
            'away_score' => 0,
            'exact_score_odds' => ['2-0' => 3.00, '3-0' => 4.00, '2-1' => 5.00],
            'statistics' => [],
            'odds_captured_at' => $twoMinutesAgo,
            'captured_at' => $twoMinutesAgo,
        ]);
        $this->fakeApi(['2-0' => '3.00', '3-0' => '4.10', '2-1' => '4.50']);

        $result = app(ScanService::class)->runOnce();

        $this->assertSame(1, $result->alertsCreated);
        $decision = OpportunityLog::query()->where('decision', 'alert')->sole();
        $this->assertSame('away', $decision->selection);
        $this->assertSame('F162-Bis', $decision->rule_id);
        $this->assertStringContainsString('Domicile (3-0) : cote 4.10, écart +1.10, tendance +2.5 % → abstention (la cote monte)', $decision->reason);
        $this->assertStringContainsString('Extérieur (2-1) : cote 4.50, écart +1.50, tendance −10 % → alerte Critique', $decision->reason);
        $this->assertEqualsWithDelta(-10.0, (float) $decision->matchSnapshot->odds_change_percent, 0.001, 'Baisse la plus forte des deux équipes, pour le classement chaud.');

        $message = Alert::query()->sole()->message;
        $this->assertStringContainsString('Prochain but : Racing', $message);
        $this->assertStringContainsString('Cote suggérée (2-1) : 4.50', $message);
        $this->assertStringContainsString('Tendance : -10.0 %', $message);
    }

    /**
     * @param  array<string, string>  $odds
     */
    private function fakeApi(array $odds): void
    {
        $headers = ['x-ratelimit-requests-remaining' => '5000', 'x-ratelimit-requests-limit' => '7500'];

        Http::fake(function (Request $request) use ($odds, $headers) {
            $url = $request->url();
            if (str_contains($url, '/fixtures/statistics')) {
                $payload = json_decode((string) file_get_contents(database_path('fixtures/api-football/fixtures-statistics-covered.json')), true, flags: JSON_THROW_ON_ERROR);
                $payload['response'][0]['team']['id'] = 6011;
                $payload['response'][1]['team']['id'] = 6012;

                return Http::response(json_encode($payload, JSON_THROW_ON_ERROR), 200, $headers);
            }

            if (str_contains($url, '/fixtures')) {
                return Http::response(json_encode(['errors' => [], 'response' => [[
                    'fixture' => ['id' => 601, 'date' => '2026-11-20T19:00:00+00:00', 'status' => ['short' => '2H', 'long' => 'Second Half', 'elapsed' => 59]],
                    'league' => ['id' => 61, 'name' => 'Ligue 1', 'season' => 2026],
                    'teams' => ['home' => ['id' => 6011, 'name' => 'Rennes'], 'away' => ['id' => 6012, 'name' => 'Racing']],
                    'goals' => ['home' => 2, 'away' => 0],
                ]]], JSON_THROW_ON_ERROR), 200, $headers);
            }

            if (str_contains($url, '/leagues')) {
                return Http::response(json_encode(['response' => []], JSON_THROW_ON_ERROR), 200, $headers);
            }

            if (str_contains($url, '/odds/live')) {
                return Http::response(json_encode(['errors' => [], 'response' => [[
                    'fixture' => ['id' => 601, 'status' => ['long' => 'Second Half', 'elapsed' => 59]],
                    'status' => ['stopped' => false, 'blocked' => false, 'finished' => false],
                    'teams' => ['home' => ['goals' => 2], 'away' => ['goals' => 0]],
                    'odds' => [['id' => 23, 'name' => 'Final Score', 'values' => array_map(
                        fn (string $score, string $price): array => ['value' => $score, 'odd' => $price, 'suspended' => false],
                        array_keys($odds),
                        $odds,
                    )]],
                ]]], JSON_THROW_ON_ERROR), 200, $headers);
            }

            return Http::response('', 404);
        });
    }
}
