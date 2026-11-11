<?php

namespace Tests\Feature;

use App\Models\OpportunityLog;
use App\Models\RuleProfile;
use App\Models\TrackedMatch;
use App\Models\User;
use App\Providers\Contracts\FootballProvider;
use App\Providers\Contracts\OddsProvider;
use App\Providers\Data\FootballFeed;
use App\Providers\Data\FootballMatch;
use App\Providers\Data\OddsFeed;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
            ->assertJsonCount(7, 'matches')
            ->assertJsonPath('matches.6.status', 'upcoming')
            ->assertJsonPath('matches.0.exactScoreMarketAvailable', true)
            ->assertJsonPath('matches.0.statisticsCoverage', true)
            ->assertJsonPath('matches.5.statisticsCoverage', null);
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

        $this->assertDatabaseHas('settings', [
            'key' => 'ecart_negatif_comportement',
            'value' => null,
            'needs_confirmation' => true,
        ]);
        $this->patchJson(route('admin.api.settings.update'), [
            'settings' => ['ecart_negatif_comportement' => ''],
        ])->assertOk();

        $this->postJson(route('admin.api.settings.reset'))->assertOk();
        $this->assertDatabaseHas('settings', ['key' => 'tendance_source', 'value' => null]);
        $this->assertDatabaseHas('settings', ['key' => 'tendance_seuil_stable', 'value' => null]);
        $this->assertDatabaseHas('settings', ['key' => 'ecart_negatif_comportement', 'value' => null]);
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

    public function test_admin_api_is_protected(): void
    {
        auth()->logout();

        $this->getJson(route('admin.api.dashboard'))->assertUnauthorized();
    }
}
