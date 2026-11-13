<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Annexe Phase 1 corrigée, sections 5 et 6 : mode économie du quota et suivi automatique des championnats majeurs.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tracked_matches', function (Blueprint $table): void {
            $table->string('tracking_mode', 16)->default('manual')->after('is_active');
        });

        $now = now();
        $settings = [
            'scan.quota_economy_percent' => ['10', 'decimal', 'Mode économie et alerte de quota lorsque les requêtes restantes atteignent ce pourcentage du quota journalier (en-tête x-ratelimit-requests-limit).', false],
            'scan.hot_interval_seconds' => ['30', 'integer', 'Mode économie : fréquence de scan des matchs chauds.', false],
            'scan.calm_interval_seconds' => ['120', 'integer', 'Mode économie : fréquence de scan des matchs calmes.', false],
            'scan.hot_gap_threshold' => ['1.50', 'decimal', 'Mode économie : un écart inférieur à ce seuil (ou une baisse de cote) rend le match chaud.', false],
            'scan.no_scan_gap_threshold' => ['2.00', 'decimal', 'Mode économie : au-delà de cet écart, le match n’est pas scanné. Entre le seuil chaud et celui-ci : match calme (à confirmer).', true],
            'scan.auto_mode' => ['1', 'boolean', 'Suivi automatique des matchs des championnats majeurs, en plus du Scan Ciblé.', false],
            'scan.auto_league_ids' => [json_encode([39, 140, 135, 78, 61, 2, 3], JSON_THROW_ON_ERROR), 'json', 'Identifiants API-Football des ligues suivies automatiquement : Premier League, Liga, Serie A, Bundesliga, Ligue 1, Ligue des champions, Europa League.', false],
        ];

        foreach ($settings as $key => [$value, $type, $description, $needsConfirmation]) {
            DB::table('settings')->updateOrInsert(['key' => $key], [
                'value' => $value,
                'type' => $type,
                'description' => $description,
                'needs_confirmation' => $needsConfirmation,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        DB::table('settings')->where('key', 'scan.quota_alert_threshold')->delete();
    }

    public function down(): void
    {
        DB::table('settings')->whereIn('key', [
            'scan.quota_economy_percent',
            'scan.hot_interval_seconds',
            'scan.calm_interval_seconds',
            'scan.hot_gap_threshold',
            'scan.no_scan_gap_threshold',
            'scan.auto_mode',
            'scan.auto_league_ids',
        ])->delete();

        Schema::table('tracked_matches', function (Blueprint $table): void {
            $table->dropColumn('tracking_mode');
        });
    }
};
