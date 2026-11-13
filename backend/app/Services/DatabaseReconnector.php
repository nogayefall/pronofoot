<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

/**
 * Reconnexion à la base après une coupure détectée pendant le scan continu.
 */
class DatabaseReconnector
{
    public function reconnect(): void
    {
        DB::purge();
        DB::reconnect();
    }
}
