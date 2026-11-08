<?php

namespace Tests\Feature;

use App\Models\Alert;
use App\Models\OpportunityLog;
use App\Models\RuleProfile;
use App\Models\Setting;
use App\Models\TrackedMatch;
use App\Services\ScanService;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;

class ScanServiceTest extends TestCase
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
        CarbonImmutable::setTestNow('2026-11-08 12:00:00');
    }

    protected function tearDown(): void
    {
        CarbonImmutable::setTestNow();
        parent::tearDown();
    }

    public function test_scan_creates_a_fake_signal_and_suppresses_active_duplicates(): void
    {
        $match = $this->trackedMatch('fake-candidate');
        $this->referenceSnapshot($match, CarbonImmutable::now()->subMinutes(2));
        $this->activeProfile();
        $scanner = app(ScanService::class);

        $first = $scanner->runOnce();
        $second = $scanner->runOnce();
        $snapshot = $match->snapshots()->latest('captured_at')->firstOrFail();
        $alert = Alert::query()->firstOrFail();

        $this->assertSame(1, $first->snapshotsStored);
        $this->assertSame(1, $first->alertsCreated);
        $this->assertSame(0, $first->errors);
        $this->assertSame(0, $second->alertsCreated);
        $this->assertEqualsWithDelta(-14.0, $snapshot->odds_change_percent, 0.001);
        $this->assertSame('falling', $alert->opportunityLog->filter_results['trend']['details']['trend']);
        $this->assertDatabaseCount('alerts', 1);
        $this->assertDatabaseHas('opportunity_logs', [
            'tracked_match_id' => TrackedMatch::query()->firstOrFail()->id,
            'decision' => 'duplicate_suppressed',
        ]);
        $this->assertSame('queued', Alert::query()->firstOrFail()->status);
    }

    public function test_scan_abstains_when_the_reference_snapshot_is_younger_than_two_minutes(): void
    {
        $match = $this->trackedMatch('fake-candidate');
        $this->referenceSnapshot($match, CarbonImmutable::now()->subSeconds(119));
        $this->activeProfile();

        $result = app(ScanService::class)->runOnce();
        $snapshot = $match->snapshots()->latest('captured_at')->firstOrFail();

        $this->assertSame(0, $result->alertsCreated);
        $this->assertNull($snapshot->odds_change_percent);
        $this->assertFalse(OpportunityLog::query()->firstOrFail()->filter_results['trend']['passed']);
        $this->assertSame(0, Alert::query()->count());
    }

    public function test_scan_abstains_when_no_reference_snapshot_exists(): void
    {
        $match = $this->trackedMatch('fake-candidate');
        $this->activeProfile();

        $result = app(ScanService::class)->runOnce();
        $snapshot = $match->snapshots()->latest('captured_at')->firstOrFail();

        $this->assertSame(0, $result->alertsCreated);
        $this->assertNull($snapshot->odds_change_percent);
        $this->assertFalse(OpportunityLog::query()->firstOrFail()->filter_results['trend']['passed']);
        $this->assertSame(0, Alert::query()->count());
    }

    public function test_scan_abstains_when_trend_source_is_not_a_suggested_exact_score(): void
    {
        $match = $this->trackedMatch('fake-candidate');
        $this->referenceSnapshot($match, CarbonImmutable::now()->subMinutes(2));
        $this->activeProfile();
        config(['services.pronofoot.fake_scenario' => 'baseline']);

        Setting::query()->where('key', 'tendance_source')->update(['value' => '']);

        $result = app(ScanService::class)->runOnce();

        $this->assertSame(0, $result->alertsCreated);
        $this->assertNull($match->snapshots()->latest('captured_at')->firstOrFail()->odds_change_percent);
        $this->assertSame(0, Alert::query()->count());
    }

    public function test_trend_settings_are_persisted_empty_until_client_confirmation(): void
    {
        $this->assertNull(Setting::query()->where('key', 'tendance_source')->firstOrFail()->value);
        $this->assertNull(Setting::query()->where('key', 'tendance_seuil_stable')->firstOrFail()->value);
    }

    public function test_detected_goal_invalidates_alert_and_shortens_the_poll_interval(): void
    {
        $match = $this->trackedMatch('fake-goal-during-scan');
        $this->referenceSnapshot($match, CarbonImmutable::now()->subMinutes(2));
        $this->activeProfile();
        $scanner = app(ScanService::class);

        $first = $scanner->runOnce(0);
        $afterGoal = $scanner->runOnce(1);

        $this->assertSame(1, $first->alertsCreated);
        $this->assertSame(1, $afterGoal->goalsDetected);
        $this->assertSame(15, $afterGoal->nextPollIntervalSeconds);
        $this->assertSame('invalidated', Alert::query()->firstOrFail()->status);
        $this->assertSame(1, $match->fresh()->snapshots()->latest('captured_at')->firstOrFail()->home_score);
        $this->assertDatabaseHas('opportunity_logs', ['event_type' => 'alert_invalidated']);
    }

    public function test_alert_expires_after_configured_duration(): void
    {
        $match = $this->trackedMatch('fake-candidate');
        $this->referenceSnapshot($match, CarbonImmutable::now()->subMinutes(2));
        $this->activeProfile();
        $scanner = app(ScanService::class);

        $scanner->runOnce();
        CarbonImmutable::setTestNow(CarbonImmutable::now()->addMinutes(16));
        $result = $scanner->runOnce();

        $this->assertSame(1, $result->alertsExpired);
        $this->assertSame('expired', Alert::query()->orderBy('id')->firstOrFail()->status);
        $this->assertDatabaseHas('opportunity_logs', ['event_type' => 'alert_expired']);
    }

    public function test_provider_outage_is_logged_and_does_not_create_snapshots_or_alerts(): void
    {
        $match = $this->trackedMatch('fake-candidate');
        $this->activeProfile();
        config(['services.pronofoot.fake_scenario' => 'api_outage']);

        $result = app(ScanService::class)->runOnce();

        $this->assertSame(1, $result->errors);
        $this->assertSame(0, $result->snapshotsStored);
        $this->assertSame(0, $match->snapshots()->count());
        $this->assertSame(0, Alert::query()->count());
        $this->assertDatabaseHas('opportunity_logs', ['event_type' => 'football_provider_unavailable']);
    }

    public function test_unavailable_exact_score_market_is_reported_without_creating_an_alert(): void
    {
        $this->trackedMatch('fake-candidate');
        $this->activeProfile();
        config(['services.pronofoot.odds_driver' => 'real']);

        $result = app(ScanService::class)->runOnce();
        $incident = OpportunityLog::query()->where('event_type', 'odds_market_unavailable')->firstOrFail();

        $this->assertSame(1, $result->errors);
        $this->assertSame(0, $result->alertsCreated);
        $this->assertStringContainsString('Marché des scores exacts non disponible', $incident->reason);
        $this->assertSame(0, Alert::query()->count());
    }

    public function test_missing_statistics_prevent_the_alert(): void
    {
        $this->trackedMatch('fake-missing-statistics');
        $this->activeProfile();

        $result = app(ScanService::class)->runOnce();

        $this->assertSame(0, $result->alertsCreated);
        $this->assertSame('no_alert', OpportunityLog::query()->firstOrFail()->decision);
        $this->assertFalse(OpportunityLog::query()->firstOrFail()->filter_results['vitality']['passed']);
    }

    public function test_scan_run_command_supports_a_bounded_fake_execution(): void
    {
        $this->assertSame(0, Artisan::call('scan:run', ['--max-passes' => 1]));
    }

    private function trackedMatch(string $providerMatchId): TrackedMatch
    {
        return TrackedMatch::query()->create([
            'provider' => 'fake',
            'provider_match_id' => $providerMatchId,
            'home_team' => 'Home',
            'away_team' => 'Away',
            'is_active' => true,
        ]);
    }

    private function activeProfile(): RuleProfile
    {
        return RuleProfile::query()->create([
            'name' => 'Fake scan test',
            'is_active' => true,
            'settings' => [
                'active_rules' => ['F121-C'],
                'method_weights' => ['F121-C' => 1],
            ],
        ]);
    }

    private function referenceSnapshot(TrackedMatch $match, CarbonImmutable $capturedAt): void
    {
        $match->snapshots()->create([
            'minute' => 28,
            'home_score' => 0,
            'away_score' => 0,
            'exact_score_odds' => ['0-0' => 7.5, '1-0' => 10.0, '0-1' => 9.8],
            'second_half_over_under_odds' => [],
            'statistics' => [],
            'odds_captured_at' => $capturedAt,
            'captured_at' => $capturedAt,
        ]);
    }
}
