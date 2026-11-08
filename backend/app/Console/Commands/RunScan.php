<?php

namespace App\Console\Commands;

use App\Services\ScanService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use InvalidArgumentException;

class RunScan extends Command
{
    protected $signature = 'scan:run
        {--max-passes=0 : Arrêter après ce nombre de cycles (0 = continu)}
        {--scan-number=0 : Index initial du scénario fictif à rejouer}';

    protected $description = 'Scanner en continu les matchs suivis, avec des cycles accélérés après un but.';

    public function handle(ScanService $scanner): int
    {
        $maxPasses = filter_var($this->option('max-passes'), FILTER_VALIDATE_INT);
        $scanNumber = filter_var($this->option('scan-number'), FILTER_VALIDATE_INT);

        if ($maxPasses === false || $maxPasses < 0 || $scanNumber === false || $scanNumber < 0) {
            throw new InvalidArgumentException('Les options --max-passes et --scan-number doivent être des entiers positifs ou nuls.');
        }

        $pass = 0;
        $errors = 0;
        $this->info('Scan continu actif. Arrêt avec Ctrl+C.');

        try {
            while ($maxPasses === 0 || $pass < $maxPasses) {
                $result = $scanner->runOnce((int) $scanNumber + $pass, forceRefresh: false);
                $pass++;
                $errors += $result->errors;
                Cache::put(
                    'pronofoot.scan.running',
                    true,
                    now()->addSeconds(max(60, $result->nextPollIntervalSeconds * 2)),
                );
                $this->line(sprintf(
                    '[%s] match(s) %d — alerte(s) %d — but(s) %d — incident(s) %d',
                    now()->toDateTimeString(),
                    $result->matchesScanned,
                    $result->alertsCreated,
                    $result->goalsDetected,
                    $result->errors,
                ));

                if ($maxPasses !== 0 && $pass >= $maxPasses) {
                    break;
                }

                usleep($result->nextPollIntervalSeconds * 1_000_000);
            }
        } finally {
            Cache::forget('pronofoot.scan.running');
        }

        return $errors === 0 ? self::SUCCESS : self::FAILURE;
    }
}
