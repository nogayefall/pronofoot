<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

/**
 * Demande l’arrêt propre de scan:run, y compris sous Windows où les signaux ne sont pas disponibles.
 */
class StopScan extends Command
{
    protected $signature = 'scan:stop';

    protected $description = 'Demander l’arrêt propre du scan continu à la fin du passage en cours.';

    public function handle(): int
    {
        Cache::put(RunScan::STOP_FLAG, true, now()->addHour());
        $this->info('Arrêt demandé : scan:run s’arrêtera à la fin du passage en cours.');

        return self::SUCCESS;
    }
}
