<?php

namespace Tests\Feature;

use App\Jobs\SendAlertNotification;
use App\Models\Alert;
use App\Models\OpportunityLog;
use App\Models\RuleProfile;
use App\Models\Setting;
use App\Models\TrackedMatch;
use App\Models\User;
use App\Rules\RuleConfiguration;
use App\Services\GoalFloorScanService;
use App\Services\ScanService;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

/**
 * Mode Plancher pendant le scan réel : trois scans par match (départ, pause, soixante), Journal, alerte Telegram,
 * déduplication et résultat automatique des paris central et prudent.
 */
class GoalFloorScanTest extends TestCase
{
    use RefreshDatabase;

    /** Getafe – Atlético, pause 0-2 (annexe « Quoi coder v2 »). */
    private const GETAFE = [
        '0-2' => '4.25', '0-3' => '3.75', '1-2' => '7.00', '1-3' => '7.00', '0-4' => '7.00',
        '2-2' => '13.00', '1-4' => '15.00', '0-5' => '17.00', '2-3' => '21.00', '0-1' => '5.00',
    ];

    /** @var array{0: string, 1: string, 2: int, 3: int, 4: int} Statut court, long, minute, score domicile, extérieur. */
    private array $live = ['HT', 'Halftime', 45, 0, 2];

    /** @var array<string, string> */
    private array $exactScores = self::GETAFE;

    /** @var array<int, list<array{0: string, 1: string, 2: string}>> Valeurs Over/Under par pari (25, 36). */
    private array $lines = [
        25 => [['Over', '3.5', '2.064'], ['Under', '3.5', '1.75'], ['Over', '2.5', '1.225'], ['Under', '2.5', '4.00'], ['Under', '4.5', '1.22']],
        36 => [['Over', '4.5', '4.20'], ['Under', '4.5', '1.25'], ['Over', '4.25', '3.60']],
    ];

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
        CarbonImmutable::setTestNow('2026-11-23 20:00:00');
        RuleProfile::query()->create(['name' => 'v11', 'is_active' => true, 'settings' => ['active_rules' => RuleConfiguration::DEFINED_RULES]]);
        $this->fakeApi();
    }

    protected function tearDown(): void
    {
        CarbonImmutable::setTestNow();
        parent::tearDown();
    }

    public function test_the_pause_scan_logs_the_floor_and_sends_one_plancher_alert(): void
    {
        $match = $this->match();

        $this->scan();

        $log = OpportunityLog::query()->where('event_type', 'plancher_scan')->sole();
        $this->assertSame('Plancher', $log->rule_id);
        $this->assertSame('alert', $log->decision);
        $this->assertSame('Over 3.5 · Over 2.5', $log->suggested_action);
        $this->assertSame('Plancher', $log->plancher['mode']);
        $this->assertSame('pause', $log->plancher['scan']);
        $this->assertSame(['0-2', '0-3', '0-4', '1-2', '1-3'], array_column($log->plancher['list'], 'score'));
        $this->assertSame([4, 2], [$log->plancher['totalMax'], $log->plancher['floor']]);
        $this->assertEquals(4.0, $log->plancher['under25']);
        $this->assertSame(['line' => '4.5', 'odds' => 1.22], $log->plancher['underAboveTotalMax'], 'Under de la ligne total_max + 0.5 (bet 25 avant bet 36).');
        $this->assertFalse($log->plancher['e2Signal']['inBand'], 'Signal E2 d’origine journalisé, sans décider.');
        $this->assertStringContainsString('Over 2.5 @1.225 (valeur faible)', $log->reason);

        $alert = Alert::query()->whereBelongsTo($log, 'opportunityLog')->sole();
        $this->assertNull($alert->expires_at, 'Pari sur le total du match : valable jusqu’à la fin du match.');
        $this->assertSame(['plancher_central', 'plancher_prudent'], $alert->options->pluck('type')->all());
        $this->assertSame(['Over 3.5', 'Over 2.5'], $alert->options->pluck('line')->all());
        $this->assertSame([2.064, 1.225], $alert->options->pluck('odds')->all());
        $this->assertStringContainsString('PLANCHER · scan de la pause (E2)', $alert->message);
        $this->assertStringContainsString('Liste ≤ 8.00 : 0-2, 0-3, 0-4, 1-2, 1-3', $alert->message);
        $this->assertStringContainsString('Pari prudent : Over 2.5 @1.225 (valeur faible)', $alert->message);
        Queue::assertPushed(SendAlertNotification::class, fn (SendAlertNotification $job): bool => $job->alertId === $alert->id);
        $this->assertArrayHasKey('pause', $match->fresh()->plancher_scans);
        $this->assertTrue($this->sent('bet=25'));

        // Relevé suivant, toujours à la mi-temps : le scan est déjà fait, aucune requête Over/Under en plus.
        $goalLineRequests = $this->requests('bet=25');
        CarbonImmutable::setTestNow(CarbonImmutable::now()->addSeconds(40));
        $this->scan();
        $this->assertSame(1, OpportunityLog::query()->where('event_type', 'plancher_scan')->count());
        $this->assertSame($goalLineRequests, $this->requests('bet=25'));

        $this->actingAs(User::factory()->create(['is_admin' => true]))
            ->getJson(route('admin.api.journal.index', ['rule_id' => 'Plancher']))
            ->assertJsonPath('data.0.plancher.totalMax', 4)
            ->assertJsonPath('data.0.alert.options.1.type', 'plancher_prudent');
    }

    public function test_the_pause_scan_is_the_e2_scan_and_needs_f121_e2_in_the_active_profile(): void
    {
        RuleProfile::query()->update(['settings' => ['active_rules' => ['F121-D', 'F121-C', 'F121-E1']]]);
        $this->match();

        $this->scan();

        $this->assertSame(0, OpportunityLog::query()->where('event_type', 'plancher_scan')->count());
        $this->assertFalse($this->sent('bet=25'), 'Aucun scan dû : aucune requête Over/Under.');
    }

    public function test_a_line_already_posted_by_a_neutral_option_is_not_posted_again(): void
    {
        $match = $this->match();
        $log = OpportunityLog::query()->create(['tracked_match_id' => $match->id, 'event_type' => 'evaluation', 'rule_id' => 'F121-E1', 'decision' => 'alert', 'reason' => 'Alerte précédente.', 'evaluated_at' => CarbonImmutable::now()]);
        $alert = $log->alert()->create(['channel' => 'telegram', 'status' => 'expired', 'message' => 'ALERTE']);
        $alert->options()->create(['position' => 1, 'type' => 'neutral', 'label' => 'Un but de plus dans le match', 'line' => 'Over 3.5']);

        $this->scan();

        $plancher = OpportunityLog::query()->where('event_type', 'plancher_scan')->sole();
        $this->assertSame(['Over 2.5'], $plancher->alert->options->pluck('line')->all(), 'Getafe avec la ligne 3.5 déjà posée : seul Over 2.5 sort.');
        $this->assertSame('ligne déjà posée', $plancher->plancher['skipped'][0]['reason']);
    }

    public function test_a_line_counts_as_posted_only_when_it_really_is(): void
    {
        $match = $this->match();
        $post = function (int $home, int $away, string $line, string $decision = 'unset', string $status = 'expired') use ($match): void {
            $snapshot = $match->snapshots()->create(['minute' => 58, 'home_score' => $home, 'away_score' => $away, 'statistics' => [], 'captured_at' => CarbonImmutable::now()]);
            $log = OpportunityLog::query()->create(['tracked_match_id' => $match->id, 'match_snapshot_id' => $snapshot->id, 'event_type' => 'evaluation', 'rule_id' => 'F121-E1', 'decision' => 'alert', 'reason' => 'Alerte.', 'evaluated_at' => CarbonImmutable::now()]);
            $log->alert()->create(['channel' => 'telegram', 'status' => $status, 'message' => 'ALERTE'])
                ->options()->create(['position' => 2, 'type' => 'neutral', 'label' => 'Un but de plus', 'line' => $line, 'decision' => $decision]);
        };
        $lines = fn (): array => app(GoalFloorScanService::class)->postedLines($match);

        $post(1, 2, 'Over 3.5');
        $this->assertSame([3.5], $lines());

        // Neftchi – Al-Hilal : Over 4.5 proposé à 2-2, but annulé (1-2) : la ligne 4.5 n’est plus posée, 3.5 l’est toujours.
        $post(2, 2, 'Over 4.5', status: 'invalidated');
        $this->assertSame([3.5, 4.5], $lines());
        $match->snapshots()->create(['minute' => 59, 'home_score' => 1, 'away_score' => 2, 'statistics' => [], 'captured_at' => CarbonImmutable::now()]);
        $this->assertSame([3.5], $lines());

        $post(1, 2, 'Over 5.5', decision: 'ignored');
        $post(1, 2, 'Over 6.5', status: 'failed');
        $this->assertSame([3.5], $lines(), 'Ignorée ou jamais envoyée : pas posée.');

        $post(2, 2, 'Over 7.5', decision: 'played');
        $match->snapshots()->create(['minute' => 61, 'home_score' => 1, 'away_score' => 2, 'statistics' => [], 'captured_at' => CarbonImmutable::now()]);
        $this->assertSame([3.5, 7.5], $lines(), 'Jouée : toujours posée, même après un but annulé.');
    }

    public function test_telegram_can_be_disabled_per_scan_without_losing_the_journal_and_the_result(): void
    {
        Setting::query()->where('key', 'plancher.notify_pause')->update(['value' => '0']);
        $this->match();

        $this->scan();

        $alert = Alert::query()->sole();
        $this->assertSame('silent', $alert->status);
        $this->assertCount(2, $alert->options);
        Queue::assertNotPushed(SendAlertNotification::class);
    }

    public function test_departure_and_sixty_scans_follow_their_windows_and_a_goal_never_triggers_a_rescan(): void
    {
        $match = $this->match();
        // Paris FC – Angers, 11e, 0-0.
        $this->live = ['1H', 'First Half', 11, 0, 0];
        $this->exactScores = ['0-0' => '7.00', '1-0' => '6.00', '2-0' => '6.00', '3-0' => '8.00', '0-1' => '8.50', '1-1' => '9.00'];
        $this->lines = [25 => [['Over', '2.5', '1.768'], ['Over', '1.5', '1.225']], 36 => []];
        $this->scan();
        $depart = OpportunityLog::query()->where('event_type', 'plancher_scan')->sole();
        $this->assertSame('depart', $depart->plancher['scan']);
        $this->assertSame(['Over 2.5', 'Over 1.5'], $depart->alert->options->pluck('line')->all());

        // But à la 30e : pas de rescan, et l’alerte Plancher reste valable.
        $this->advance(['1H', 'First Half', 30, 1, 0]);
        $this->assertSame(1, OpportunityLog::query()->where('event_type', 'plancher_scan')->count());
        $this->assertSame('queued', $depart->alert->fresh()->status);

        // 61e, 1-0 : scan soixante ; lignes 2.5 et 1.5 déjà posées.
        $this->exactScores = ['1-0' => '3.00', '2-0' => '5.00', '1-1' => '6.00', '2-1' => '7.50', '3-0' => '12.00'];
        $this->lines = [25 => [['Over', '2.5', '2.10'], ['Over', '1.5', '1.20']], 36 => []];
        $this->advance(['2H', 'Second Half', 61, 1, 0]);
        $sixty = OpportunityLog::query()->where('event_type', 'plancher_scan')->latest('id')->first();
        $this->assertSame('soixante', $sixty->plancher['scan']);
        $this->assertSame('no_alert', $sixty->decision, 'Central Over 2.5 et prudent Over 1.5 déjà posés au départ.');
        $this->assertSame(['ligne déjà posée', 'ligne déjà posée'], array_column($sixty->plancher['skipped'], 'reason'));
        $this->assertSame(['depart', 'soixante'], array_keys($match->fresh()->plancher_scans));
    }

    public function test_plancher_bets_are_settled_at_full_time_and_counted_by_type(): void
    {
        $this->match();
        $this->scan();

        // Final 0-3 : prudent Over 2.5 gagné, central Over 3.5 perdu (annexe : « prudent ✓, central ✗ »).
        $this->advance(['2H', 'Second Half', 70, 0, 3]);
        $this->advance(['FT', 'Match Finished', 90, 0, 3]);

        $options = Alert::query()->sole()->options;
        $this->assertSame(['lost', 'won'], $options->pluck('outcome')->all());
        $this->assertSame(['auto', 'auto'], $options->pluck('outcome_source')->all());
        $this->actingAs(User::factory()->create(['is_admin' => true]))
            ->getJson(route('admin.api.statistics'))
            ->assertJsonPath('byType.plancher_central.lost', 1)
            ->assertJsonPath('byType.plancher_prudent.won', 1)
            ->assertJsonPath('byRule.Plancher.byType.plancher_prudent.successRatePercent', 100);
    }

    private function match(): TrackedMatch
    {
        return TrackedMatch::query()->create([
            'provider' => 'real',
            'provider_match_id' => '701',
            'home_team' => 'Getafe',
            'away_team' => 'Atlético',
            'is_active' => true,
        ]);
    }

    /**
     * @param  array{0: string, 1: string, 2: int, 3: int, 4: int}  $live
     */
    private function advance(array $live): void
    {
        $this->live = $live;
        CarbonImmutable::setTestNow(CarbonImmutable::now()->addMinutes(3));
        $this->scan();
    }

    private function scan(): void
    {
        app()->forgetInstance(ScanService::class);
        app(ScanService::class)->runOnce(forceRefresh: true);
    }

    private function requests(string $path): int
    {
        return Http::recorded()->filter(fn (array $pair): bool => str_contains($pair[0]->url(), $path))->count();
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
            if (str_contains($url, '/fixtures/statistics')) {
                $payload = json_decode((string) file_get_contents(database_path('fixtures/api-football/fixtures-statistics-covered.json')), true, flags: JSON_THROW_ON_ERROR);
                $payload['response'][0]['team']['id'] = 7011;
                $payload['response'][1]['team']['id'] = 7012;

                return Http::response(json_encode($payload, JSON_THROW_ON_ERROR), 200, $headers);
            }

            if (str_contains($url, '/fixtures/events')) {
                return Http::response('{"errors":[],"response":[]}', 200, $headers);
            }

            if (str_contains($url, '/fixtures')) {
                return Http::response(json_encode(['errors' => [], 'response' => [[
                    'fixture' => ['id' => 701, 'date' => '2026-11-23T19:00:00+00:00', 'status' => ['short' => $this->live[0], 'long' => $this->live[1], 'elapsed' => $this->live[2]]],
                    'league' => ['id' => 140, 'name' => 'La Liga', 'season' => 2026],
                    'teams' => ['home' => ['id' => 7011, 'name' => 'Getafe'], 'away' => ['id' => 7012, 'name' => 'Atlético']],
                    'goals' => ['home' => $this->live[3], 'away' => $this->live[4]],
                ]]], JSON_THROW_ON_ERROR), 200, $headers);
            }

            if (str_contains($url, '/odds/live')) {
                parse_str((string) parse_url($url, PHP_URL_QUERY), $query);
                $bet = (int) ($query['bet'] ?? 0);
                $values = $bet === 23
                    ? array_map(fn (string $score, string $odd): array => ['value' => $score, 'odd' => $odd, 'suspended' => false], array_keys($this->exactScores), $this->exactScores)
                    : array_map(fn (array $line): array => ['value' => $line[0], 'handicap' => $line[1], 'odd' => $line[2], 'suspended' => false], $this->lines[$bet] ?? []);

                return Http::response(json_encode(['errors' => [], 'response' => [[
                    'fixture' => ['id' => 701, 'status' => ['long' => $this->live[1], 'elapsed' => $this->live[2]]],
                    'status' => ['stopped' => $this->live[0] === 'HT', 'blocked' => false, 'finished' => false],
                    'teams' => ['home' => ['goals' => $this->live[3]], 'away' => ['goals' => $this->live[4]]],
                    'odds' => [['id' => $bet, 'name' => 'Marché '.$bet, 'values' => $values]],
                ]]], JSON_THROW_ON_ERROR), 200, $headers);
            }

            return Http::response('', 404);
        });
    }
}
