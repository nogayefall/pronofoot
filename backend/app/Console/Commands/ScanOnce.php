<?php

namespace App\Console\Commands;

use App\Services\QuotaGuard;
use App\Services\ScanService;
use Illuminate\Console\Command;
use InvalidArgumentException;

class ScanOnce extends Command
{
    protected $signature = 'scan:once {--scan-number=0 : Index du scénario fictif à rejouer}';

    protected $description = 'Exécuter un cycle unique de scan des matchs suivis.';

    /**
     * Libellés français des types d’incidents consignés par le scan.
     */
    private const INCIDENT_LABELS = [
        'football_data_missing' => 'données du match manquantes',
        'football_provider_unavailable' => 'fournisseur football indisponible',
        'odds_provider_unavailable' => 'fournisseur de cotes indisponible',
        'odds_market_unavailable' => 'marché des scores exacts indisponible',
        'odds_data_missing' => 'cotes du match manquantes',
        'statistics_unavailable' => 'statistiques indisponibles',
        'match_stopped' => 'match arrêté',
        'quota_threshold_reached' => 'quota API atteint',
    ];

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
        $this->info('Incidents : '.count($result->incidents));
        foreach ($result->incidents as $incident) {
            $type = self::INCIDENT_LABELS[$incident['type']] ?? $incident['type'];
            $this->warn("  - {$incident['match']} : {$type} — {$incident['reason']}");
        }

        if ($result->economyMode) {
            $this->warn('Mode économie du quota : seuls les matchs chauds sont scannés.');
        }
        if ($result->matchesNotScanned > 0) {
            $this->info("Matchs non scannés à ce passage (calmes pas encore dus, sans opportunité ou hors économie) : {$result->matchesNotScanned}");
        }
        if ($result->autoTracked > 0) {
            $this->info("Matchs ajoutés automatiquement : {$result->autoTracked}");
        }
        if ($result->quotaStopped) {
            $this->error(QuotaGuard::EXHAUSTED_MESSAGE);
        }

        return $result->errors === 0 ? self::SUCCESS : self::FAILURE;
    }
}
