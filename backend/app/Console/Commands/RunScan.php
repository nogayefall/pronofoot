<?php

namespace App\Console\Commands;

use App\Logging\SecretRedactor;
use App\Services\DatabaseReconnector;
use App\Services\QuotaGuard;
use App\Services\ScanService;
use Illuminate\Console\Command;
use Illuminate\Database\DetectsLostConnections;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use Throwable;

/**
 * Scan continu prévu pour tourner des heures sous Supervisor : une erreur sur un passage n’arrête pas la boucle,
 * une coupure de base provoque une reconnexion, l’arrêt est propre (signal ou scan:stop), et une limite mémoire
 * permet à Supervisor de relancer un processus neuf. Les alertes déjà actives ne sont pas recréées après relance.
 */
class RunScan extends Command
{
    use DetectsLostConnections;

    public const STOP_FLAG = 'pronofoot.scan.stop_requested';

    protected $signature = 'scan:run
        {--max-passes=0 : Arrêter après ce nombre de cycles (0 = continu)}
        {--scan-number=0 : Index initial du scénario fictif à rejouer}
        {--max-memory=256 : Quitter proprement au-delà de cette mémoire, en Mo (0 = sans limite) ; Supervisor relance}
        {--error-backoff=5 : Pause en secondes après une erreur de passage}';

    protected $description = 'Scanner en continu les matchs suivis, avec des cycles accélérés après un but.';

    private bool $stopRequested = false;

    public function handle(ScanService $scanner, DatabaseReconnector $reconnector): int
    {
        $maxPasses = filter_var($this->option('max-passes'), FILTER_VALIDATE_INT);
        $scanNumber = filter_var($this->option('scan-number'), FILTER_VALIDATE_INT);
        $maxMemory = filter_var($this->option('max-memory'), FILTER_VALIDATE_INT);
        $errorBackoff = filter_var($this->option('error-backoff'), FILTER_VALIDATE_INT);

        foreach ([$maxPasses, $scanNumber, $maxMemory, $errorBackoff] as $value) {
            if ($value === false || $value < 0) {
                throw new InvalidArgumentException('Les options --max-passes, --scan-number, --max-memory et --error-backoff doivent être des entiers positifs ou nuls.');
            }
        }

        Cache::forget(self::STOP_FLAG);
        DB::connection()->disableQueryLog();
        if (extension_loaded('pcntl')) {
            $this->trap([SIGTERM, SIGINT, SIGQUIT], function (): void {
                $this->stopRequested = true;
            });
        }

        $pass = 0;
        $errors = 0;
        $this->info('Scan continu actif. Arrêt : Ctrl+C, signal SIGTERM ou php artisan scan:stop.');

        try {
            while ($maxPasses === 0 || $pass < $maxPasses) {
                $sleepSeconds = $errorBackoff;
                try {
                    $result = $scanner->runOnce((int) $scanNumber + $pass, forceRefresh: false);
                    $errors += $result->errors;
                    $sleepSeconds = $result->nextPollIntervalSeconds;
                    Cache::put(
                        'pronofoot.scan.running',
                        true,
                        now()->addSeconds(max(60, $result->nextPollIntervalSeconds * 2)),
                    );
                    $this->line(sprintf(
                        '[%s] match(s) %d — alerte(s) %d — but(s) %d — terminé(s) %d — incident(s) %d — mémoire %.1f Mo%s',
                        now()->toDateTimeString(),
                        $result->matchesScanned,
                        $result->alertsCreated,
                        $result->goalsDetected,
                        $result->matchesEnded,
                        $result->errors,
                        memory_get_usage(true) / 1048576,
                        $result->idle ? " — veille, prochain relevé dans {$result->nextPollIntervalSeconds} s" : '',
                    ));

                    if ($result->quotaStopped) {
                        $this->error(QuotaGuard::EXHAUSTED_MESSAGE);

                        return self::FAILURE;
                    }
                } catch (Throwable $exception) {
                    $errors++;
                    $this->handlePassFailure($exception, $reconnector);
                }

                $pass++;
                gc_collect_cycles();

                if ($this->shouldStop()) {
                    $this->info('Arrêt demandé : scan arrêté proprement après le passage en cours.');

                    break;
                }

                if ($maxMemory > 0 && memory_get_usage(true) > $maxMemory * 1048576) {
                    $this->warn("Mémoire au-delà de {$maxMemory} Mo : arrêt propre, Supervisor relancera le scan.");

                    break;
                }

                if ($maxPasses !== 0 && $pass >= $maxPasses) {
                    break;
                }

                $this->pause($sleepSeconds);
                if ($this->shouldStop()) {
                    $this->info('Arrêt demandé : scan arrêté proprement.');

                    break;
                }
            }
        } finally {
            Cache::forget('pronofoot.scan.running');
            Cache::forget(self::STOP_FLAG);
        }

        return $errors === 0 ? self::SUCCESS : self::FAILURE;
    }

    private function handlePassFailure(Throwable $exception, DatabaseReconnector $reconnector): void
    {
        $message = SecretRedactor::fromEnvironment()->redact(class_basename($exception).' : '.$exception->getMessage());
        if ($this->causedByLostConnection($exception)) {
            $this->warn('Connexion à la base perdue : reconnexion au prochain passage.');
            Log::warning('Connexion à la base perdue pendant le scan ; reconnexion.', ['error' => $message]);
            try {
                $reconnector->reconnect();
            } catch (Throwable) {
                // La base est encore indisponible : nouvel essai au passage suivant.
            }

            return;
        }

        $this->error('Erreur pendant le passage, le scan continue : '.mb_substr($message, 0, 300));
        Log::error('Erreur pendant un passage de scan ; la boucle continue.', ['error' => $message]);
    }

    private function shouldStop(): bool
    {
        if ($this->stopRequested) {
            return true;
        }

        try {
            return Cache::get(self::STOP_FLAG) === true;
        } catch (Throwable) {
            return false;
        }
    }

    /**
     * Pause découpée en secondes pour réagir vite à une demande d’arrêt.
     */
    private function pause(int $seconds): void
    {
        for ($elapsed = 0; $elapsed < $seconds; $elapsed++) {
            if ($this->shouldStop()) {
                return;
            }

            sleep(1);
        }
    }
}
