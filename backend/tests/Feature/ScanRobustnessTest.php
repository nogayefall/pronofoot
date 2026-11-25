<?php

namespace Tests\Feature;

use App\Console\Commands\RunScan;
use App\Logging\RedactSecrets;
use App\Logging\SecretRedactor;
use App\Models\Alert;
use App\Models\OpportunityLog;
use App\Models\RuleProfile;
use App\Models\Setting;
use App\Models\TrackedMatch;
use App\Providers\Contracts\FootballProvider;
use App\Providers\Contracts\OddsProvider;
use App\Rules\RuleConfiguration;
use App\Rules\RuleEngine;
use App\Services\DatabaseReconnector;
use App\Services\RuleConfigurationFactory;
use App\Services\ScanPassResult;
use App\Services\ScanService;
use App\Services\ScanSettings;
use Carbon\CarbonImmutable;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use PDOException;
use RuntimeException;
use Tests\TestCase;

/**
 * Robustesse de scan:run en fonctionnement continu (plusieurs heures sous Supervisor).
 */
class ScanRobustnessTest extends TestCase
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
            'services.pronofoot.notifications.channel' => 'log',
            'services.pronofoot.notifications.fallback' => 'none',
            'services.pronofoot.notifications.fake_fail_channels' => [],
        ]);
        RuleProfile::query()->create([
            'name' => 'Profil de robustesse',
            'is_active' => true,
            'settings' => ['active_rules' => RuleConfiguration::DEFINED_RULES, 'method_weights' => []],
        ]);
    }

    public function test_an_exception_on_one_match_does_not_stop_the_other_matches(): void
    {
        $broken = $this->track('fake-vitality-refusal');
        $healthy = $this->track('fake-candidate');
        TrackedMatch::saving(function (TrackedMatch $match) use ($broken): void {
            if ($match->id === $broken->id && $match->isDirty('last_scanned_at')) {
                throw new RuntimeException('panne simulée sur un match');
            }
        });

        $result = app(ScanService::class)->runOnce();

        $this->assertSame(1, $result->errors);
        $this->assertDatabaseHas('opportunity_logs', ['tracked_match_id' => $broken->id, 'event_type' => 'match_processing_error']);
        $this->assertStringContainsString('panne simulée', OpportunityLog::query()->where('event_type', 'match_processing_error')->sole()->reason);
        $this->assertDatabaseHas('opportunity_logs', ['tracked_match_id' => $healthy->id, 'event_type' => 'evaluation']);
    }

    public function test_a_restarted_scan_does_not_duplicate_active_alerts(): void
    {
        $match = $this->track('fake-candidate');
        $this->fallingReference($match);

        app(ScanService::class)->runOnce();
        $match->forceFill(['last_scanned_at' => null])->save();
        app()->forgetInstance(ScanService::class);
        app(ScanService::class)->runOnce();

        $this->assertSame(1, Alert::query()->count());
        $this->assertDatabaseHas('opportunity_logs', ['decision' => 'duplicate_suppressed']);
    }

    public function test_scan_run_survives_a_lost_database_connection_and_any_pass_exception(): void
    {
        $this->bindScanner([
            new QueryException('mysql', 'select 1', [], new PDOException('SQLSTATE[HY000]: General error: 2006 MySQL server has gone away')),
            new RuntimeException('erreur imprévue'),
            new ScanPassResult(1, 1, 0, 0, 0, 0, 0),
        ]);

        $reconnector = new class extends DatabaseReconnector
        {
            public int $calls = 0;

            public function reconnect(): void
            {
                $this->calls++;
            }
        };
        $this->app->instance(DatabaseReconnector::class, $reconnector);

        $this->artisan('scan:run', ['--max-passes' => 3, '--error-backoff' => 0])
            ->expectsOutputToContain('Connexion à la base perdue : reconnexion au prochain passage.')
            ->expectsOutputToContain('Erreur pendant le passage, le scan continue : RuntimeException : erreur imprévue')
            ->expectsOutputToContain('match(s) 1')
            ->assertExitCode(1);

        $this->assertSame(1, $reconnector->calls);
        $this->assertNull(Cache::get('pronofoot.scan.running'));
    }

    public function test_scan_stop_ends_the_loop_cleanly_after_the_current_pass(): void
    {
        $this->bindScanner([new ScanPassResult(0, 0, 0, 0, 0, 0, 0)], onRun: fn () => Cache::put(RunScan::STOP_FLAG, true));

        $this->artisan('scan:run', ['--error-backoff' => 0])
            ->expectsOutputToContain('Arrêt demandé : scan arrêté proprement')
            ->assertExitCode(0);

        $this->assertNull(Cache::get(RunScan::STOP_FLAG));
        $this->assertNull(Cache::get('pronofoot.scan.running'));

        $this->artisan('scan:stop')->assertExitCode(0);
        $this->assertTrue(Cache::get(RunScan::STOP_FLAG));
    }

    public function test_scan_run_exits_cleanly_above_the_memory_limit_so_supervisor_restarts_it(): void
    {
        $this->bindScanner([new ScanPassResult(0, 0, 0, 0, 0, 0, 0)]);

        $this->artisan('scan:run', ['--max-memory' => 1])
            ->expectsOutputToContain('Mémoire au-delà de 1 Mo : arrêt propre')
            ->assertExitCode(0);
    }

    public function test_memory_stays_stable_over_many_passes(): void
    {
        $this->track('fake-candidate');
        $this->track('fake-gap-refusal');
        $scanner = app(ScanService::class);
        for ($pass = 0; $pass < 10; $pass++) {
            $scanner->runOnce();
        }
        gc_collect_cycles();
        $baseline = memory_get_usage();

        for ($pass = 0; $pass < 60; $pass++) {
            $scanner->runOnce();
        }
        gc_collect_cycles();

        $this->assertLessThan(4 * 1048576, memory_get_usage() - $baseline, '60 passages supplémentaires ne doivent pas faire croître la mémoire de plus de 4 Mo.');
    }

    public function test_api_keys_and_tokens_are_masked_in_log_files(): void
    {
        config(['services.football_api.api_key' => 'cle-api-football-123456789']);
        $_ENV['TELEGRAM_BOT_TOKEN'] = '987654:jeton-telegram-secret';
        $path = storage_path('logs/test-redaction-'.uniqid().'.log');

        try {
            config(['logging.channels.single.path' => $path]);
            Log::forgetChannel('single');
            Log::channel('single')->error('Échec avec cle-api-football-123456789', [
                'url' => 'https://api.telegram.org/bot987654:jeton-telegram-secret/sendMessage',
                'exception' => new RuntimeException('clé cle-api-football-123456789 refusée'),
            ]);
            $content = File::get($path);
        } finally {
            unset($_ENV['TELEGRAM_BOT_TOKEN']);
            Log::forgetChannel('single');
            File::delete($path);
        }

        $this->assertStringNotContainsString('cle-api-football-123456789', $content);
        $this->assertStringNotContainsString('jeton-telegram-secret', $content);
        $this->assertStringContainsString(SecretRedactor::MASK, $content);
        $this->assertContains(RedactSecrets::class, config('logging.channels.single.tap'));
        $this->assertContains(RedactSecrets::class, config('logging.channels.daily.tap'));
    }

    /**
     * @param  list<ScanPassResult|\Throwable>  $outcomes
     */
    private function bindScanner(array $outcomes, ?\Closure $onRun = null): void
    {
        $scanner = new class(app(FootballProvider::class), app(OddsProvider::class), new RuleEngine, app(ScanSettings::class), app(RuleConfigurationFactory::class)) extends ScanService
        {
            /** @var list<ScanPassResult|\Throwable> */
            public array $outcomes = [];

            public ?\Closure $onRun = null;

            public function runOnce(int $scanNumber = 0, bool $forceRefresh = true): ScanPassResult
            {
                $this->onRun?->__invoke();
                $outcome = count($this->outcomes) > 1 ? array_shift($this->outcomes) : $this->outcomes[0];
                if ($outcome instanceof \Throwable) {
                    throw $outcome;
                }

                return $outcome;
            }
        };
        $scanner->outcomes = $outcomes;
        $scanner->onRun = $onRun;
        $this->app->instance(ScanService::class, $scanner);
    }

    private function track(string $providerMatchId): TrackedMatch
    {
        return TrackedMatch::query()->create([
            'provider' => 'fake',
            'provider_match_id' => $providerMatchId,
            'home_team' => 'Domicile '.$providerMatchId,
            'away_team' => 'Extérieur',
            'is_active' => true,
        ]);
    }

    private function fallingReference(TrackedMatch $match): void
    {
        $capturedAt = CarbonImmutable::now()->subMinutes(3);
        $match->snapshots()->create([
            'minute' => 28,
            'home_score' => 0,
            'away_score' => 0,
            'exact_score_odds' => ['0-0' => 7.5, '1-0' => 10.0, '0-1' => 9.8],
            'statistics' => [],
            'odds_captured_at' => $capturedAt,
            'captured_at' => $capturedAt,
        ]);
        $recent = CarbonImmutable::now()->subMinute();
        $match->snapshots()->create([
            'minute' => 29,
            'home_score' => 0,
            'away_score' => 0,
            'exact_score_odds' => ['0-0' => 7.5, '1-0' => 8.6, '0-1' => 9.8],
            'statistics' => [],
            'odds_captured_at' => $recent,
            'captured_at' => $recent,
        ]);
    }
}
