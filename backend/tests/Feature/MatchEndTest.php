<?php

namespace Tests\Feature;

use App\Models\Alert;
use App\Models\OpportunityLog;
use App\Models\Setting;
use App\Models\TrackedMatch;
use App\Services\ScanPassResult;
use App\Services\ScanService;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/**
 * Fin de match : statut API-Football, absence prolongée du flux, plafond de durée ; plus aucun appel ensuite.
 */
class MatchEndTest extends TestCase
{
    use RefreshDatabase;

    private const FIXTURE = 501;

    /** @var array<int, array{0: string, 1: string, 2: int|null}> Statut (court, long, minute) par match présent dans le flux. */
    private array $live = [];

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
        CarbonImmutable::setTestNow('2026-11-20 20:00:00');
        $this->fakeApi();
    }

    protected function tearDown(): void
    {
        CarbonImmutable::setTestNow();
        parent::tearDown();
    }

    /**
     * @return array<string, array{string, string}>
     */
    public static function finishedStatuses(): array
    {
        return [
            'FT' => ['FT', 'Match Finished'],
            'AET' => ['AET', 'Match Finished'],
            'PEN' => ['PEN', 'Match Finished'],
        ];
    }

    #[DataProvider('finishedStatuses')]
    public function test_a_finished_match_is_closed_once_and_never_queried_again(string $short, string $long): void
    {
        $match = $this->track();
        $this->live = [self::FIXTURE => ['2H', 'Second Half', 88]];
        $this->scan();
        $this->assertSame([(string) self::FIXTURE], $this->statisticsRequests(), 'En jeu : statistiques demandées.');
        $alert = $this->activeAlert($match);

        $this->live = [self::FIXTURE => [$short, $long, 90]];
        $result = $this->scan();

        $match->refresh();
        $this->assertSame(1, $result->matchesEnded);
        $this->assertFalse($match->is_active);
        $this->assertSame('Terminé', $match->status);
        $this->assertNotNull($match->ended_at);
        $this->assertStringContainsString("({$short})", (string) $match->ended_reason);
        $this->assertSame('expired', $alert->fresh()->status, 'Les alertes actives du match sont expirées.');
        $finished = OpportunityLog::query()->where('event_type', 'match_finished')->sole();
        $this->assertStringStartsWith('Match terminé : suivi arrêté (statut ', $finished->reason);
        $this->assertStringContainsString('1 alerte active expirée.', $finished->reason);
        $this->assertSame([(string) self::FIXTURE], $this->statisticsRequests(), 'Fin détectée : aucun appel de statistiques pour ce match.');

        $callsAtEnd = count(Http::recorded());
        $oddsCallsAtEnd = $this->countSent('/odds/live');
        $this->live = [];
        foreach (range(1, 3) as $pass) {
            CarbonImmutable::setTestNow(CarbonImmutable::now()->addSeconds(30));
            $this->scan();
        }

        $this->assertSame(1, OpportunityLog::query()->where('event_type', 'match_finished')->count(), 'Un seul événement de fin.');
        $this->assertSame([(string) self::FIXTURE], $this->statisticsRequests(), 'Plus aucun appel de statistiques ensuite.');
        $this->assertSame($oddsCallsAtEnd, $this->countSent('/odds/live'), 'Ni appel de cotes : aucun match suivi.');
        $this->assertLessThanOrEqual(1, count(Http::recorded()) - $callsAtEnd, 'Au plus un relevé du flux en direct, puis veille.');
    }

    public function test_added_time_extra_time_and_penalties_do_not_end_the_match(): void
    {
        $match = $this->track();

        $this->live = [self::FIXTURE => ['2H', 'Second Half', 93]];
        $this->scan();
        $this->assertTrue($match->fresh()->is_active, 'Temps additionnel (93\') : le match continue.');
        $this->assertSame(93, $match->snapshots()->latest('id')->firstOrFail()->minute);

        $this->live = [self::FIXTURE => ['ET', 'Extra Time', 105]];
        $this->scan();
        $this->assertTrue($match->fresh()->is_active, 'Prolongation : le match continue.');

        $statisticsBefore = count($this->statisticsRequests());
        $this->live = [self::FIXTURE => ['P', 'Penalty In Progress', 120]];
        $this->scan();
        $this->assertTrue($match->fresh()->is_active, 'Tirs au but : le match n’est pas terminé.');
        $this->assertSame($statisticsBefore, count($this->statisticsRequests()), 'Tirs au but : pas d’analyse, pas de statistiques.');
        $this->assertSame(1, OpportunityLog::query()->where('event_type', 'penalty_shootout')->count());
        $this->assertSame(0, OpportunityLog::query()->where('event_type', 'match_finished')->count());
    }

    public function test_a_match_missing_from_the_live_feed_for_four_readings_is_considered_finished(): void
    {
        $match = $this->track();
        $this->live = [self::FIXTURE => ['2H', 'Second Half', 70]];
        $this->scan();

        $this->live = [];
        foreach (range(1, 3) as $reading) {
            $this->scan();
            $this->assertTrue($match->fresh()->is_active, "Absent {$reading} fois : encore suivi.");
            $this->assertSame($reading, $match->fresh()->missing_readings);
        }
        $this->assertSame(0, OpportunityLog::query()->where('reason', 'like', '%introuvable%')->count(), 'Plus de ligne « Match introuvable » à chaque relevé.');

        $this->scan();
        $match->refresh();
        $this->assertFalse($match->is_active);
        $this->assertSame('absent du flux en direct depuis 4 relevés consécutifs', $match->ended_reason);
        $this->assertSame(1, OpportunityLog::query()->where('event_type', 'match_finished')->count());
    }

    public function test_a_match_back_in_the_feed_resets_the_missing_counter(): void
    {
        $match = $this->track();
        $this->live = [];
        $this->scan();
        $this->scan();
        $this->assertSame(2, $match->fresh()->missing_readings);

        $this->live = [self::FIXTURE => ['2H', 'Second Half', 75]];
        $this->scan();
        $this->assertSame(0, $match->fresh()->missing_readings);
        $this->assertTrue($match->fresh()->is_active);
    }

    public function test_a_match_older_than_four_hours_thirty_is_removed_without_any_api_call(): void
    {
        Setting::query()->where('key', 'scan.auto_mode')->update(['value' => '0']);
        $match = $this->track(['kickoff_at' => CarbonImmutable::now()->subMinutes(271)]);

        $result = $this->scan();

        $this->assertSame(1, $result->matchesEnded);
        $this->assertFalse($match->fresh()->is_active);
        $this->assertSame('coup d’envoi il y a plus de 4 h 30', $match->fresh()->ended_reason);
        Http::assertNothingSent();
    }

    public function test_the_kickoff_is_recorded_from_the_live_feed_for_the_duration_cap(): void
    {
        $match = $this->track();
        $this->live = [self::FIXTURE => ['1H', 'First Half', 12]];
        $this->scan();

        $this->assertSame('2026-11-20 18:00:00', $match->fresh()->kickoff_at?->format('Y-m-d H:i:s'));
    }

    public function test_an_identical_decision_updates_the_previous_journal_line_instead_of_adding_one(): void
    {
        $match = $this->track();
        $this->live = [self::FIXTURE => ['NS', 'Not Started', null]];

        $this->scan();
        CarbonImmutable::setTestNow(CarbonImmutable::now()->addSeconds(30));
        $this->scan();
        CarbonImmutable::setTestNow(CarbonImmutable::now()->addSeconds(30));
        $this->scan();

        $line = OpportunityLog::query()->where('tracked_match_id', $match->id)->sole();
        $this->assertSame(3, $line->repeat_count);
        $this->assertSame('2026-11-20 20:00:00', $line->first_evaluated_at?->format('Y-m-d H:i:s'));
        $this->assertSame('2026-11-20 20:01:00', $line->evaluated_at?->format('Y-m-d H:i:s'));

        $this->live = [self::FIXTURE => ['1H', 'First Half', 2]];
        $this->scan();
        $this->assertSame(2, OpportunityLog::query()->where('tracked_match_id', $match->id)->count(), 'Décision différente : nouvelle ligne.');
    }

    public function test_without_tracked_match_nor_live_match_in_the_tracked_leagues_the_scan_spaces_its_calls(): void
    {
        $this->live = [777 => ['2H', 'Second Half', 60]];

        $first = $this->scan();
        $this->assertTrue($first->idle);
        $this->assertSame(300, $first->nextPollIntervalSeconds);
        $this->assertSame(1, count(Http::recorded()), 'Un seul appel : le flux en direct (ni cotes, ni statistiques).');

        CarbonImmutable::setTestNow(CarbonImmutable::now()->addSeconds(30));
        $second = $this->scan();
        $this->assertTrue($second->idle);
        $this->assertSame(1, count(Http::recorded()), 'Pendant la veille : aucun appel.');

        CarbonImmutable::setTestNow(CarbonImmutable::now()->addSeconds(300));
        $this->scan();
        $this->assertSame(2, count(Http::recorded()), 'Fin de la veille : nouveau relevé du flux.');
        $this->assertFalse($this->sent('/odds/live'));
        $this->assertFalse($this->sent('/fixtures/statistics'));
        $this->assertNotNull(Cache::get('pronofoot.scan.idle_until'));
    }

    private function scan(): ScanPassResult
    {
        app()->forgetInstance(ScanService::class);

        return app(ScanService::class)->runOnce(forceRefresh: false);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function track(array $attributes = []): TrackedMatch
    {
        return TrackedMatch::query()->create([
            'provider' => 'real',
            'provider_match_id' => (string) self::FIXTURE,
            'home_team' => 'Sénégal',
            'away_team' => 'Soudan',
            'is_active' => true,
            ...$attributes,
        ]);
    }

    private function activeAlert(TrackedMatch $match): Alert
    {
        $log = OpportunityLog::query()->create([
            'tracked_match_id' => $match->id,
            'event_type' => 'evaluation',
            'rule_id' => 'F121-E1',
            'selection' => 'home',
            'decision' => 'alert',
            'reason' => 'Alerte de test.',
            'evaluated_at' => CarbonImmutable::now(),
        ]);

        return $log->alert()->create([
            'channel' => 'telegram',
            'status' => 'sent',
            'message' => 'ALERTE CRITIQUE',
            'expires_at' => CarbonImmutable::now()->addMinutes(15),
        ]);
    }

    /**
     * @return list<string>
     */
    private function statisticsRequests(): array
    {
        return Http::recorded()
            ->map(fn (array $pair): Request => $pair[0])
            ->filter(fn (Request $request): bool => str_contains($request->url(), '/fixtures/statistics'))
            ->map(fn (Request $request): string => (string) $request->data()['fixture'])
            ->values()
            ->all();
    }

    private function countSent(string $path): int
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
                $fixtureId = (int) $request->data()['fixture'];
                $payload['response'][0]['team']['id'] = $fixtureId * 10 + 1;
                $payload['response'][1]['team']['id'] = $fixtureId * 10 + 2;

                return Http::response(json_encode($payload, JSON_THROW_ON_ERROR), 200, $headers);
            }

            if (str_contains($url, '/fixtures')) {
                return Http::response(json_encode(['errors' => [], 'response' => array_map(fn (int $id): array => [
                    'fixture' => ['id' => $id, 'date' => '2026-11-20T18:00:00+00:00', 'status' => ['short' => $this->live[$id][0], 'long' => $this->live[$id][1], 'elapsed' => $this->live[$id][2]]],
                    'league' => ['id' => 1, 'name' => 'Ligue de test', 'season' => 2026],
                    'teams' => ['home' => ['id' => $id * 10 + 1, 'name' => 'Sénégal'], 'away' => ['id' => $id * 10 + 2, 'name' => 'Soudan']],
                    'goals' => ['home' => 1, 'away' => 0],
                ], array_keys($this->live))], JSON_THROW_ON_ERROR), 200, $headers);
            }

            if (str_contains($url, '/odds/live')) {
                return Http::response(json_encode(['errors' => [], 'response' => array_map(fn (int $id): array => [
                    'fixture' => ['id' => $id, 'status' => ['long' => $this->live[$id][1], 'elapsed' => $this->live[$id][2]]],
                    'status' => ['stopped' => false, 'blocked' => false, 'finished' => false],
                    'teams' => ['home' => ['goals' => 1], 'away' => ['goals' => 0]],
                    'odds' => [['id' => 23, 'name' => 'Final Score', 'values' => [
                        ['value' => '1-0', 'odd' => '2.80', 'suspended' => false],
                        ['value' => '2-0', 'odd' => '3.50', 'suspended' => false],
                        ['value' => '1-1', 'odd' => '6.00', 'suspended' => false],
                    ]]],
                ], array_keys($this->live))], JSON_THROW_ON_ERROR), 200, $headers);
            }

            return Http::response('', 404);
        });
    }
}
