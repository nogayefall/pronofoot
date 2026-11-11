<?php

namespace Tests\Unit;

use App\Providers\Contracts\FootballProvider;
use App\Providers\Contracts\OddsProvider;
use App\Providers\Data\ProviderUnavailable;
use App\Providers\Real\ApiFootballMapper;
use App\Providers\Real\ApiFootballOddsProvider;
use App\Providers\Real\ApiFootballProvider;
use App\Providers\Real\TheOddsApiProvider;
use App\Rules\RuleConfiguration;
use App\Rules\RuleEngine;
use App\Rules\RuleInput;
use App\Services\ApiFootballResponseCapture;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ProviderPilotsTest extends TestCase
{
    private ?string $captureDirectory = null;

    protected function setUp(): void
    {
        parent::setUp();

        config()->set('services.pronofoot.odds_driver', 'fake');
        config()->set('services.pronofoot.football_driver', 'fake');
    }

    protected function tearDown(): void
    {
        if ($this->captureDirectory !== null && File::isDirectory($this->captureDirectory)) {
            File::deleteDirectory($this->captureDirectory);
        }

        parent::tearDown();
    }

    public function test_fake_providers_load_deterministic_live_match_scenarios(): void
    {
        config()->set('services.pronofoot.odds_driver', 'fake');
        config()->set('services.pronofoot.football_driver', 'fake');
        config()->set('services.pronofoot.fake_scenario', 'baseline');

        $football = app(FootballProvider::class)->getLiveMatches();
        $odds = app(OddsProvider::class)->getLiveOdds();

        $this->assertTrue($football->reachable);
        $this->assertTrue($football->statisticsAvailable);
        $this->assertTrue($odds->reachable);
        $this->assertTrue($odds->exactScoreMarketAvailable);
        $this->assertTrue($odds->overUnderMarketAvailable);
        $this->assertCount(7, $football->matches);
        $this->assertSame(
            ['candidate-alert', 'gap-filter-refusal', 'vitality-filter-refusal', 'trend-data-missing', 'goal-during-scan', 'statistics-missing', 'upcoming-match'],
            array_map(fn ($match): ?string => $match->scenario, $football->matches),
        );
        $this->assertCount(7, array_unique(array_map(fn ($match): string => $match->homeTeam, $football->matches)));
        $this->assertCount(7, array_unique(array_map(fn ($match): string => $match->awayTeam, $football->matches)));
        $this->assertCount(7, array_unique(array_map(fn ($match): ?string => $match->competition, $football->matches)));
        $this->assertCount(7, array_unique(array_map(fn ($match): ?string => $match->kickoffAt, $football->matches)));
        $this->assertSame(
            'Simulation — Scénario but marqué',
            collect($football->matches)->firstWhere('scenario', 'goal-during-scan')->competition,
        );
        $this->assertSame(
            'Simulation — Scénario statistiques manquantes',
            collect($football->matches)->firstWhere('scenario', 'statistics-missing')->competition,
        );
        $this->assertNotNull($football->rawResponse);
        $this->assertSame('cote_suggeree', $football->simulationSettings['tendance_source']);
        $this->assertSame(3, $football->simulationSettings['tendance_seuil_stable']);
        $this->assertSame(0, $football->requestsUsed);
        $this->assertSame(0, $odds->requestsUsed);
    }

    public function test_fake_candidate_scenario_can_trigger_the_engine_under_an_explicit_test_profile(): void
    {
        config()->set('services.pronofoot.fake_scenario', 'baseline');

        $footballMatch = collect(app(FootballProvider::class)->getLiveMatches()->matches)
            ->firstWhere('scenario', 'candidate-alert');
        $oddsMatch = collect(app(OddsProvider::class)->getLiveOdds()->matches)
            ->firstWhere('providerMatchId', $footballMatch->providerMatchId);

        $result = (new RuleEngine)->evaluate(
            new RuleInput(
                homeScore: $footballMatch->homeScore,
                awayScore: $footballMatch->awayScore,
                exactScoreOdds: $oddsMatch->exactScoreOdds,
                vitalityScore: $footballMatch->vitalityScore,
                oddsChangePercent: -1.0,
                methodScores: ['F121-C' => 82],
            ),
            new RuleConfiguration(
                activeRules: ['F121-C'],
                trendSource: 'cote_suggeree',
                stableOddsChangePercent: 3.0,
                methodWeights: ['F121-C' => 1.0],
            ),
        );

        $this->assertTrue($result->filters['gap']->passed);
        $this->assertTrue($result->filters['trend']->passed);
        $this->assertTrue($result->filters['vitality']->passed);
        $this->assertTrue($result->shouldAlert);
    }

    public function test_fake_filter_scenarios_do_not_alert_when_any_filter_refuses(): void
    {
        config()->set('services.pronofoot.fake_scenario', 'baseline');
        $footballMatches = app(FootballProvider::class)->getLiveMatches()->matches;
        $oddsMatches = app(OddsProvider::class)->getLiveOdds()->matches;

        foreach ([
            'gap-filter-refusal' => 'gap',
            'vitality-filter-refusal' => 'vitality',
            'trend-data-missing' => 'trend',
        ] as $scenario => $refusedFilter) {
            $footballMatch = collect($footballMatches)->firstWhere('scenario', $scenario);
            $oddsMatch = collect($oddsMatches)->firstWhere('providerMatchId', $footballMatch->providerMatchId);
            $result = (new RuleEngine)->evaluate(
                new RuleInput(
                    homeScore: $footballMatch->homeScore,
                    awayScore: $footballMatch->awayScore,
                    exactScoreOdds: $oddsMatch->exactScoreOdds,
                    vitalityScore: $footballMatch->vitalityScore,
                    oddsChangePercent: $scenario === 'trend-data-missing' ? null : -1.0,
                    methodScores: ['F121-C' => 82],
                ),
                new RuleConfiguration(
                    activeRules: ['F121-C'],
                    trendSource: 'cote_suggeree',
                    stableOddsChangePercent: 3.0,
                    methodWeights: ['F121-C' => 1.0],
                ),
            );

            $this->assertFalse($result->filters[$refusedFilter]->passed, $scenario);
            $this->assertFalse($result->shouldAlert, $scenario);
        }
    }

    public function test_fake_goal_scenario_advances_deterministically_between_scan_numbers(): void
    {
        config()->set('services.pronofoot.fake_scenario', 'baseline');

        $footballProvider = app(FootballProvider::class);
        $oddsProvider = app(OddsProvider::class);

        $beforeGoal = collect($footballProvider->getLiveMatches(0)->matches)->firstWhere('providerMatchId', 'fake-goal-during-scan');
        $afterGoal = collect($footballProvider->getLiveMatches(1)->matches)->firstWhere('providerMatchId', 'fake-goal-during-scan');
        $afterGoalOdds = collect($oddsProvider->getLiveOdds(1)->matches)->firstWhere('providerMatchId', 'fake-goal-during-scan');

        $this->assertSame([0, 0], [$beforeGoal->homeScore, $beforeGoal->awayScore]);
        $this->assertSame([1, 0], [$afterGoal->homeScore, $afterGoal->awayScore]);
        $this->assertSame([1, 0], [$afterGoalOdds->homeScore, $afterGoalOdds->awayScore]);
    }

    public function test_fake_missing_statistics_scenario_is_not_filled_with_defaults(): void
    {
        config()->set('services.pronofoot.fake_scenario', 'baseline');

        $match = collect(app(FootballProvider::class)->getLiveMatches()->matches)
            ->firstWhere('scenario', 'statistics-missing');

        $this->assertSame([], $match->statistics);
        $this->assertNull($match->vitalityScore);
    }

    public function test_fake_provider_reports_a_scenario_failure_instead_of_falling_back(): void
    {
        config()->set('services.pronofoot.fake_scenario', 'api_outage');

        $this->expectException(ProviderUnavailable::class);
        app(FootballProvider::class)->getLiveMatches();
    }

    public function test_odds_real_pilot_explicitly_reports_exact_score_market_unavailable_without_a_request(): void
    {
        Http::preventStrayRequests();

        $feed = (new TheOddsApiProvider)->getLiveOdds();

        $this->assertNull($feed->reachable);
        $this->assertFalse($feed->exactScoreMarketAvailable);
        $this->assertStringContainsString('Marché des scores exacts non disponible', $feed->statusMessage);
        $this->assertSame([], $feed->matches);
    }

    public function test_api_football_mapper_does_not_assume_response_field_names(): void
    {
        $rawResponse = '{"unknown_documented_schema":{"value":"kept"}}';

        $feed = (new ApiFootballMapper)->map($rawResponse);

        $this->assertSame([], $feed->matches);
        $this->assertNull($feed->statisticsAvailable);
        $this->assertSame($rawResponse, $feed->rawResponse);
        $this->assertStringContainsString('liste response attendue', $feed->statusMessage);
    }

    public function test_api_football_mapper_maps_the_supplied_live_fixtures_without_defaulting_missing_values(): void
    {
        $liveResponse = file_get_contents(database_path('fixtures/api-football/fixtures-live.json'));
        $statisticsResponse = file_get_contents(database_path('fixtures/api-football/fixtures-statistics.json'));
        $this->assertNotFalse($liveResponse);
        $this->assertNotFalse($statisticsResponse);

        $feed = (new ApiFootballMapper)->mapFootball(
            rawResponse: $liveResponse,
            rawStatisticsResponse: $statisticsResponse,
            statisticsMatchId: '1635776',
            requestsUsed: 2,
            requestsRemaining: 83,
            requestsLimit: 100,
        );

        $this->assertTrue($feed->reachable);
        $this->assertFalse($feed->statisticsAvailable);
        $this->assertSame(27, count($feed->matches));
        $this->assertSame('1635776', $feed->statisticsMatchId);
        $this->assertSame($statisticsResponse, $feed->rawStatisticsResponse);
        $this->assertSame(2, $feed->requestsUsed);
        $this->assertSame(83, $feed->requestsRemaining);
        $this->assertSame(100, $feed->requestsLimit);

        $match = $feed->matches[0];
        $this->assertSame('1635776', $match->providerMatchId);
        $this->assertSame('First Half', $match->status);
        $this->assertSame(45, $match->minute);
        $this->assertSame('Estonia U19', $match->homeTeam);
        $this->assertSame('Liechtenstein U19', $match->awayTeam);
        $this->assertSame(4, $match->homeScore);
        $this->assertSame(1, $match->awayScore);
        $this->assertSame([
            'shots' => null,
            'shots_on_target' => null,
            'possession' => null,
            'corners' => null,
        ], $match->statistics);
    }

    public function test_api_football_mapper_keeps_missing_null_scores_and_minutes_unavailable(): void
    {
        $liveResponse = file_get_contents(database_path('fixtures/api-football/fixtures-live.json'));
        $this->assertNotFalse($liveResponse);
        $payload = json_decode($liveResponse, true, flags: JSON_THROW_ON_ERROR);
        $payload['response'][0]['fixture']['status']['elapsed'] = null;
        $payload['response'][0]['teams']['home']['name'] = null;
        $payload['response'][0]['goals']['home'] = null;
        $payload['response'][0]['goals']['away'] = null;

        $feed = (new ApiFootballMapper)->mapFootball(json_encode($payload, JSON_THROW_ON_ERROR));
        $match = $feed->matches[0];

        $this->assertNull($match->minute);
        $this->assertSame('Non disponible', $match->homeTeam);
        $this->assertNull($match->homeScore);
        $this->assertNull($match->awayScore);
    }

    public function test_api_football_mapper_matches_documented_statistics_coverage_by_league(): void
    {
        $liveResponse = json_encode([
            'response' => [
                ['fixture' => ['id' => 100], 'league' => ['id' => 39, 'name' => 'Premier League', 'season' => 2026]],
                ['fixture' => ['id' => 101], 'league' => ['id' => 39, 'name' => 'Premier League', 'season' => 2025]],
                ['fixture' => ['id' => 200], 'league' => ['id' => 552, 'name' => '3. Lig - Group 1', 'season' => 2026]],
                ['fixture' => ['id' => 201], 'league' => ['id' => 101, 'name' => 'J-League Cup', 'season' => 2026]],
                ['fixture' => ['id' => 300], 'league' => ['id' => 99999, 'name' => 'Unknown', 'season' => 2026]],
            ],
        ], JSON_THROW_ON_ERROR);
        $coverageResponse = file_get_contents(database_path('fixtures/api-football/leagues-current-extract.json'));
        $this->assertNotFalse($coverageResponse);

        $feed = (new ApiFootballMapper)->mapFootball(
            rawResponse: $liveResponse,
            rawCoverageResponse: $coverageResponse,
        );

        $this->assertSame([true, true, false, false, null], array_map(
            fn ($match): ?bool => $match->statisticsCoverage,
            $feed->matches,
        ));
        $this->assertFalse($feed->matches[0]->statisticsCoverageFallback);
        $this->assertTrue($feed->matches[1]->statisticsCoverageFallback);
        $this->assertSame(2026, $feed->matches[1]->statisticsCoverageSeason);
        $this->assertNull($feed->matches[4]->statisticsCoverage);
    }

    public function test_api_football_odds_mapper_uses_the_captured_bet_23_response(): void
    {
        $rawResponse = file_get_contents(database_path('fixtures/api-football/odds-live-bet-23.json'));
        $this->assertNotFalse($rawResponse);

        $feed = (new ApiFootballMapper)->mapOdds($rawResponse, 1, 81, 100);

        $this->assertTrue($feed->reachable);
        $this->assertTrue($feed->exactScoreMarketAvailable);
        $this->assertSame(13, $feed->matchesWithExactScoreMarket);
        $this->assertSame(1, $feed->requestsUsed);
        $this->assertSame(81, $feed->requestsRemaining);
        $this->assertSame(100, $feed->requestsLimit);
        $this->assertSame($rawResponse, $feed->rawResponse);
        $match = collect($feed->matches)->firstWhere('providerMatchId', '1648706');
        $this->assertNotNull($match);
        $this->assertSame(65, $match->minute);
        $this->assertSame(2.5, $match->exactScoreOdds['1-0']);
        $this->assertArrayNotHasKey('4-3', $match->exactScoreOdds);
    }

    public function test_api_football_bet_23_is_named_final_score_in_the_supplied_market_list(): void
    {
        $rawResponse = file_get_contents(database_path('fixtures/api-football/odds_live_bets.json'));
        $this->assertNotFalse($rawResponse);
        $payload = json_decode($rawResponse, true, flags: JSON_THROW_ON_ERROR);

        $this->assertCount(266, $payload['response']);
        $bet = collect($payload['response'])->firstWhere('id', 23);
        $this->assertSame('Final Score', $bet['name']);
    }

    public function test_api_football_mapper_uses_the_supplied_live_correct_score_response(): void
    {
        $rawResponse = file_get_contents(database_path('fixtures/api-football/odds_live_bet23.json'));
        $this->assertNotFalse($rawResponse);

        $feed = (new ApiFootballMapper)->mapOdds($rawResponse);

        $this->assertTrue($feed->reachable);
        $this->assertTrue($feed->exactScoreMarketAvailable);
        $this->assertSame($rawResponse, $feed->rawResponse);
        $this->assertCount(1, $feed->matches);

        $match = $feed->matches[0];
        $this->assertSame('1648706', $match->providerMatchId);
        $this->assertSame(18, $match->minute);
        $this->assertSame(0, $match->homeScore);
        $this->assertSame(0, $match->awayScore);
        $this->assertSame(6.5, $match->exactScoreOdds['1-0']);
        $this->assertSame(5.0, $match->exactScoreOdds['2-0']);
        $this->assertCount(23, $match->exactScoreOdds);
        $this->assertArrayNotHasKey('4-3', $match->exactScoreOdds);
        $this->assertArrayNotHasKey('6-2', $match->exactScoreOdds);
    }

    public function test_api_football_mapper_ignores_not_started_and_stopped_fixtures(): void
    {
        $rawResponse = file_get_contents(database_path('fixtures/api-football/odds_live_bet23.json'));
        $this->assertNotFalse($rawResponse);
        $payload = json_decode($rawResponse, true, flags: JSON_THROW_ON_ERROR);
        $payload['response'][0]['fixture']['status']['long'] = 'First Half';
        $payload['response'][] = $payload['response'][0];
        $payload['response'][2]['fixture']['id'] = 9999999;
        $payload['response'][2]['fixture']['status']['long'] = 'Not Started';
        $payload['response'][2]['status']['stopped'] = false;
        $rawResponse = json_encode($payload, JSON_THROW_ON_ERROR);

        $feed = (new ApiFootballMapper)->mapOdds($rawResponse);

        $this->assertCount(1, $feed->matches);
        $this->assertSame('1648706', $feed->matches[0]->providerMatchId);
    }

    public function test_api_football_provider_does_not_call_out_when_not_configured(): void
    {
        Http::preventStrayRequests();
        config()->set('services.football_api.probe_url', null);
        config()->set('services.football_api.api_key', null);
        config()->set('services.football_api.api_key_header', null);

        $feed = app(ApiFootballProvider::class)->getLiveMatches();

        $this->assertNull($feed->reachable);
        $this->assertNull($feed->statisticsAvailable);
        $this->assertStringContainsString('NON VÉRIFIÉ', $feed->statusMessage);
    }

    public function test_api_football_capture_is_blocked_for_fake_driver_without_network_calls(): void
    {
        Http::preventStrayRequests();
        config()->set('services.pronofoot.football_driver', 'fake');

        $this->artisan('api-football:capture')
            ->expectsOutputToContain('FOOTBALL_DRIVER=real')
            ->assertExitCode(1);

        Http::assertNothingSent();
    }

    public function test_api_football_capture_saves_raw_bodies_for_live_statistics_and_bet_23(): void
    {
        $this->captureDirectory = storage_path('framework/testing/api-football-capture-'.uniqid('', true));
        app()->instance(ApiFootballResponseCapture::class, new ApiFootballResponseCapture($this->captureDirectory));
        config()->set('services.pronofoot.football_driver', 'real');
        config()->set('services.football_api.api_key', 'test-api-key');
        config()->set('services.football_api.base_url', 'https://api.example.test');

        $liveBody = '{"response":[{"fixture":{"id":1648706}}]}';
        $statisticsBody = '{"response":[{"statistics":[]}]}';
        $oddsBody = '{"response":[{"fixture":{"id":1648706},"odds":[]}]}';
        Http::fakeSequence()
            ->push($liveBody, 200, [
                'x-ratelimit-requests-remaining' => '19',
                'x-ratelimit-requests-limit' => '100',
            ])
            ->push($statisticsBody, 200)
            ->push($oddsBody, 200, [
                'x-ratelimit-requests-remaining' => '17',
                'x-ratelimit-requests-limit' => '100',
            ]);

        $this->artisan('api-football:capture')
            ->expectsOutputToContain('Appels API prévus : 3 maximum')
            ->expectsOutputToContain('Quota restant avant fixtures?live=all : inconnu (aucun en-tête reçu).')
            ->expectsOutputToContain('Quota restant avant fixtures/statistics?fixture=1648706 : 19.')
            ->expectsOutputToContain('Quota restant avant odds/live?bet=23 : 19.')
            ->expectsOutputToContain('Matchs en direct : 1')
            ->expectsOutputToContain('ID utilisé pour les statistiques : 1648706')
            ->expectsOutputToContain('17 requête(s) restante(s) sur 100')
            ->assertExitCode(0);

        $files = File::files($this->captureDirectory);
        $this->assertCount(3, $files);
        $contents = [];
        foreach ($files as $file) {
            $contents[$file->getFilename()] = file_get_contents($file->getPathname());
        }
        $this->assertContains($liveBody, $contents);
        $this->assertContains($statisticsBody, $contents);
        $this->assertContains($oddsBody, $contents);

        Http::assertSentCount(3);
        Http::assertSent(fn (Request $request): bool => $request->hasHeader('x-apisports-key', 'test-api-key'));
        Http::assertSent(fn (Request $request): bool => str_ends_with($request->url(), '/fixtures?live=all'));
        Http::assertSent(fn (Request $request): bool => str_ends_with($request->url(), '/fixtures/statistics?fixture=1648706'));
        Http::assertSent(fn (Request $request): bool => str_ends_with($request->url(), '/odds/live?bet=23'));
    }

    public function test_api_football_capture_uses_the_requested_live_fixture_for_statistics(): void
    {
        $this->captureDirectory = storage_path('framework/testing/api-football-capture-'.uniqid('', true));
        app()->instance(ApiFootballResponseCapture::class, new ApiFootballResponseCapture($this->captureDirectory));
        config()->set('services.pronofoot.football_driver', 'real');
        config()->set('services.football_api.api_key', 'test-api-key');
        config()->set('services.football_api.base_url', 'https://api.example.test');
        Http::fakeSequence()
            ->push('{"response":[{"fixture":{"id":100}},{"fixture":{"id":200}}]}', 200, [
                'x-ratelimit-requests-remaining' => '20',
            ])
            ->push('{"response":[{"statistics":[]}]}', 200, [
                'x-ratelimit-requests-remaining' => '19',
            ])
            ->push('{"response":[]}', 200, [
                'x-ratelimit-requests-remaining' => '18',
            ]);

        $this->artisan('api-football:capture', ['--fixture' => '200'])
            ->expectsOutputToContain('ID utilisé pour les statistiques : 200')
            ->expectsOutputToContain('Quota restant avant fixtures/statistics?fixture=200 : 20.')
            ->assertExitCode(0);

        Http::assertSent(fn (Request $request): bool => str_ends_with($request->url(), '/fixtures/statistics?fixture=200'));
        Http::assertSentCount(3);
    }

    public function test_api_football_capture_does_not_spend_requests_after_quota_reaches_zero(): void
    {
        $this->captureDirectory = storage_path('framework/testing/api-football-capture-'.uniqid('', true));
        app()->instance(ApiFootballResponseCapture::class, new ApiFootballResponseCapture($this->captureDirectory));
        config()->set('services.pronofoot.football_driver', 'real');
        config()->set('services.football_api.api_key', 'test-api-key');
        config()->set('services.football_api.base_url', 'https://api.example.test');
        Http::fakeSequence()->push('{"response":[{"fixture":{"id":200}}]}', 200, [
            'x-ratelimit-requests-remaining' => '0',
        ]);

        $this->artisan('api-football:capture', ['--fixture' => '200'])
            ->expectsOutputToContain('Quota restant avant fixtures/statistics?fixture=200 : 0.')
            ->expectsOutputToContain('Quota API-Football épuisé')
            ->assertExitCode(1);

        Http::assertSentCount(1);
        $this->assertCount(1, File::files($this->captureDirectory));
    }

    public function test_api_football_capture_auto_selects_a_live_fixture_with_statistics_coverage(): void
    {
        $this->captureDirectory = storage_path('framework/testing/api-football-capture-'.uniqid('', true));
        app()->instance(ApiFootballResponseCapture::class, new ApiFootballResponseCapture($this->captureDirectory));
        config()->set('services.pronofoot.football_driver', 'real');
        config()->set('services.football_api.api_key', 'test-api-key');
        config()->set('services.football_api.base_url', 'https://api.example.test');
        $coverageResponse = file_get_contents(database_path('fixtures/api-football/leagues-current-extract.json'));
        $this->assertNotFalse($coverageResponse);
        Http::fakeSequence()
            ->push('{"response":[{"fixture":{"id":200},"league":{"id":39,"season":2025}}]}', 200, [
                'x-ratelimit-requests-remaining' => '20',
            ])
            ->push($coverageResponse, 200, [
                'x-ratelimit-requests-remaining' => '19',
            ])
            ->push('{"response":[{"statistics":[]}]}', 200, [
                'x-ratelimit-requests-remaining' => '18',
            ])
            ->push('{"response":[]}', 200, [
                'x-ratelimit-requests-remaining' => '17',
            ]);

        $this->artisan('api-football:capture', ['--auto-covered' => true])
            ->expectsOutputToContain('Quota restant avant fixtures?live=all : inconnu (aucun en-tête reçu).')
            ->expectsOutputToContain('Quota restant avant leagues?current=true : 20.')
            ->expectsOutputToContain('ID candidats couverts : 200')
            ->expectsOutputToContain('Saison courante utilisée faute de correspondance : 200')
            ->expectsOutputToContain('ID choisi automatiquement : 200.')
            ->expectsConfirmation('Appeler les statistiques pour 200 ?', 'yes')
            ->expectsOutputToContain('Quota restant avant fixtures/statistics?fixture=200 : 19.')
            ->expectsOutputToContain('Quota restant avant odds/live?bet=23 : 18.')
            ->assertExitCode(0);

        Http::assertSent(fn (Request $request): bool => str_ends_with($request->url(), '/leagues?current=true'));
        Http::assertSent(fn (Request $request): bool => str_ends_with($request->url(), '/fixtures/statistics?fixture=200'));
        Http::assertSentCount(4);
    }

    public function test_api_football_capture_does_not_guess_a_fixture_id_field(): void
    {
        $this->captureDirectory = storage_path('framework/testing/api-football-capture-'.uniqid('', true));
        app()->instance(ApiFootballResponseCapture::class, new ApiFootballResponseCapture($this->captureDirectory));
        config()->set('services.pronofoot.football_driver', 'real');
        config()->set('services.football_api.api_key', 'test-api-key');
        config()->set('services.football_api.base_url', 'https://api.example.test');

        Http::fakeSequence()
            ->push('{"response":[{"unverified_id_field":1648706}]}')
            ->push('{"response":[]}');

        $this->artisan('api-football:capture')
            ->expectsOutputToContain('Matchs en direct : 1')
            ->expectsOutputToContain('aucun (aucun ID de match disponible)')
            ->expectsOutputToContain('aucun response[].fixture.id exploitable')
            ->assertExitCode(1);

        Http::assertSentCount(2);
        Http::assertNotSent(fn (Request $request): bool => str_contains($request->url(), '/fixtures/statistics'));
        $this->assertCount(2, File::files($this->captureDirectory));
    }

    public function test_api_football_provider_uses_documented_endpoints_and_quota_headers(): void
    {
        $liveResponse = file_get_contents(database_path('fixtures/api-football/fixtures-live.json'));
        $statisticsResponse = file_get_contents(database_path('fixtures/api-football/fixtures-statistics.json'));
        $this->assertNotFalse($liveResponse);
        $this->assertNotFalse($statisticsResponse);
        config()->set('services.football_api.base_url', 'https://api.example.test');
        config()->set('services.football_api.api_key', 'test-api-key');
        Http::fakeSequence()
            ->push($liveResponse, 200, [
                'x-ratelimit-requests-remaining' => '83',
                'x-ratelimit-requests-limit' => '100',
            ])
            ->push($statisticsResponse, 200, [
                'x-ratelimit-requests-remaining' => '82',
                'x-ratelimit-requests-limit' => '100',
            ]);

        $feed = app(ApiFootballProvider::class)->getLiveMatches(statisticsMatchLimit: 1);

        $this->assertTrue($feed->reachable);
        $this->assertSame($liveResponse, $feed->rawResponse);
        $this->assertSame($statisticsResponse, $feed->rawStatisticsResponse);
        $this->assertSame(27, count($feed->matches));
        $this->assertSame('1635776', $feed->statisticsMatchId);
        $this->assertFalse($feed->statisticsAvailable);
        $this->assertSame(2, $feed->requestsUsed);
        $this->assertSame(82, $feed->requestsRemaining);
        $this->assertSame(100, $feed->requestsLimit);
        Http::assertSentCount(2);
        Http::assertSent(fn (Request $request): bool => $request->hasHeader('x-apisports-key', 'test-api-key'));
        Http::assertSent(fn (Request $request): bool => str_ends_with($request->url(), '/fixtures?live=all'));
        Http::assertSent(fn (Request $request): bool => str_ends_with($request->url(), '/fixtures/statistics?fixture=1635776'));
    }

    public function test_api_football_provider_reads_league_statistics_coverage_on_request(): void
    {
        config()->set('services.football_api.base_url', 'https://api.example.test');
        config()->set('services.football_api.api_key', 'test-api-key');
        $coverageResponse = file_get_contents(database_path('fixtures/api-football/leagues-current-extract.json'));
        $this->assertNotFalse($coverageResponse);
        Cache::forget('api-football.leagues.current.'.hash('sha256', 'https://api.example.test'));
        Http::fakeSequence()
            ->push('{"response":[{"fixture":{"id":200,"status":{"long":"First Half","elapsed":12}},"league":{"id":39,"name":"League","season":2026},"teams":{"home":{"name":"Home"},"away":{"name":"Away"}},"goals":{"home":0,"away":0}}]}', 200, [
                'x-ratelimit-requests-remaining' => '20',
            ])
            ->push($coverageResponse, 200, [
                'x-ratelimit-requests-remaining' => '19',
                'x-ratelimit-requests-limit' => '100',
            ]);

        $feed = app(ApiFootballProvider::class)->getLiveMatches(
            includeStatistics: false,
            includeCoverage: true,
        );

        $this->assertSame(true, $feed->matches[0]->statisticsCoverage);
        $this->assertSame(2, $feed->requestsUsed);
        $this->assertSame(19, $feed->requestsRemaining);
        $this->assertSame(100, $feed->requestsLimit);
        Http::assertSentCount(2);
        Http::assertSent(fn (Request $request): bool => str_ends_with($request->url(), '/leagues?current=true'));
    }

    public function test_api_football_odds_provider_uses_bet_23_and_quota_headers(): void
    {
        $rawResponse = file_get_contents(database_path('fixtures/api-football/odds-live-bet-23.json'));
        $this->assertNotFalse($rawResponse);
        config()->set('services.football_api.base_url', 'https://api.example.test');
        config()->set('services.football_api.api_key', 'test-api-key');
        Http::fake([
            'https://api.example.test/odds/live*' => Http::response(
                $rawResponse,
                200,
                [
                    'x-ratelimit-requests-remaining' => '81',
                    'x-ratelimit-requests-limit' => '100',
                ],
            ),
        ]);

        $feed = app(ApiFootballOddsProvider::class)->getLiveOdds();

        $this->assertSame('api_football', $feed->driver);
        $this->assertTrue($feed->exactScoreMarketAvailable);
        $this->assertSame(13, $feed->matchesWithExactScoreMarket);
        $this->assertSame(81, $feed->requestsRemaining);
        $this->assertSame(100, $feed->requestsLimit);
        Http::assertSentCount(1);
        Http::assertSent(fn (Request $request): bool => $request->hasHeader('x-apisports-key', 'test-api-key'));
        Http::assertSent(fn (Request $request): bool => str_ends_with($request->url(), '/odds/live?bet=23'));
    }

    public function test_odds_driver_can_select_api_football(): void
    {
        config()->set('services.pronofoot.odds_driver', 'api_football');

        $this->assertInstanceOf(ApiFootballOddsProvider::class, app(OddsProvider::class));
    }
}
