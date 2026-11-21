<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Réglages du résultat automatique confirmés par le client (21 novembre 2026) : pari valable jusqu’à la fin du match,
 * prolongation comptée comme le temps réglementaire. Les valeurs actuelles sont conservées.
 */
return new class extends Migration
{
    private const KEYS = ['results.bet_validity', 'results.count_extra_time'];

    public function up(): void
    {
        DB::table('settings')->whereIn('key', self::KEYS)->update(['needs_confirmation' => false, 'updated_at' => now()]);
    }

    public function down(): void
    {
        DB::table('settings')->whereIn('key', self::KEYS)->update(['needs_confirmation' => true, 'updated_at' => now()]);
    }
};
