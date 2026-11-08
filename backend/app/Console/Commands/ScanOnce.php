<?php

namespace App\Console\Commands;

use App\Services\ScanService;
use Illuminate\Console\Command;
use InvalidArgumentException;

class ScanOnce extends Command
{
    protected $signature = 'scan:once {--scan-number=0 : Index du scénario fictif à rejouer}';

    protected $description = 'Exécuter un cycle unique de scan des matchs suivis.';

    public function handle(ScanService $scanner): int
    {
        $scanNumber = filter_var($this->option('scan-number'), FILTER_VALIDATE_INT);
        if ($scanNumber === false || $scanNumber < 0) {
            throw new InvalidArgumentException('--scan-number doit être un entier positif ou nul.');
        }

        $result = $scanner->runOnce((int) $scanNumber);

        $this->info("Matchs analysés : {$result->matchesScanned}");
        $this->info("Instantanés enregistrés : {$result->snapshotsStored}");
        $this->info("Alertes créées : {$result->alertsCreated}");
        $this->info("Alertes expirées : {$result->alertsExpired}");
        $this->info("Buts détectés : {$result->goalsDetected}");
        $this->info("Incidents : {$result->errors}");

        return $result->errors === 0 ? self::SUCCESS : self::FAILURE;
    }
}
