<?php

namespace Tests\Unit;

use App\Providers\Contracts\FootballProvider;
use App\Providers\Contracts\OddsProvider;
use App\Providers\Data\ProviderUnavailable;
use App\Providers\Real\ApiFootballMapper;
use App\Providers\Real\ApiFootballProvider;
use App\Providers\Real\TheOddsApiProvider;
use App\Rules\RuleConfiguration;
use App\Rules\RuleEngine;
use App\Rules\RuleInput;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ProviderPilotsTest extends TestCase
{
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
        $this->assertCount(6, $football->matches);
        $this->assertSame(
            ['candidate-alert', 'gap-filter-refusal', 'vitality-filter-refusal', 'trend-data-missing', 'goal-during-scan', 'statistics-missing'],
            array_map(fn ($match): ?string => $match->scenario, $football->matches),
        );
        $this->assertNotNull($football->rawResponse);
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
                oddsChangePercent: $footballMatch->oddsChangePercent,
                methodScores: ['F121-C' => 82],
            ),
            new RuleConfiguration(
                activeRules: ['F121-C'],
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
                    oddsChangePercent: $footballMatch->oddsChangePercent,
                    methodScores: ['F121-C' => 82],
                ),
                new RuleConfiguration(
                    activeRules: ['F121-C'],
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
        $this->assertStringContainsString('NON VÉRIFIÉ', $feed->statusMessage);
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

    public function test_api_football_probe_captures_raw_body_without_mapping_unverified_fields(): void
    {
        $rawResponse = '{"response":[{"unverified_field":"sample"}]}';
        config()->set('services.football_api.probe_url', 'https://api.example.test/probe');
        config()->set('services.football_api.api_key', 'test-api-key');
        config()->set('services.football_api.api_key_header', 'X-Example-Key');

        Http::fake([
            'https://api.example.test/probe' => Http::response($rawResponse),
        ]);

        $feed = app(ApiFootballProvider::class)->getLiveMatches();

        $this->assertTrue($feed->reachable);
        $this->assertSame($rawResponse, $feed->rawResponse);
        $this->assertSame([], $feed->matches);
        $this->assertNull($feed->statisticsAvailable);
        $this->assertStringContainsString('NON VÉRIFIÉ', $feed->statusMessage);
        Http::assertSent(fn (Request $request): bool => $request->hasHeader('X-Example-Key', 'test-api-key'));
    }
}
