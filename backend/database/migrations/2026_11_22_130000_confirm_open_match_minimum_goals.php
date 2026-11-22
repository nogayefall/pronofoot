<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * F121-D confirmé par le client (22 novembre 2026) : au moins 4 buts, cotes des deux scores suivants (par exemple 3-2
 * et 2-3 pour 2-2) inférieures ou égales à 8.00. La valeur actuelle est conservée.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::table('settings')->where('key', 'rules.open_match_min_goals')->update([
            'needs_confirmation' => false,
            'description' => 'F121-D : nombre minimal de buts pour un score « élevé » (4, confirmé par le client).',
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        DB::table('settings')->where('key', 'rules.open_match_min_goals')->update([
            'needs_confirmation' => true,
            'description' => 'F121-D : nombre minimal de buts pour un score « élevé ». À confirmer.',
            'updated_at' => now(),
        ]);
    }
};
