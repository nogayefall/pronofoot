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
        $this->assertCount(8, $football->matches);
        $this->assertSame(
            ['candidate-alert', 'gap-filter-refusal', 'vitality-filter-refusal', 'trend-data-missing', 'goal-during-scan', 'statistics-missing', 'upcoming-match', 'halftime-signal'],
            array_map(fn ($match): ?string => $match->scenario, $football->matches),
        );
        $this->assertCount(8, array_unique(array_map(fn ($match): string => $match->homeTeam, $football->matches)));
        $this->assertCount(8, array_unique(array_map(fn ($match): string => $match->awayTeam, $football->matches)));
        $this->assertCount(8, array_unique(array_map(fn ($match): ?string => $match->competition, $football->matches)));
        $this->assertCount(8, array_unique(array_map(fn ($match): ?string => $match->kickoffAt, $football->matches)));
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
                oddsChangePercent: -6.0,
            ),
            new RuleConfiguration(
                activeRules: RuleConfiguration::DEFINED_RULES,
                trendSource: 'cote_suggeree',
                stableOddsChangePercent: 3.0,
                methodWeights: ['F121-C' => 1.0],
                strongDropRequiresGap: false,
            ),
        );

        $this->assertFalse($result->filters['gap']->passed, 'Écart 1.10 > 0.50 : seule la forte baisse (F162-Bis) déclenche.');
        $this->assertSame('F162-Bis', $result->decisiveRule);
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
                ),
                new RuleConfiguration(
                    activeRules: RuleConfiguration::DEFINED_RULES,
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
        $this->assertSame('UEFA U19 Championship - Qualification', $match->competition);
        $this->assertSame('2026-11-11T10:00:00+00:00', $match->kickoffAt);
        $this->assertSame('J-League Cup · Japan', $feed->matches[1]->competition);
        $this->assertSame(4, $match->homeScore);
        $this->assertSame(1, $match->awayScore);
        $this->assertSame([], $match->statistics);
        $this->assertSame(10361, $match->homeTeamId);
        $this->assertSame(10369, $match->awayTeamId);
    }

    public function test_api_football_mapper_reads_the_four_covered_statistics_by_team_id(): void
    {
        $statisticsResponse = file_get_contents(database_path('fixtures/api-football/fixtures-statistics-covered.json'));
        $this->assertNotFalse($statisticsResponse);

        $feed = (new ApiFootballMapper)->mapFootball(
            rawResponse: $this->liveResponseFor1644163(),
            rawStatisticsResponse: $statisticsResponse,
            statisticsMatchId: '1644163',
        );

        $this->assertTrue($feed->statisticsAvailable);
        $this->assertStringContainsString('La vitalité est calculée par le scan', $feed->statusMessage);
        $match = $feed->matches[0];
        $this->assertSame([
            'home' => ['shots' => 5, 'shots_on_target' => 3, 'corners' => 2, 'possession' => 40],
            'away' => ['shots' => 9, 'shots_on_target' => 1, 'corners' => 1, 'possession' => 60],
        ], $match->statistics);
        $this->assertNull($match->vitalityScore);
        $this->assertSame([], $feed->matches[1]->statistics);
    }

    public function test_api_football_mapper_uses_team_ids_not_response_order(): void
    {
        $payload = json_decode(
            (string) file_get_contents(database_path('fixtures/api-football/fixtures-statistics-covered.json')),
            true,
            flags: JSON_THROW_ON_ERROR,
        );
        $payload['response'] = array_reverse($payload['response']);

        $feed = (new ApiFootballMapper)->mapFootball(
            rawResponse: $this->liveResponseFor1644163(),
            rawStatisticsResponses: ['1644163' => json_encode($payload, JSON_THROW_ON_ERROR)],
        );

        $this->assertSame(5, $feed->matches[0]->statistics['home']['shots']);
        $this->assertSame(9, $feed->matches[0]->statistics['away']['shots']);
    }

    public function test_api_football_mapper_keeps_missing_or_null_statistics_unavailable_instead_of_zero(): void
    {
        $payload = json_decode(
            (string) file_get_contents(database_path('fixtures/api-football/fixtures-statistics-covered.json')),
            true,
            flags: JSON_THROW_ON_ERROR,
        );
        $payload['response'][0]['statistics'] = array_values(array_filter(
            $payload['response'][0]['statistics'],
            fn (array $statistic): bool => $statistic['type'] !== 'Corner Kicks',
        ));
        foreach ($payload['response'][0]['statistics'] as $index => $statistic) {
            if (in_array($statistic['type'], ['Total Shots', 'Ball Possession'], true)) {
                $payload['response'][0]['statistics'][$index]['value'] = null;
            }
        }
        unset($payload['response'][1]);

        $feed = (new ApiFootballMapper)->mapFootball(
            rawResponse: $this->liveResponseFor1644163(),
            rawStatisticsResponses: ['1644163' => json_encode($payload, JSON_THROW_ON_ERROR)],
        );

        $this->assertSame([
            'home' => ['shots' => null, 'shots_on_target' => 3, 'corners' => null, 'possession' => null],
            'away' => ['shots' => null, 'shots_on_target' => null, 'corners' => null, 'possession' => null],
        ], $feed->matches[0]->statistics);
    }

    public function test_api_football_mapper_ignores_statistics_of_unknown_team_ids(): void
    {
        $payload = json_decode(
            (string) file_get_contents(database_path('fixtures/api-football/fixtures-statistics-covered.json')),
            true,
            flags: JSON_THROW_ON_ERROR,
        );
        $payload['response'][0]['team']['id'] = 1;
        $payload['response'][1]['team']['id'] = 2;

        $feed = (new ApiFootballMapper)->mapFootball(
            rawResponse: $this->liveResponseFor1644163(),
            rawStatisticsResponses: ['1644163' => json_encode($payload, JSON_THROW_ON_ERROR)],
        );

        $this->assertSame([], $feed->matches[0]->statistics);
        $this->assertFalse($feed->statisticsAvailable);
    }

    private function liveResponseFor1644163(): string
    {
        return json_encode(['response' => [
            [
                'fixture' => ['id' => 1644163, 'status' => ['long' => 'Halftime', 'elapsed' => 45]],
                'league' => ['id' => 1191, 'name' => 'Ligue fictive', 'season' => 2026],
                'teams' => [
                    'home' => ['id' => 21698, 'name' => 'Malmö FF W'],
                    'away' => ['id' => 1898, 'name' => 'Ajax W'],
                ],
                'goals' => ['home' => 0, 'away' => 0],
            ],
            [
                'fixture' => ['id' => 2, 'status' => ['long' => 'First Half', 'elapsed' => 10]],
                'teams' => ['home' => ['id' => 3, 'name' => 'A'], 'away' => ['id' => 4, 'name' => 'B']],
                'goals' => ['home' => 0, 'away' => 0],
            ],
        ]], JSON_THROW_ON_ERROR);
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

    public function test_api_football_mapper_ignores_not_started_and_flags_stopped_fixtures(): void
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

        $this->assertCount(2, $feed->matches);
        $this->assertSame('1581906', $feed->matches[0]->providerMatchId);
        $this->assertTrue($feed->matches[0]->stopped);
        $this->assertSame('1648706', $feed->matches[1]->providerMatchId);
        $this->assertFalse($feed->matches[1]->stopped);
        $this->assertNotContains('9999999', array_map(fn ($match): string => $match->providerMatchId, $feed->matches));
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

    public function test_api_football_capture_can_save_the_over_under_line_bet_without_mapping_it(): void
    {
        $this->captureDirectory = storage_path('framework/testing/api-football-capture-'.uniqid('', true));
        app()->instance(ApiFootballResponseCapture::class, new ApiFootballResponseCapture($this->captureDirectory));
        config()->set('services.pronofoot.football_driver', 'real');
        config()->set('services.football_api.api_key', 'test-api-key');
        config()->set('services.football_api.base_url', 'https://api.example.test');
        Http::fakeSequence()
            ->push('{"response":[{"fixture":{"id":200}}]}', 200, ['x-ratelimit-requests-remaining' => '20'])
            ->push('{"response":[{"statistics":[]}]}', 200, ['x-ratelimit-requests-remaining' => '19'])
            ->push('{"response":[]}', 200, ['x-ratelimit-requests-remaining' => '18'])
            ->push('{"response":[{"bet36":"brut"}]}', 200, ['x-ratelimit-requests-remaining' => '17']);

        $this->artisan('api-football:capture', ['--fixture' => '200', '--bet36' => true])
            ->expectsOutputToContain('Appels API prévus : 4 maximum (dont cotes bet 36).')
            ->expectsOutputToContain('Quota restant avant odds/live?bet=36 : 18.')
            ->assertExitCode(0);

        Http::assertSent(fn (Request $request): bool => str_ends_with($request->url(), '/odds/live?bet=36'));
        Http::assertSentCount(4);
        $bet36Files = array_filter(
            File::files($this->captureDirectory),
            fn ($file): bool => str_starts_with($file->getFilename(), 'odds-live-bet36-'),
        );
        $this->assertCount(1, $bet36Files);
        $this->assertSame('{"response":[{"bet36":"brut"}]}', File::get(array_values($bet36Files)[0]->getPathname()));
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

    public function test_api_football_mapper_reads_under_2_5_from_the_real_bet_36_capture(): void
    {
        $raw = file_get_contents(database_path('fixtures/api-football/odds-live-bet36.json'));
        $this->assertNotFalse($raw);

        $odds = (new ApiFootballMapper)->mapUnder25Odds($raw);

        $this->assertSame(1.875, $odds['1528970'], 'Liechtenstein – Azerbaïdjan, mi-temps, ligne principale 2.5.');
        $this->assertSame(1.5, $odds['1545614'], 'Ligne 2.5 non principale (main=false) : la cote reste lisible.');
        $this->assertSame(1.6, $odds['1604915']);
        $this->assertArrayNotHasKey('1528965', $odds, 'Serbie – Allemagne : aucune ligne 2.5 proposée.');
        $this->assertArrayNotHasKey('1545870', $odds, '3 buts marqués : plus de ligne 2.5.');
        $this->assertCount(11, $odds);
    }

    public function test_api_football_mapper_never_guesses_between_duplicate_or_suspended_under_2_5_values(): void
    {
        $payload = json_decode((string) file_get_contents(database_path('fixtures/api-football/odds-live-bet36.json')), true, flags: JSON_THROW_ON_ERROR);
        foreach ($payload['response'] as $index => $item) {
            foreach ($item['odds'][0]['values'] as $valueIndex => $value) {
                if ($value['value'] !== 'Under' || $value['handicap'] !== '2.5') {
                    continue;
                }
                if ($item['fixture']['id'] === 1528970) {
                    $payload['response'][$index]['odds'][0]['values'][] = [...$value, 'odd' => '1.9', 'main' => false];
                }
                if ($item['fixture']['id'] === 1604915) {
                    $payload['response'][$index]['odds'][0]['values'][$valueIndex]['suspended'] = true;
                }
            }
        }

        $odds = (new ApiFootballMapper)->mapUnder25Odds(json_encode($payload, JSON_THROW_ON_ERROR));

        $this->assertArrayNotHasKey('1528970', $odds);
        $this->assertArrayNotHasKey('1604915', $odds);
        $this->assertNull((new ApiFootballMapper)->mapUnder25Odds('{"unexpected":true}'));
    }

    public function test_api_football_odds_provider_adds_under_2_5_only_when_requested(): void
    {
        config()->set('services.football_api.api_key', 'test-api-key');
        config()->set('services.football_api.base_url', 'https://api.example.test');
        $bet23 = json_encode(['response' => [[
            'fixture' => ['id' => 1528970, 'status' => ['long' => 'Halftime', 'elapsed' => 45]],
            'status' => ['stopped' => true, 'blocked' => false, 'finished' => false],
            'teams' => ['home' => ['goals' => 0], 'away' => ['goals' => 1]],
            'odds' => [['id' => 23, 'name' => 'Final Score', 'values' => [['value' => '0-1', 'odd' => '2.1', 'suspended' => false]]]],
        ]]], JSON_THROW_ON_ERROR);
        Http::fake([
            'https://api.example.test/odds/live?bet=23' => Http::response($bet23, 200, ['x-ratelimit-requests-remaining' => '50']),
            'https://api.example.test/odds/live?bet=36' => Http::response(
                (string) file_get_contents(database_path('fixtures/api-football/odds-live-bet36.json')),
                200,
                ['x-ratelimit-requests-remaining' => '49'],
            ),
        ]);
        $provider = app(ApiFootballOddsProvider::class);

        $withoutUnder = $provider->getLiveOdds();
        $this->assertNull($withoutUnder->matches[0]->under25Odds);
        Http::assertSentCount(1);

        $withUnder = $provider->getLiveOdds(includeUnder25: true);
        $this->assertSame(1.875, $withUnder->matches[0]->under25Odds);
        $this->assertSame(['0-1' => 2.1], $withUnder->matches[0]->exactScoreOdds);
        $this->assertSame(2, $withUnder->requestsUsed);
        $this->assertSame(49, $withUnder->requestsRemaining);
        Http::assertSent(fn (Request $request): bool => str_ends_with($request->url(), '/odds/live?bet=36'));
    }

    public function test_bet_36_failure_keeps_exact_score_odds_and_leaves_under_2_5_unavailable(): void
    {
        config()->set('services.football_api.api_key', 'test-api-key');
        config()->set('services.football_api.base_url', 'https://api.example.test');
        $bet23 = (string) file_get_contents(database_path('fixtures/api-football/odds-live-bet-23.json'));
        Http::fake([
            'https://api.example.test/odds/live?bet=23' => Http::response($bet23, 200),
            'https://api.example.test/odds/live?bet=36' => Http::response('{"errors":["panne"]}', 500),
        ]);

        $feed = app(ApiFootballOddsProvider::class)->getLiveOdds(includeUnder25: true);

        $this->assertTrue($feed->exactScoreMarketAvailable);
        $this->assertNotEmpty($feed->matches);
        $this->assertNull($feed->matches[0]->under25Odds);
        $this->assertStringContainsString('Cote Under 2.5 indisponible : API-Football a répondu HTTP 500', $feed->statusMessage);
    }

    public function test_odds_driver_can_select_api_football(): void
    {
        config()->set('services.pronofoot.odds_driver', 'api_football');

        $this->assertInstanceOf(ApiFootballOddsProvider::class, app(OddsProvider::class));
    }
}
