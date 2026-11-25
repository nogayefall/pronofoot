<?php

namespace Tests\Feature;

use App\Models\Alert;
use App\Models\AlertOption;
use App\Models\MatchSnapshot;
use App\Models\OpportunityLog;
use App\Models\RuleProfile;
use App\Models\TrackedMatch;
use App\Models\User;
use App\Rules\RuleConfiguration;
use App\Services\ScanService;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

/**
 * Résultat automatique des alertes par option, à la fin du match, et correction manuelle.
 */
class AlertResultsTest extends TestCase
{
    use RefreshDatabase;

    /** @var array{0: string, 1: string, 2: int, 3: int, 4: int}|null Statut court, long, minute, score domicile, extérieur. */
    private ?array $live = null;

    /** @var list<array<string, mixed>> */
    private array $events = [];

    /** @var array{0: string, 1: int, 2: int, 3: int}|null Statut, score domicile, extérieur, minute (fixtures?ids=). */
    private ?array $final = null;

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
        CarbonImmutable::setTestNow('2026-11-22 20:00:00');
        RuleProfile::query()->create(['name' => 'Profil', 'is_active' => true, 'settings' => ['active_rules' => RuleConfiguration::DEFINED_RULES]]);
        $this->fakeApi();
    }

    protected function tearDown(): void
    {
        CarbonImmutable::setTestNow();
        parent::tearDown();
    }

    public function test_an_alert_records_its_targeted_and_neutral_options_pending(): void
    {
        $match = $this->match();
        $before = CarbonImmutable::now()->subMinutes(3);
        $match->snapshots()->create(['minute' => 60, 'home_score' => 1, 'away_score' => 1, 'exact_score_odds' => ['1-1' => 3.19, '2-1' => 3.10, '1-2' => 10.0], 'statistics' => [], 'odds_captured_at' => $before, 'captured_at' => $before]);
        $this->live = ['2H', 'Second Half', 62, 1, 1];

        app(ScanService::class)->runOnce(forceRefresh: true);

        $options = Alert::query()->sole()->options;
        $this->assertSame(['targeted', 'neutral'], $options->pluck('type')->all());
        $this->assertSame(['Prochain but Sénégal', 'Un but de plus dans le match'], $options->pluck('label')->all());
        $this->assertSame('2-1', $options[0]->score_key);
        $this->assertSame('Over 2.5', $options[1]->line);
        $this->assertSame(['pending', 'pending'], $options->pluck('outcome')->all());
        $this->assertSame(['unset', 'unset'], $options->pluck('decision')->all());
    }

    public function test_the_scan_stores_the_automatic_confidence_score_with_the_evaluation(): void
    {
        RuleProfile::query()->update(['settings' => ['active_rules' => RuleConfiguration::DEFINED_RULES, 'method_weights' => ['F121-E1' => 25, 'F121-C' => 20, 'F162-Bis' => 20, 'F121-D' => 15, 'F121-E2' => 10, 'F121-C.2' => 10], 'validation_threshold' => 55]]);
        $match = $this->match();
        $before = CarbonImmutable::now()->subMinutes(3);
        $match->snapshots()->create(['minute' => 60, 'home_score' => 1, 'away_score' => 1, 'exact_score_odds' => ['1-1' => 3.19, '2-1' => 3.10, '1-2' => 10.0], 'statistics' => [], 'odds_captured_at' => $before, 'captured_at' => $before]);
        $this->live = ['2H', 'Second Half', 62, 1, 1];

        app(ScanService::class)->runOnce(forceRefresh: true);

        // Grimsby – Cheltenham : écart −0.09 → E1 = 17.1 ; égalité → F121-C = 0. Le score ne bloque pas l’alerte.
        $log = OpportunityLog::query()->where('decision', 'alert')->sole();
        $this->assertSame(17.1, $log->confidence['rules']['F121-E1']['score']);
        $this->assertSame(0, $log->confidence['rules']['F121-C']['score']);
        $this->assertSame(55, $log->confidence['threshold']);
        $this->assertNotNull($log->confidence['score']);
        $this->actingAs(User::factory()->create(['is_admin' => true]))
            ->getJson(route('admin.api.journal.index'))
            ->assertJsonPath('data.0.confidence.rules.F121-E1.score', 17.1);
    }

    public function test_options_are_settled_automatically_at_full_time_without_extra_request(): void
    {
        [$match, $alert] = $this->alertAt(1, 1, 62);
        $this->snapshot($match, 2, 1, 75);
        $this->live = ['FT', 'Match Finished', 90, 2, 1];

        $this->scan();

        $options = $alert->fresh()->options;
        $this->assertSame(['won', 'won'], $options->pluck('outcome')->all(), 'Le Sénégal marque le prochain but ; un but de plus.');
        $this->assertSame(['auto', 'auto'], $options->pluck('outcome_source')->all());
        $this->assertSame('won', $alert->opportunityLog->fresh()->outcome, 'Résultat de l’alerte = option principale.');
        $this->assertFalse($this->sent('/fixtures/events'), 'Scores déjà relevés : aucune requête en plus.');
        $this->assertStringContainsString('Résultat automatique de 2 options.', OpportunityLog::query()->where('event_type', 'match_finished')->sole()->reason);
    }

    public function test_one_events_request_settles_two_goals_scored_between_readings(): void
    {
        [$match, $alert] = $this->alertAt(1, 1, 62);
        $this->snapshot($match, 2, 2, 78);
        $this->live = ['FT', 'Match Finished', 90, 2, 2];
        $this->events = [
            ['time' => ['elapsed' => 20], 'team' => ['name' => 'Sénégal'], 'type' => 'Goal', 'detail' => 'Normal Goal'],
            ['time' => ['elapsed' => 40], 'team' => ['name' => 'Soudan'], 'type' => 'Goal', 'detail' => 'Normal Goal'],
            ['time' => ['elapsed' => 70], 'team' => ['name' => 'Soudan'], 'type' => 'Goal', 'detail' => 'Penalty'],
            ['time' => ['elapsed' => 74], 'team' => ['name' => 'Soudan'], 'type' => 'Goal', 'detail' => 'Missed Penalty'],
            ['time' => ['elapsed' => 76], 'team' => ['name' => 'Sénégal'], 'player' => ['name' => 'Défenseur du Soudan'], 'type' => 'Goal', 'detail' => 'Own Goal'],
        ];

        $this->scan();

        $this->assertSame(1, Http::recorded()->filter(fn (array $pair): bool => str_contains($pair[0]->url(), '/fixtures/events'))->count(), 'Une seule requête d’événements.');
        $this->assertSame(['lost', 'won'], $alert->fresh()->options->pluck('outcome')->all(), 'Le Soudan a marqué le prochain but (penalty) avant le but contre son camp profitant au Sénégal.');
    }

    public function test_the_penalty_shootout_never_changes_the_result_of_an_option(): void
    {
        // Tirs au but : le champ goals reste au score de fin de prolongation (score.penalty à part) et les événements de
        // la séance (comments « Penalty Shootout », dans le désordre, comme dans la réponse réelle) sont ignorés.
        [$match, $alert] = $this->alertAt(1, 1, 100);
        $this->snapshot($match, 2, 2, 118);
        $this->snapshot($match, 2, 2, 120);
        $this->live = ['PEN', 'Match Finished', 120, 2, 2];
        $this->events = [
            ['time' => ['elapsed' => 20, 'extra' => null], 'team' => ['name' => 'Sénégal'], 'type' => 'Goal', 'detail' => 'Normal Goal', 'comments' => null],
            ['time' => ['elapsed' => 40, 'extra' => null], 'team' => ['name' => 'Soudan'], 'type' => 'Goal', 'detail' => 'Normal Goal', 'comments' => null],
            ['time' => ['elapsed' => 120, 'extra' => 8], 'team' => ['name' => 'Sénégal'], 'type' => 'Goal', 'detail' => 'Penalty', 'comments' => 'Penalty Shootout'],
            ['time' => ['elapsed' => 112, 'extra' => null], 'team' => ['name' => 'Soudan'], 'type' => 'Goal', 'detail' => 'Normal Goal', 'comments' => null],
            ['time' => ['elapsed' => 115, 'extra' => null], 'team' => ['name' => 'Sénégal'], 'type' => 'Goal', 'detail' => 'Normal Goal', 'comments' => null],
            ['time' => ['elapsed' => 120, 'extra' => 1], 'team' => ['name' => 'Soudan'], 'type' => 'Goal', 'detail' => 'Missed Penalty', 'comments' => 'Penalty Shootout'],
            ['time' => ['elapsed' => 120, 'extra' => 2], 'team' => ['name' => 'Sénégal'], 'type' => 'Goal', 'detail' => 'Penalty', 'comments' => 'Penalty Shootout'],
        ];

        $this->scan();

        $this->assertSame(['lost', 'won'], $alert->fresh()->options->pluck('outcome')->all(), 'Le Soudan marque le premier en prolongation (112e) ; les tirs au but réussis du Sénégal ne comptent pas.');
    }

    public function test_an_abandoned_match_cancels_the_options_which_stay_out_of_the_statistics(): void
    {
        [$match, $alert] = $this->alertAt(1, 1, 62);
        $this->snapshot($match, 2, 1, 70);
        $this->live = ['ABD', 'Match Abandoned', 72, 2, 1];

        $this->scan();

        $this->assertSame(['cancelled', 'cancelled'], $alert->fresh()->options->pluck('outcome')->all());
        $this->actingAs(User::factory()->create(['is_admin' => true]))
            ->getJson(route('admin.api.statistics'))
            ->assertJsonPath('byType.targeted.cancelled', 1)
            ->assertJsonPath('byType.targeted.successRatePercent', null);
    }

    public function test_a_manual_correction_and_decision_are_kept_and_feed_both_success_rates(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        [$match, $alert] = $this->alertAt(1, 1, 62);
        [$targeted, $neutral] = $alert->options->all();

        $this->actingAs($admin)->patchJson(route('admin.api.alert-options.update', $targeted), ['decision' => 'played', 'outcome' => 'lost'])
            ->assertOk()
            ->assertJsonPath('option.outcomeSource', 'manual')
            ->assertJsonPath('option.decision', 'played');
        $this->actingAs($admin)->patchJson(route('admin.api.alert-options.update', $neutral), ['decision' => 'ignored'])->assertOk();

        $this->snapshot($match, 2, 1, 75);
        $this->live = ['FT', 'Match Finished', 90, 2, 1];
        $this->scan();

        $this->assertSame('lost', $targeted->fresh()->outcome, 'Correction manuelle conservée malgré le calcul automatique.');
        $this->assertSame('manual', $targeted->fresh()->outcome_source);
        $this->assertSame('won', $neutral->fresh()->outcome);

        $this->actingAs($admin)->getJson(route('admin.api.journal.index'))
            ->assertJsonPath('data.0.alert', null)
            ->assertOk();
        $journal = $this->actingAs($admin)->getJson(route('admin.api.journal.index', ['status' => 'expired']))->json('data.0.alert.options');
        $this->assertSame(['lost', 'won'], array_column($journal, 'outcome'));
        $this->assertSame(['manual', 'auto'], array_column($journal, 'outcomeSource'));

        $this->actingAs($admin)->getJson(route('admin.api.statistics'))
            ->assertJsonPath('byRule.F121-E1.byType.targeted.successRatePercent', 0)
            ->assertJsonPath('byRule.F121-E1.byType.targeted.played.successRatePercent', 0)
            ->assertJsonPath('byRule.F121-E1.byType.neutral.successRatePercent', 100)
            ->assertJsonPath('byRule.F121-E1.byType.neutral.played.options', 0)
            ->assertJsonPath('byRule.F121-E1.byType.neutral.played.successRatePercent', null);
    }

    public function test_the_migration_gives_existing_alerts_their_options_with_the_manual_result(): void
    {
        $match = $this->match();
        $base = $this->snapshot($match, 1, 0, 50);
        $log = OpportunityLog::query()->create([
            'tracked_match_id' => $match->id, 'match_snapshot_id' => $base->id, 'event_type' => 'evaluation', 'rule_id' => 'F162-Bis',
            'selection' => 'home', 'decision' => 'alert', 'reason' => 'Ancienne alerte.', 'evaluated_at' => CarbonImmutable::now(), 'outcome' => 'won',
        ]);
        $log->alert()->create(['channel' => 'telegram', 'status' => 'expired', 'message' => "ALERTE CRITIQUE\nCote suggérée (2-0) : 3.50\nOption 2 (neutre) : un but de plus dans le match — Over 1.5, cote non disponible"]);

        $migration = require database_path('migrations/2026_11_22_100000_create_alert_options_table.php');
        (new \ReflectionMethod($migration, 'backfillExistingAlerts'))->invoke($migration);

        $options = AlertOption::query()->orderBy('position')->get();
        $this->assertSame(['targeted', 'neutral'], $options->pluck('type')->all());
        $this->assertSame(['won', 'pending'], $options->pluck('outcome')->all(), 'Résultat noté repris pour l’option ciblée.');
        $this->assertSame(['manual', null], $options->pluck('outcome_source')->all());
        $this->assertSame('2-0', $options[0]->score_key);
        $this->assertSame('Over 1.5', $options[1]->line);
    }

    private function scan(): void
    {
        app()->forgetInstance(ScanService::class);
        app(ScanService::class)->runOnce(forceRefresh: true);
    }

    public function test_a_match_missing_from_the_feed_is_settled_with_its_official_final_score(): void
    {
        // RB Leipzig – Lens : dernier relevé 2-1, but dans les dernières secondes, score officiel 3-1.
        [$match, $alert] = $this->alertAt(2, 1, 77);
        $this->snapshot($match, 2, 1, 90);
        $this->final = ['FT', 3, 1, 90];
        $match->forceFill(['missing_readings' => 3])->save();

        $this->scan();

        $this->assertFalse($match->fresh()->is_active);
        $this->assertSame(['won', 'won'], $alert->fresh()->options->pluck('outcome')->all());
        $this->assertSame(1, Http::recorded()->filter(fn (array $pair): bool => str_contains($pair[0]->url(), 'fixtures?ids='))->count());
    }

    public function test_the_last_reading_is_used_when_the_official_score_is_unavailable_or_not_final(): void
    {
        [$match, $alert] = $this->alertAt(2, 1, 77);
        $this->snapshot($match, 2, 1, 90);
        $this->final = ['2H', 3, 1, 90];
        $match->forceFill(['missing_readings' => 3])->save();

        $this->scan();

        $this->assertSame(['lost', 'lost'], $alert->fresh()->options->pluck('outcome')->all());
    }

    public function test_an_abandoned_match_missing_from_the_feed_cancels_the_options(): void
    {
        [$match, $alert] = $this->alertAt(2, 1, 77);
        $this->final = ['ABD', 2, 1, 80];
        $match->forceFill(['missing_readings' => 3])->save();

        $this->scan();

        $this->assertSame(['cancelled', 'cancelled'], $alert->fresh()->options->pluck('outcome')->all());
    }

    public function test_recalculation_only_changes_automatic_results_and_writes_nothing_without_apply(): void
    {
        // Neftchi – Al-Hilal : neutre Over 4.5 notée gagnée à tort (4 buts, puis 3, puis 4 au final).
        [$match, $alert] = $this->alertAt(2, 2, 59);
        $this->snapshot($match, 1, 2, 59);
        $this->snapshot($match, 2, 2, 90);
        $match->forceFill(['is_active' => false, 'ended_at' => now()])->save();
        $alert->options[0]->forceFill(['outcome' => 'won', 'outcome_source' => 'auto'])->save();
        $alert->options[1]->forceFill(['outcome' => 'won', 'outcome_source' => 'auto'])->save();
        $alert->opportunityLog->forceFill(['outcome' => 'won'])->save();
        $manual = $alert->options()->create(['position' => 3, 'type' => 'neutral', 'label' => 'Noté à la main', 'line' => 'Over 4.5', 'outcome' => 'won', 'outcome_source' => 'manual']);
        $pending = $alert->options()->create(['position' => 4, 'type' => 'neutral', 'label' => 'En attente', 'line' => 'Over 4.5', 'outcome' => 'pending']);
        $this->final = ['FT', 2, 2, 90];

        $this->artisan('results:recalculate')->expectsOutputToContain('Options modifiées : 1')->assertSuccessful();
        $this->assertSame('won', $alert->options[1]->fresh()->outcome, 'Simulation : rien n’est écrit.');

        $this->artisan('results:recalculate', ['--apply' => true])->expectsOutputToContain('Options modifiées : 1')->assertSuccessful();
        $this->assertSame('lost', $alert->options[1]->fresh()->outcome);
        $this->assertSame('auto', $alert->options[1]->fresh()->outcome_source);
        $this->assertSame('won', $alert->options[0]->fresh()->outcome);
        $this->assertSame('won', $alert->opportunityLog->fresh()->outcome);
        $this->assertSame(['won', 'manual'], [$manual->fresh()->outcome, $manual->fresh()->outcome_source]);
        $this->assertSame('pending', $pending->fresh()->outcome);

        $this->artisan('results:recalculate', ['--apply' => true])->expectsOutputToContain('Options modifiées : 0')->assertSuccessful();
    }

    public function test_recalculation_leaves_a_match_without_official_final_score_unchanged(): void
    {
        [$match, $alert] = $this->alertAt(2, 2, 59);
        $this->snapshot($match, 1, 2, 90);
        $match->forceFill(['is_active' => false, 'ended_at' => now()])->save();
        $alert->options[1]->forceFill(['outcome' => 'won', 'outcome_source' => 'auto'])->save();

        $this->artisan('results:recalculate', ['--apply' => true])->expectsOutputToContain('score final officiel indisponible')->assertSuccessful();

        $this->assertSame('won', $alert->options[1]->fresh()->outcome);
    }

    private function match(): TrackedMatch
    {
        return TrackedMatch::query()->create([
            'provider' => 'real',
            'provider_match_id' => '901',
            'home_team' => 'Sénégal',
            'away_team' => 'Soudan',
            'is_active' => true,
        ]);
    }

    /**
     * @return array{0: TrackedMatch, 1: Alert}
     */
    private function alertAt(int $home, int $away, int $minute): array
    {
        $match = $this->match();
        $base = $this->snapshot($match, $home, $away, $minute);
        $log = OpportunityLog::query()->create([
            'tracked_match_id' => $match->id,
            'match_snapshot_id' => $base->id,
            'event_type' => 'evaluation',
            'rule_id' => 'F121-E1',
            'selection' => 'home',
            'decision' => 'alert',
            'reason' => 'Alerte de test.',
            'evaluated_at' => CarbonImmutable::now(),
        ]);
        $alert = $log->alert()->create(['channel' => 'telegram', 'status' => 'sent', 'message' => 'ALERTE CRITIQUE', 'expires_at' => CarbonImmutable::now()->addMinutes(15)]);
        $alert->options()->create(['position' => 1, 'type' => 'targeted', 'label' => 'Prochain but Sénégal', 'side' => 'home', 'score_key' => ($home + 1).'-'.$away]);
        $alert->options()->create(['position' => 2, 'type' => 'neutral', 'label' => 'Un but de plus dans le match', 'line' => 'Over '.($home + $away).'.5']);

        return [$match, $alert->fresh(['options', 'opportunityLog'])];
    }

    private function snapshot(TrackedMatch $match, int $home, int $away, int $minute): MatchSnapshot
    {
        CarbonImmutable::setTestNow(CarbonImmutable::now()->addSeconds(30));

        return $match->snapshots()->create(['minute' => $minute, 'home_score' => $home, 'away_score' => $away, 'exact_score_odds' => null, 'statistics' => [], 'captured_at' => CarbonImmutable::now()]);
    }

    private function sent(string $path): bool
    {
        return Http::recorded()->contains(fn (array $pair): bool => str_contains($pair[0]->url(), $path));
    }

    private function fakeApi(): void
    {
        $headers = ['x-ratelimit-requests-remaining' => '5000', 'x-ratelimit-requests-limit' => '7500'];

        Http::fake(function (Request $request) use ($headers) {
            $url = $request->url();
            if (str_contains($url, '/fixtures/events')) {
                return Http::response(json_encode(['errors' => [], 'response' => $this->events], JSON_THROW_ON_ERROR), 200, $headers);
            }

            if (str_contains($url, '/fixtures/statistics')) {
                $payload = json_decode((string) file_get_contents(database_path('fixtures/api-football/fixtures-statistics-covered.json')), true, flags: JSON_THROW_ON_ERROR);
                $payload['response'][0]['team']['id'] = 9011;
                $payload['response'][1]['team']['id'] = 9012;

                return Http::response(json_encode($payload, JSON_THROW_ON_ERROR), 200, $headers);
            }

            if (str_contains($url, '/fixtures?ids=')) {
                return Http::response(json_encode(['errors' => [], 'response' => $this->final === null ? [] : [[
                    'fixture' => ['id' => 901, 'status' => ['short' => $this->final[0], 'long' => 'Match Finished', 'elapsed' => $this->final[3]]],
                    'goals' => ['home' => $this->final[1], 'away' => $this->final[2]],
                ]]], JSON_THROW_ON_ERROR), 200, $headers);
            }

            if (str_contains($url, '/fixtures')) {
                $live = $this->live === null ? [] : [[
                    'fixture' => ['id' => 901, 'date' => '2026-11-22T19:00:00+00:00', 'status' => ['short' => $this->live[0], 'long' => $this->live[1], 'elapsed' => $this->live[2]]],
                    'league' => ['id' => 1, 'name' => 'Ligue de test', 'season' => 2026],
                    'teams' => ['home' => ['id' => 9011, 'name' => 'Sénégal'], 'away' => ['id' => 9012, 'name' => 'Soudan']],
                    'goals' => ['home' => $this->live[3], 'away' => $this->live[4]],
                ]];

                return Http::response(json_encode(['errors' => [], 'response' => $live], JSON_THROW_ON_ERROR), 200, $headers);
            }

            if (str_contains($url, '/odds/live')) {
                return Http::response(json_encode(['errors' => [], 'response' => $this->live === null ? [] : [[
                    'fixture' => ['id' => 901, 'status' => ['long' => $this->live[1], 'elapsed' => $this->live[2]]],
                    'status' => ['stopped' => false, 'blocked' => false, 'finished' => false],
                    'teams' => ['home' => ['goals' => $this->live[3]], 'away' => ['goals' => $this->live[4]]],
                    'odds' => [['id' => 23, 'name' => 'Final Score', 'values' => [
                        ['value' => '1-1', 'odd' => '3.19', 'suspended' => false],
                        ['value' => '2-1', 'odd' => '3.10', 'suspended' => false],
                        ['value' => '1-2', 'odd' => '10.00', 'suspended' => false],
                    ]]],
                ]]], JSON_THROW_ON_ERROR), 200, $headers);
            }

            return Http::response('', 404);
        });
    }
}
