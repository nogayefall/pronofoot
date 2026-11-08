<?php

namespace Tests\Feature;

use App\Models\Alert;
use App\Models\OpportunityLog;
use App\Models\RuleProfile;
use App\Models\TrackedMatch;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DatabaseModelsTest extends TestCase
{
    use RefreshDatabase;

    public function test_phase_one_records_are_persisted_and_related(): void
    {
        $match = TrackedMatch::create([
            'provider' => 'fake',
            'provider_match_id' => 'match-001',
            'home_team' => 'Home',
            'away_team' => 'Away',
            'is_active' => true,
        ]);

        $snapshot = $match->snapshots()->create([
            'minute' => 32,
            'home_score' => 0,
            'away_score' => 0,
            'exact_score_odds' => ['0-0' => 7.5, '1-0' => 8.6],
            'statistics' => ['shots' => 4],
            'captured_at' => now(),
        ]);

        $profile = RuleProfile::create([
            'name' => 'Test profile',
            'is_active' => true,
            'settings' => ['threshold' => 75],
        ]);

        $log = OpportunityLog::create([
            'tracked_match_id' => $match->id,
            'match_snapshot_id' => $snapshot->id,
            'rule_profile_id' => $profile->id,
            'event_type' => 'evaluation',
            'decision' => 'no_alert',
            'rule_results' => ['F121-C' => ['verdict' => 'observe']],
            'filter_results' => ['trend' => false],
            'reason' => 'A filter did not pass.',
            'evaluated_at' => now(),
        ]);

        $alert = Alert::create([
            'opportunity_log_id' => $log->id,
            'channel' => 'fake',
            'status' => 'queued',
            'message' => 'Test signal',
            'expires_at' => now()->addMinutes(15),
        ]);

        $this->assertSame(7.5, $snapshot->fresh()->exact_score_odds['0-0']);
        $this->assertSame('Home', $snapshot->trackedMatch->home_team);
        $this->assertSame(75, $log->ruleProfile->settings['threshold']);
        $this->assertTrue($match->fresh()->opportunityLogs->contains('id', $log->id));
        $this->assertSame($log->id, $alert->opportunityLog->id);
    }
}
