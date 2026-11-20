<?php

namespace Tests\Feature;

use App\Models\OpportunityLog;
use App\Models\RuleProfile;
use App\Models\Setting;
use App\Models\TrackedMatch;
use App\Models\User;
use App\Providers\Contracts\FootballProvider;
use App\Providers\Contracts\OddsProvider;
use App\Providers\Data\FootballFeed;
use App\Providers\Data\FootballMatch;
use App\Providers\Data\OddsFeed;
use App\Rules\RuleConfiguration;
use App\Services\RuleConfigurationFactory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class AdminApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config([
            'services.pronofoot.football_driver' => 'fake',
            'services.pronofoot.odds_driver' => 'fake',
            'services.pronofoot.fake_scenario' => 'baseline',
        ]);
        $this->actingAs(User::factory()->create([
            'name' => 'Admin test',
            'is_admin' => true,
        ]));
    }

    public function test_match_picker_lists_fake_live_and_upcoming_matches_and_tracks_them(): void
    {
        $response = $this->getJson(route('admin.api.matches.index'))
            ->assertOk()
            ->assertJsonPath('simulation', true)
            ->assertJsonCount(8, 'matches')
            ->assertJsonPath('matches.6.status', 'upcoming')
            ->assertJsonPath('matches.0.exactScoreMarketAvailable', true)
            ->assertJsonPath('matches.0.statisticsCoverage', true)
            ->assertJsonPath('matches.5.statisticsCoverage', null)
            ->assertJsonStructure(['matches' => ['*' => ['leagueId', 'competition', 'status', 'minute']]]);
        $matchId = $response->json('matches.0.providerMatchId');

        $created = $this->postJson(route('admin.api.matches.store'), [
            'provider_match_id' => $matchId,
        ])->assertCreated();
        $trackedMatchId = $created->json('match.id');

        $this->getJson(route('admin.api.matches.index'))
            ->assertOk()
            ->assertJsonPath('matches.0.tracked', true)
            ->assertJsonPath('matches.0.trackedId', $trackedMatchId);

        $this->deleteJson(route('admin.api.matches.destroy', $trackedMatchId))->assertOk();
        $this->assertDatabaseHas('tracked_matches', ['id' => $trackedMatchId, 'is_active' => false]);
    }

    public function test_match_with_unknown_statistics_coverage_can_be_tracked_with_warning(): void
    {
        $this->postJson(route('admin.api.matches.store'), [
            'provider_match_id' => 'fake-missing-statistics',
        ])->assertCreated()
            ->assertJsonPath('warnings.0', 'Statistiques non confirmées.');

        $this->assertDatabaseCount('tracked_matches', 1);
    }

    public function test_match_with_false_statistics_coverage_cannot_be_tracked(): void
    {
        $footballProvider = \Mockery::mock(FootballProvider::class);
        $footballProvider->shouldReceive('getLiveMatches')->once()->andReturn(new FootballFeed(
            driver: 'real',
            reachable: true,
            statisticsAvailable: null,
            statusMessage: 'Test',
            matches: [
                new FootballMatch(
                    providerMatchId: 'live-uncovered',
                    homeTeam: 'Home',
                    awayTeam: 'Away',
                    status: 'First Half',
                    statisticsCoverage: false,
                ),
            ],
        ));
        $oddsProvider = \Mockery::mock(OddsProvider::class);
        $oddsProvider->shouldNotReceive('getLiveOdds');
        $this->app->instance(FootballProvider::class, $footballProvider);
        $this->app->instance(OddsProvider::class, $oddsProvider);

        $this->postJson(route('admin.api.matches.store'), [
            'provider_match_id' => 'live-uncovered',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('provider_match_id');

        $this->assertDatabaseCount('tracked_matches', 0);
    }

    public function test_match_cannot_be_tracked_without_a_non_suspended_exact_score_market(): void
    {
        $footballProvider = \Mockery::mock(FootballProvider::class);
        $footballProvider->shouldReceive('getLiveMatches')->once()->andReturn(new FootballFeed(
            driver: 'real',
            reachable: true,
            statisticsAvailable: null,
            statusMessage: 'Test',
            matches: [
                new FootballMatch(
                    providerMatchId: 'live-1',
                    homeTeam: 'Home',
                    awayTeam: 'Away',
                    status: 'First Half',
                    statisticsCoverage: true,
                ),
            ],
        ));
        $oddsProvider = \Mockery::mock(OddsProvider::class);
        $oddsProvider->shouldReceive('getLiveOdds')->once()->andReturn(new OddsFeed(
            driver: 'real',
            reachable: true,
            exactScoreMarketAvailable: false,
            overUnderMarketAvailable: null,
            statusMessage: 'No market',
        ));
        $this->app->instance(FootballProvider::class, $footballProvider);
        $this->app->instance(OddsProvider::class, $oddsProvider);

        $this->postJson(route('admin.api.matches.store'), [
            'provider_match_id' => 'live-1',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('provider_match_id');

        $this->assertDatabaseCount('tracked_matches', 0);
    }

    public function test_match_cannot_be_added_when_provider_quota_is_zero(): void
    {
        $provider = \Mockery::mock(FootballProvider::class);
        $provider->shouldReceive('getLiveMatches')
            ->once()
            ->andReturn(new FootballFeed(
                driver: 'real',
                reachable: true,
                statisticsAvailable: null,
                statusMessage: 'Quota épuisé.',
                requestsRemaining: 0,
            ));
        $this->app->instance(FootballProvider::class, $provider);

        $this->postJson(route('admin.api.matches.store'), [
            'provider_match_id' => 'provider-match',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('provider_match_id');

        $this->assertDatabaseCount('tracked_matches', 0);
    }

    public function test_settings_are_validated_audited_and_reset_to_confirmed_values(): void
    {
        $this->patchJson(route('admin.api.settings.update'), [
            'settings' => [
                'tendance_source' => 'cote_suggeree',
                'tendance_seuil_stable' => 3,
            ],
        ])->assertOk();

        $this->assertDatabaseHas('settings', ['key' => 'tendance_source', 'value' => 'cote_suggeree']);
        $this->assertDatabaseHas('setting_changes', [
            'user_id' => auth()->id(),
            'setting_key' => 'tendance_seuil_stable',
            'new_value' => '3',
        ]);

        $this->patchJson(route('admin.api.settings.update'), [
            'settings' => ['tendance_source' => 'cote_au_hasard'],
        ])->assertUnprocessable();

        $this->assertDatabaseMissing('settings', ['key' => 'ecart_negatif_comportement']);
        $this->assertDatabaseHas('settings', ['key' => 'rules.open_match_min_goals', 'value' => '4', 'needs_confirmation' => true]);
        $this->patchJson(route('admin.api.settings.update'), [
            'settings' => ['rules.open_match_min_goals' => ''],
        ])->assertOk();
        $this->patchJson(route('admin.api.settings.update'), [
            'settings' => ['rules.decision_pipeline' => ['vitality', 'inconnue']],
        ])->assertUnprocessable();
        $this->patchJson(route('admin.api.settings.update'), [
            'settings' => ['rules.vitality_normalization_references' => ['shots' => [[3, 10], [8, 20]]]],
        ])->assertUnprocessable();

        $this->postJson(route('admin.api.settings.reset'))->assertOk();
        $this->assertDatabaseHas('settings', ['key' => 'tendance_source', 'value' => 'cote_suggeree']);
        $this->assertDatabaseHas('settings', ['key' => 'tendance_seuil_stable', 'value' => '5']);
        $this->assertDatabaseHas('settings', ['key' => 'rules.open_match_min_goals', 'value' => '4']);
        $this->assertDatabaseMissing('settings', ['key' => 'rules.open_match_scores']);
    }

    public function test_rule_profile_only_accepts_defined_rules_and_persists_weights(): void
    {
        $this->putJson(route('admin.api.rule-profile.update'), [
            'active_rules' => ['F121-C', 'F121-C.2'],
            'method_weights' => ['F121-C' => 0.6, 'F121-C.2' => 0.4],
        ])->assertOk()
            ->assertJsonPath('profile.activeRules.0', 'F121-C');

        $profile = RuleProfile::query()->where('is_active', true)->firstOrFail();
        $this->assertSame(['F121-C', 'F121-C.2'], $profile->settings['active_rules']);
        $this->assertSame(0.6, $profile->settings['method_weights']['F121-C']);

        $this->putJson(route('admin.api.rule-profile.update'), [
            'active_rules' => ['F121-E'],
            'method_weights' => [],
        ])->assertUnprocessable();
    }

    public function test_journal_outcomes_and_statistics_are_based_on_persisted_alerts(): void
    {
        $match = TrackedMatch::query()->create([
            'provider' => 'fake',
            'provider_match_id' => 'journal-match',
            'home_team' => 'Home',
            'away_team' => 'Away',
            'is_active' => true,
        ]);
        $log = OpportunityLog::query()->create([
            'tracked_match_id' => $match->id,
            'event_type' => 'evaluation',
            'rule_id' => 'F121-C',
            'selection' => 'home',
            'decision' => 'alert',
            'rule_results' => [],
            'filter_results' => [],
            'evaluated_at' => now(),
        ]);
        $log->alert()->create([
            'channel' => 'log',
            'status' => 'sent',
            'message' => 'Signal de test',
            'expires_at' => now()->addMinutes(15),
        ]);

        $this->patchJson(route('admin.api.journal.outcome', $log), ['outcome' => 'won'])->assertOk();
        $this->getJson(route('admin.api.journal.index'))
            ->assertOk()
            ->assertJsonPath('data.0.outcome', 'won')
            ->assertJsonPath('data.0.match', 'Home - Away');
        $this->getJson(route('admin.api.statistics'))
            ->assertOk()
            ->assertJsonPath('alerts.total', 1)
            ->assertJsonPath('alerts.won', 1)
            ->assertJsonPath('alerts.successRatePercent', 100);
    }

    public function test_dashboard_reports_simulation_and_does_not_invent_quota_or_scan_data(): void
    {
        $this->getJson(route('admin.api.dashboard'))
            ->assertOk()
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('X-Frame-Options', 'DENY')
            ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
            ->assertJsonPath('simulation', true)
            ->assertJsonPath('scan.active', false)
            ->assertJsonPath('quotas.football', null)
            ->assertJsonPath('quotas.odds', null)
            ->assertJsonCount(0, 'trackedMatches')
            ->assertJsonCount(0, 'activeAlerts');
    }

    public function test_dashboard_exposes_raw_team_statistics_without_filling_missing_values(): void
    {
        $match = TrackedMatch::query()->create([
            'provider' => 'real',
            'provider_match_id' => '1644163',
            'home_team' => 'Malmö FF W',
            'away_team' => 'Ajax W',
            'is_active' => true,
        ]);
        $match->snapshots()->create([
            'statistics' => [
                'home' => ['shots' => 5, 'shots_on_target' => 3, 'corners' => 2, 'possession' => 40],
                'away' => ['shots' => 9, 'shots_on_target' => null, 'corners' => 1, 'possession' => 60],
            ],
            'vitality_score' => null,
            'statistics_captured_at' => now(),
            'captured_at' => now(),
        ]);

        $this->getJson(route('admin.api.dashboard'))
            ->assertOk()
            ->assertJsonPath('trackedMatches.0.teamStatistics.home.shots', 5)
            ->assertJsonPath('trackedMatches.0.teamStatistics.home.possession', 40)
            ->assertJsonPath('trackedMatches.0.teamStatistics.away.shots_on_target', null)
            ->assertJsonPath('trackedMatches.0.teamStatistics.away.possession', 60)
            ->assertJsonPath('trackedMatches.0.vitality', null);
    }

    public function test_dashboard_does_not_present_aggregate_fake_statistics_as_team_statistics(): void
    {
        $match = TrackedMatch::query()->create([
            'provider' => 'fake',
            'provider_match_id' => 'fake-flat',
            'home_team' => 'Home',
            'away_team' => 'Away',
            'is_active' => true,
        ]);
        $match->snapshots()->create([
            'statistics' => ['shots' => 8, 'shots_on_target' => 4, 'possession' => 56, 'corners' => 3],
            'captured_at' => now(),
        ]);

        $this->getJson(route('admin.api.dashboard'))
            ->assertOk()
            ->assertJsonPath('trackedMatches.0.teamStatistics', null);
    }

    public function test_dashboard_reports_the_quota_mode_and_league_ids_are_validated(): void
    {
        $this->getJson(route('admin.api.dashboard'))->assertJsonPath('quotaMode', 'normal');

        Cache::put('pronofoot.quota.mode', 'exhausted');
        $this->getJson(route('admin.api.dashboard'))->assertJsonPath('quotaMode', 'exhausted');

        $this->patchJson(route('admin.api.settings.update'), [
            'settings' => ['scan.auto_league_ids' => [39, 'Ligue 1']],
        ])->assertUnprocessable();
        $this->patchJson(route('admin.api.settings.update'), [
            'settings' => ['scan.auto_league_ids' => [39, 61], 'scan.auto_mode' => false],
        ])->assertOk();
        $this->assertDatabaseHas('settings', ['key' => 'scan.auto_league_ids', 'value' => '[39,61]']);
        $this->assertDatabaseHas('settings', ['key' => 'scan.auto_mode', 'value' => '0']);
    }

    public function test_several_rule_profiles_can_be_created_saved_and_activated_without_default_weights(): void
    {
        $first = $this->postJson(route('admin.api.rule-profiles.store'), ['name' => 'Profil A'])
            ->assertCreated()
            ->assertJsonPath('created.isActive', true)
            ->assertJsonPath('created.activeRules', [])
            ->json('created.id');
        $second = $this->postJson(route('admin.api.rule-profiles.store'), ['name' => 'Profil B'])
            ->assertCreated()
            ->assertJsonPath('created.isActive', false)
            ->json('created.id');
        $this->postJson(route('admin.api.rule-profiles.store'), ['name' => 'Profil A'])->assertUnprocessable();

        $this->putJson(route('admin.api.rule-profiles.update', $second), [
            'active_rules' => ['F121-C', 'F121-E1'],
            'method_weights' => [],
            'validation_threshold' => 80,
        ])->assertOk();
        $this->putJson(route('admin.api.rule-profiles.update', $second), [
            'active_rules' => ['F121-C'],
            'method_weights' => [],
            'validation_threshold' => 120,
        ])->assertUnprocessable();

        $this->postJson(route('admin.api.rule-profiles.activate', $second))
            ->assertOk()
            ->assertJsonPath('profile.id', $second)
            ->assertJsonPath('profile.validationThreshold', 80)
            ->assertJsonCount(2, 'profiles');
        $this->assertFalse(RuleProfile::query()->findOrFail($first)->is_active);
        $this->assertSame([], RuleProfile::query()->findOrFail($second)->settings['method_weights']);
    }

    public function test_testing_a_combination_shows_the_confidence_score_and_applies_the_optional_convergence_step(): void
    {
        $profile = RuleProfile::query()->create([
            'name' => 'Profil de test',
            'is_active' => true,
            'settings' => [
                'active_rules' => RuleConfiguration::DEFINED_RULES,
                'method_weights' => ['F121-C' => 1.0],
                'validation_threshold' => 75,
            ],
        ]);
        $payload = [
            'rule_profile_id' => $profile->id,
            'home_score' => 0,
            'away_score' => 0,
            'exact_score_odds' => ['0-0' => 7.5, '1-0' => 8.6, '0-1' => 9.8],
            'vitality_score' => 61,
            'odds_change_percent' => -6,
            'method_scores' => ['F121-C' => 70],
        ];

        $this->postJson(route('admin.rule-test'), $payload)
            ->assertOk()
            ->assertJsonPath('profile', 'Profil de test')
            ->assertJsonPath('decision.convergenceScore', 70)
            ->assertJsonPath('decision.validationThreshold', 75)
            ->assertJsonPath('decision.convergencePasses', false)
            ->assertJsonPath('decision.convergenceStep', false)
            ->assertJsonPath('decision.shouldAlert', true);

        Setting::query()->where('key', 'rules.convergence_enabled')->update(['value' => '1']);
        $this->postJson(route('admin.rule-test'), $payload)
            ->assertOk()
            ->assertJsonPath('decision.convergenceStep', true)
            ->assertJsonPath('decision.shouldAlert', false)
            ->assertJson(fn (AssertableJson $json) => $json->where('decision.reason', fn (string $reason): bool => str_starts_with($reason, 'Le score de convergence ne dépasse pas le seuil configuré.'))->etc());

        $this->postJson(route('admin.rule-test'), [...$payload, 'method_scores' => ['F121-C' => 82]])
            ->assertJsonPath('decision.convergencePasses', true)
            ->assertJsonPath('decision.shouldAlert', true);
    }

    public function test_convergence_step_is_disabled_by_default(): void
    {
        $this->assertDatabaseHas('settings', ['key' => 'rules.convergence_enabled', 'value' => '0']);
        $factory = app(RuleConfigurationFactory::class);

        $this->assertNotContains('convergence', $factory->pipeline(['rules.decision_pipeline' => [...RuleConfiguration::DEFAULT_PIPELINE, 'convergence']]));
        $this->assertSame('convergence', last($factory->pipeline(['rules.convergence_enabled' => true])));

        $this->assertDatabaseHas('settings', ['key' => 'rules.minutes_remaining_enabled', 'value' => '0']);
        $this->assertNotContains('minutes_remaining', $factory->pipeline([]));
        $this->assertSame(['F121-E2', 'minutes_remaining', 'F121-D'], array_slice($factory->pipeline(['rules.minutes_remaining_enabled' => true]), 0, 3));
    }

    public function test_admin_api_is_protected(): void
    {
        auth()->logout();

        $this->getJson(route('admin.api.dashboard'))->assertUnauthorized();
    }
}
