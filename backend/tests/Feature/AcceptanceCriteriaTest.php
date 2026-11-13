<?php

namespace Tests\Feature;

use App\Models\Alert;
use App\Models\OpportunityLog;
use App\Models\RuleProfile;
use App\Models\TrackedMatch;
use App\Models\User;
use App\Rules\RuleConfiguration;
use App\Services\ScanService;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/**
 * Critères d’acceptation du CDC Phase 1 (section 8) vérifiables automatiquement, avec les pilotes fictifs.
 * Procédures manuelles complémentaires : docs/CONFORMITE_PHASE1.md.
 */
class AcceptanceCriteriaTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config([
            'services.pronofoot.football_driver' => 'fake',
            'services.pronofoot.odds_driver' => 'fake',
            'services.pronofoot.fake_scenario' => 'baseline',
            'services.pronofoot.notifications.mode' => 'fake',
            'services.pronofoot.notifications.channel' => 'log',
            'services.pronofoot.notifications.fallback' => 'none',
            'services.pronofoot.notifications.fake_fail_channels' => [],
        ]);
        RuleProfile::query()->create([
            'name' => 'Profil d’acceptation',
            'is_active' => true,
            'settings' => ['active_rules' => RuleConfiguration::DEFINED_RULES, 'method_weights' => []],
        ]);
    }

    public function test_alert_is_delivered_through_the_log_channel_less_than_60_seconds_after_detection(): void
    {
        $match = $this->track('fake-candidate');
        $this->fallingReference($match);

        $started = hrtime(true);
        $result = app(ScanService::class)->runOnce();
        $elapsedSeconds = (hrtime(true) - $started) / 1e9;

        $alert = Alert::query()->with('opportunityLog')->sole();
        $this->assertSame(1, $result->alertsCreated);
        $this->assertSame('sent', $alert->status);
        $this->assertSame('log', $alert->channel);
        $this->assertLessThan(60, CarbonImmutable::instance($alert->opportunityLog->evaluated_at)->diffInSeconds($alert->sent_at, true));
        $this->assertLessThan(60, $elapsedSeconds, 'Détection et envoi dans le même passage.');
    }

    /**
     * @return array<string, array{string, string}>
     */
    public static function refusedFilters(): array
    {
        return [
            'écart' => ['fake-gap-refusal', 'gap'],
            'vitalité' => ['fake-vitality-refusal', 'vitality'],
            'tendance' => ['fake-trend-unavailable', 'trend'],
        ];
    }

    #[DataProvider('refusedFilters')]
    public function test_no_alert_when_a_filter_is_refused_and_the_refusal_is_written_in_the_journal(string $providerMatchId, string $filter): void
    {
        $match = $this->track($providerMatchId);
        if ($filter !== 'trend') {
            $this->fallingReference($match);
        }

        app(ScanService::class)->runOnce();

        $log = OpportunityLog::query()->where('tracked_match_id', $match->id)->where('event_type', 'evaluation')->sole();
        $this->assertSame(0, Alert::query()->count());
        $this->assertSame('no_alert', $log->decision);
        $this->assertFalse($log->filter_results[$filter]['passed']);
        $this->assertNotEmpty($log->filter_results[$filter]['reason']);
        $this->assertNotEmpty($log->reason);
    }

    public function test_journal_gives_the_success_rate_per_rule(): void
    {
        $match = $this->track('fake-candidate');
        foreach ([['F121-E1', 'won'], ['F121-E1', 'lost'], ['F121-D', 'won'], ['F121-D', null]] as [$rule, $outcome]) {
            $log = OpportunityLog::query()->create([
                'tracked_match_id' => $match->id,
                'event_type' => 'evaluation',
                'rule_id' => $rule,
                'decision' => 'alert',
                'rule_results' => [],
                'filter_results' => [],
                'reason' => 'Alerte de test.',
                'evaluated_at' => now(),
                'outcome' => $outcome,
            ]);
            $log->alert()->create(['channel' => 'log', 'status' => 'sent', 'message' => 'Test', 'expires_at' => now()]);
        }

        $this->actingAs(User::factory()->create(['is_admin' => true]))
            ->getJson(route('admin.api.statistics'))
            ->assertOk()
            ->assertJsonPath('byRule.F121-E1.successRatePercent', 50)
            ->assertJsonPath('byRule.F121-D.successRatePercent', 100)
            ->assertJsonPath('byRule.F121-D.alerts', 2);
    }

    public function test_settings_changed_in_the_admin_page_apply_to_the_next_scan(): void
    {
        $match = $this->track('fake-candidate');
        $this->fallingReference($match);
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)->patchJson(route('admin.api.settings.update'), [
            'settings' => ['rules.minimum_vitality' => 70],
        ])->assertOk();
        app(ScanService::class)->runOnce();

        $log = OpportunityLog::query()->where('event_type', 'evaluation')->latest('id')->firstOrFail();
        $this->assertSame(70.0, (float) $log->filter_results['vitality']['details']['minimum']);
        $this->assertFalse($log->filter_results['vitality']['passed']);
        $this->assertSame(0, Alert::query()->count());

        $this->actingAs($admin)->patchJson(route('admin.api.settings.update'), [
            'settings' => ['rules.minimum_vitality' => 41],
        ])->assertOk();
        $match->forceFill(['last_scanned_at' => null])->save();
        $this->fallingReference($match);
        app(ScanService::class)->runOnce();

        $this->assertSame(1, Alert::query()->count());
    }

    private function track(string $providerMatchId): TrackedMatch
    {
        return TrackedMatch::query()->create([
            'provider' => 'fake',
            'provider_match_id' => $providerMatchId,
            'home_team' => 'Domicile',
            'away_team' => 'Extérieur',
            'is_active' => true,
        ]);
    }

    /**
     * Instantané de référence à −2 min dont toutes les cotes sont 20 % plus hautes : la cote suggérée baisse de plus de 5 %.
     */
    private function fallingReference(TrackedMatch $match): void
    {
        $fixture = json_decode((string) file_get_contents(database_path('fixtures/football.json')), true, flags: JSON_THROW_ON_ERROR);
        $data = collect($fixture['matches'])->firstWhere('id', $match->provider_match_id)['timeline'][0];
        $capturedAt = CarbonImmutable::now()->subMinutes(3);
        $match->snapshots()->create([
            'minute' => $data['football']['minute'],
            'home_score' => $data['football']['home_score'],
            'away_score' => $data['football']['away_score'],
            'exact_score_odds' => array_map(fn (float|int $odds): float => round($odds * 1.2, 2), $data['odds']['exact_score_odds']),
            'statistics' => [],
            'odds_captured_at' => $capturedAt,
            'captured_at' => $capturedAt,
        ]);
        $recent = CarbonImmutable::now()->subMinute();
        $match->snapshots()->create([
            'minute' => $data['football']['minute'],
            'home_score' => $data['football']['home_score'],
            'away_score' => $data['football']['away_score'],
            'exact_score_odds' => $data['odds']['exact_score_odds'],
            'statistics' => [],
            'odds_captured_at' => $recent,
            'captured_at' => $recent,
        ]);
    }
}
