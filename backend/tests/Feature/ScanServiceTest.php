<?php

namespace Tests\Feature;

use App\Jobs\SendAdminNotification;
use App\Jobs\SendAlertNotification;
use App\Models\Alert;
use App\Models\OpportunityLog;
use App\Models\RuleProfile;
use App\Models\Setting;
use App\Models\TrackedMatch;
use App\Notifications\NotificationDeliveryFailed;
use App\Notifications\NotificationDispatcher;
use App\Rules\RuleConfiguration;
use App\Services\ScanService;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class ScanServiceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Les scénarios fictifs déclenchent leur alerte par une baisse seule avec un écart de 1.10 : réglage désactivé ici
        // (il est testé dans StrongDropGapTest et TwoSidedScanTest).
        Setting::query()->where('key', 'rules.strong_drop_requires_gap')->update(['value' => '0']);
        config([
            'services.pronofoot.football_driver' => 'fake',
            'services.pronofoot.odds_driver' => 'fake',
            'services.pronofoot.fake_scenario' => 'baseline',
            'services.pronofoot.notifications.mode' => 'fake',
            'services.pronofoot.notifications.channel' => 'whatsapp',
            'services.pronofoot.notifications.fallback' => 'telegram',
            'services.pronofoot.notifications.fake_fail_channels' => [],
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
        $this->assertSame('strong_drop', $alert->opportunityLog->filter_results['trend']['details']['trend']);
        $this->assertDatabaseCount('alerts', 1);
        $this->assertDatabaseHas('opportunity_logs', [
            'tracked_match_id' => TrackedMatch::query()->firstOrFail()->id,
            'decision' => 'duplicate_suppressed',
        ]);
        $this->assertSame('sent', Alert::query()->firstOrFail()->status);
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

    public function test_post_goal_window_follows_the_complement_4(): void
    {
        $match = $this->trackedMatch('fake-goal-during-scan');
        $this->activeProfile();
        $beforeGoal = CarbonImmutable::now()->subMinutes(3);
        $match->snapshots()->create([
            'minute' => 40,
            'home_score' => 0,
            'away_score' => 0,
            'exact_score_odds' => ['0-0' => 7.5, '1-0' => 8.6, '0-1' => 9.8, '2-0' => 9.6],
            'statistics' => [],
            'odds_captured_at' => $beforeGoal,
            'captured_at' => $beforeGoal,
        ]);
        $at = fn (int $seconds) => CarbonImmutable::setTestNow(CarbonImmutable::parse('2026-11-08 12:00:00')->addSeconds($seconds));
        $lastDecision = fn (): OpportunityLog => OpportunityLog::query()->where('event_type', 'evaluation')->latest('id')->firstOrFail();

        $goal = app(ScanService::class)->runOnce(1);
        $this->assertSame(1, $goal->goalsDetected);
        $this->assertSame(0, OpportunityLog::query()->where('event_type', 'evaluation')->count(), 'Relevé de la détection : attente de la première cote.');

        $at(15);
        $this->assertSame(0, app(ScanService::class)->runOnce(1)->alertsCreated, 'Premier relevé : écart 7.10 − 5.20 = 1.90 > 0.50, attente.');
        $this->assertStringContainsString('attente', $lastDecision()->reason);
        $this->assertSame(['score' => '2-0', 'odds' => 7.1], $match->fresh()->post_goal_references['home'], 'Point de départ = première cote post-but (pas la cote de 9.60 d’avant le but).');
        $this->assertSame('1-1', $match->fresh()->post_goal_references['away']['score'], 'L’équipe à l’extérieur a aussi son point de départ.');

        $at(30);
        $this->assertSame(0, app(ScanService::class)->runOnce(1)->alertsCreated, 'Cote stable depuis 7.10 : abstention ; l’écart ne redéclenche rien.');
        $this->assertStringContainsString('fenêtre après un but', $lastDecision()->reason);

        $at(45);
        $this->assertSame(1, app(ScanService::class)->runOnce(2)->alertsCreated, '7.10 → 6.70 = −5.6 % depuis la première cote post-but.');
        $this->assertSame('F162-Bis', $lastDecision()->rule_id);
        $this->assertEqualsWithDelta(-5.63, (float) $lastDecision()->matchSnapshot->odds_change_percent, 0.01);

        $at(60);
        $secondGoal = app(ScanService::class)->runOnce(3);
        $this->assertSame(1, $secondGoal->goalsDetected, 'Second but pendant la fenêtre.');
        $this->assertNull($match->fresh()->post_goal_references, 'Nouvelle fenêtre : les points de départ repartent du nouveau but.');
        $this->assertSame('invalidated', Alert::query()->sole()->status);

        $at(75);
        $this->assertSame(1, app(ScanService::class)->runOnce(3)->alertsCreated, 'Premier relevé après le second but : écart exactement 0, alerte Haute.');
        $this->assertSame('F121-C', $lastDecision()->rule_id, '2-0 : prochain but à domicile, écart 3.00 − 3.00 = 0 (alerte haute au premier relevé).');
        $this->assertSame('home', $lastDecision()->selection);
        $this->assertStringContainsString('ALERTE HAUTE', Alert::query()->latest('id')->firstOrFail()->message);

        $this->assertSame(9.6, (float) $match->snapshots()->where('captured_at', '<', CarbonImmutable::parse('2026-11-08 12:00:00'))->sole()->exact_score_odds['2-0'], 'L’historique d’avant le but est conservé.');
        $this->assertSame(7, $match->snapshots()->count(), 'Un relevé d’avant le but et six relevés : rien n’est supprimé.');
    }

    public function test_after_the_post_goal_window_the_normal_order_resumes_with_post_goal_odds(): void
    {
        $match = $this->trackedMatch('fake-goal-during-scan');
        $this->activeProfile();
        $match->snapshots()->create([
            'minute' => 40,
            'home_score' => 0,
            'away_score' => 0,
            'exact_score_odds' => ['0-0' => 7.5, '1-0' => 8.6, '0-1' => 9.8, '2-0' => 9.6],
            'statistics' => [],
            'odds_captured_at' => CarbonImmutable::now()->subMinutes(3),
            'captured_at' => CarbonImmutable::now()->subMinutes(3),
        ]);

        app(ScanService::class)->runOnce(1);
        CarbonImmutable::setTestNow('2026-11-08 12:00:15');
        app(ScanService::class)->runOnce(1);
        CarbonImmutable::setTestNow('2026-11-08 12:02:30');
        app(ScanService::class)->runOnce(1);

        $decision = OpportunityLog::query()->where('event_type', 'evaluation')->latest('id')->firstOrFail();
        $this->assertSame(0.0, (float) $decision->matchSnapshot->odds_change_percent, 'Tendance sur 2 minutes avec des cotes postérieures au but (7.10 → 7.10), pas 9.60.');
        $this->assertStringContainsString('Domicile (2-0) : cote 7.10, écart +1.90, tendance 0 % → abstention (écart supérieur au seuil d’abstention (F121-G))', $decision->reason, 'Ordre normal : l’écart 1.90 donne F121-G.');
    }

    public function test_journal_has_one_line_when_a_match_enters_and_one_when_it_leaves_no_scan(): void
    {
        $match = $this->trackedMatch('fake-gap-refusal');
        $this->activeProfile();
        Setting::query()->where('key', 'scan.no_scan_gap_threshold')->update(['value' => '1.50']);

        app(ScanService::class)->runOnce();
        foreach ([30, 60, 90] as $seconds) {
            CarbonImmutable::setTestNow(CarbonImmutable::parse('2026-11-08 12:00:00')->addSeconds($seconds));
            app(ScanService::class)->runOnce();
        }

        $paused = OpportunityLog::query()->where('event_type', 'scan_paused')->get();
        $this->assertCount(1, $paused, 'Écart 2.00 > 1.50 : une seule ligne malgré plusieurs passages.');
        $this->assertStringContainsString('à confirmer', $paused->sole()->reason);
        $this->assertNotNull($match->fresh()->no_scan_since);

        Setting::query()->where('key', 'scan.no_scan_gap_threshold')->update(['value' => '2.50']);
        CarbonImmutable::setTestNow('2026-11-08 12:02:00');
        app(ScanService::class)->runOnce();
        CarbonImmutable::setTestNow('2026-11-08 12:02:30');
        app(ScanService::class)->runOnce();

        $this->assertSame(1, OpportunityLog::query()->where('event_type', 'scan_resumed')->count());
        $this->assertNull($match->fresh()->no_scan_since);
    }

    public function test_admin_is_told_when_a_sent_alert_expires_but_not_for_an_unsent_one(): void
    {
        Bus::fake([SendAdminNotification::class]);
        $match = $this->trackedMatch('fake-candidate');
        foreach (['sent', 'queued'] as $status) {
            OpportunityLog::query()->create([
                'tracked_match_id' => $match->id,
                'event_type' => 'evaluation',
                'rule_id' => 'F121-E1',
                'decision' => 'alert',
                'rule_results' => [],
                'filter_results' => [],
                'reason' => 'Alerte de test.',
                'evaluated_at' => CarbonImmutable::now()->subMinutes(16),
            ])->alert()->create([
                'channel' => 'log',
                'status' => $status,
                'message' => 'Alerte',
                'expires_at' => CarbonImmutable::now()->subMinute(),
            ]);
        }

        app(ScanService::class)->runOnce();

        Bus::assertDispatchedTimes(SendAdminNotification::class, 1);
        Bus::assertDispatched(SendAdminNotification::class, fn (SendAdminNotification $job): bool => str_contains($job->body, 'ALERTE EXPIRÉE')
            && str_contains($job->body, 'Home - Away')
            && str_contains($job->body, 'F121-E1'));
    }

    public function test_admin_is_told_when_a_goal_cancels_a_sent_alert(): void
    {
        Bus::fake([SendAdminNotification::class]);
        $match = $this->trackedMatch('fake-goal-during-scan');
        $this->referenceSnapshot($match, CarbonImmutable::now()->subMinutes(2));
        $this->activeProfile();
        $scanner = app(ScanService::class);

        $scanner->runOnce(0);
        $this->assertSame('sent', Alert::query()->sole()->status);
        $scanner->runOnce(1);

        Bus::assertDispatched(SendAdminNotification::class, fn (SendAdminNotification $job): bool => str_contains($job->body, 'BUT MARQUÉ · analyse relancée')
            && str_contains($job->body, '0-0 → 1-0'));
    }

    public function test_with_the_plancher_pause_scan_the_original_e2_signal_is_logged_without_deciding(): void
    {
        $match = $this->trackedMatch('fake-halftime-signal');
        $this->activeProfile(['F121-E2', 'F121-D', 'F121-C', 'F121-C.2', 'F121-E1']);

        app(ScanService::class)->runOnce();

        $log = OpportunityLog::query()->where('tracked_match_id', $match->id)->where('event_type', 'evaluation')->sole();
        $this->assertSame('no_alert', $log->decision);
        $this->assertStringContainsString('journalisé sans décider', $log->reason);
        $this->assertSame(0, OpportunityLog::query()->where('rule_id', 'F121-E2')->where('decision', 'alert')->count());
    }

    public function test_halftime_match_only_receives_the_f121_e2_signal(): void
    {
        // Scan Plancher de la pause désactivé : F121-E2 décide comme avant.
        Setting::query()->where('key', 'plancher.scan_pause_enabled')->update(['value' => '0']);
        $match = $this->trackedMatch('fake-halftime-signal');
        $this->activeProfile(['F121-E2', 'F121-D', 'F121-C', 'F121-C.2', 'F121-E1']);

        $result = app(ScanService::class)->runOnce();
        $log = OpportunityLog::query()->where('decision', 'alert')->sole();

        $this->assertSame(1, $result->alertsCreated);
        $this->assertSame('F121-E2', $log->rule_id);
        $this->assertSame('Over 0.5 buts en 2ème mi-temps', $log->suggested_action);
        $this->assertStringContainsString('SIGNAL MI-TEMPS', Alert::query()->sole()->message);
        $this->assertSame(9, $match->snapshots()->sole()->statistics['shots']);
    }

    public function test_trend_settings_follow_the_client_annex(): void
    {
        $this->assertSame('cote_suggeree', Setting::query()->where('key', 'tendance_source')->firstOrFail()->value);
        $this->assertSame('5', Setting::query()->where('key', 'tendance_seuil_stable')->firstOrFail()->value);
        $this->assertSame('41', Setting::query()->where('key', 'rules.minimum_vitality')->firstOrFail()->value);
        $this->assertSame('8.00', Setting::query()->where('key', 'rules.upcoming_score_odds_limit')->firstOrFail()->value);
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

    public function test_notification_job_records_a_successful_telegram_fallback(): void
    {
        $match = $this->trackedMatch('fake-candidate');
        $this->referenceSnapshot($match, CarbonImmutable::now()->subMinutes(2));
        $this->activeProfile();
        config(['services.pronofoot.notifications.fake_fail_channels' => ['whatsapp']]);

        app(ScanService::class)->runOnce();
        $alert = Alert::query()->firstOrFail();

        $this->assertSame('sent', $alert->status);
        $this->assertSame('telegram', $alert->channel);
        $this->assertTrue($alert->fallback_used);
        $this->assertNull($alert->failure_reason);
    }

    public function test_notification_job_records_failure_after_primary_and_fallback_fail(): void
    {
        Queue::fake();
        $match = $this->trackedMatch('fake-candidate');
        $this->referenceSnapshot($match, CarbonImmutable::now()->subMinutes(2));
        $this->activeProfile();
        config(['services.pronofoot.notifications.fake_fail_channels' => ['whatsapp', 'telegram']]);

        app(ScanService::class)->runOnce();
        $alert = Alert::query()->firstOrFail();
        $job = new SendAlertNotification($alert->id);

        try {
            $job->handle(app(NotificationDispatcher::class));
            $this->fail('Le canal principal et le repli auraient dû échouer.');
        } catch (NotificationDeliveryFailed $exception) {
            $job->failed($exception);
        }

        $this->assertSame('failed', $alert->fresh()->status);
        $this->assertSame(
            'Échec du canal principal whatsapp et du canal de repli telegram.',
            $alert->fresh()->failure_reason,
        );
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

    /**
     * @param  list<string>  $activeRules
     */
    private function activeProfile(array $activeRules = RuleConfiguration::DEFINED_RULES): RuleProfile
    {
        return RuleProfile::query()->create([
            'name' => 'Fake scan test',
            'is_active' => true,
            'settings' => [
                'active_rules' => $activeRules,
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
            'exact_score_odds' => ['0-0' => 8.6, '1-0' => 10.0, '0-1' => 9.8],
            'second_half_over_under_odds' => [],
            'statistics' => [],
            'odds_captured_at' => $capturedAt,
            'captured_at' => $capturedAt,
        ]);
    }
}
