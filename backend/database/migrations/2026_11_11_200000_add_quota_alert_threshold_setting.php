<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('settings')->updateOrInsert(
            ['key' => 'scan.quota_alert_threshold'],
            [
                'value' => null,
                'type' => 'integer',
                'description' => 'Nombre de requêtes restantes sous lequel le scan s’arrête : à confirmer par le client. Sans valeur, le scan s’arrête seulement à quota nul.',
                'needs_confirmation' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        );
    }

    public function down(): void
    {
        DB::table('settings')->where('key', 'scan.quota_alert_threshold')->delete();
    }
};
