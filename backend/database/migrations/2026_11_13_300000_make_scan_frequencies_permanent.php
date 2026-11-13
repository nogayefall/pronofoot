<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Fréquences de scan permanentes : match chaud toutes les 30 s, calme toutes les 2 min, sans opportunité jamais.
 * Définition d’un match chaud (écart < 1.50 ou baisse de cote de plus de 5 %) à confirmer par le client.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tracked_matches', function (Blueprint $table): void {
            $table->timestamp('last_scanned_at')->nullable()->after('last_goal_detected_at');
        });

        $descriptions = [
            'scan.hot_interval_seconds' => ['Fréquence de scan (statistiques et évaluation) d’un match chaud, en permanence.', false],
            'scan.calm_interval_seconds' => ['Fréquence de scan d’un match calme, en permanence. En mode économie, les matchs calmes ne sont pas scannés.', false],
            'scan.hot_gap_threshold' => ['Match chaud : écart inférieur à ce seuil, ou baisse de la cote suggérée de plus que le seuil de tendance (5 %). Définition à confirmer.', true],
            'scan.no_scan_gap_threshold' => ['Au-delà de cet écart, le match n’est pas scanné (écart entre le seuil chaud et celui-ci : match calme, à confirmer).', true],
            'scan.statistics_interval_seconds' => ['Durée pendant laquelle des statistiques restent assez récentes pour calculer la vitalité. La fréquence des appels suit les matchs chauds et calmes.', false],
        ];
        foreach ($descriptions as $key => [$description, $needsConfirmation]) {
            DB::table('settings')->where('key', $key)->update([
                'description' => $description,
                'needs_confirmation' => $needsConfirmation,
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::table('tracked_matches', function (Blueprint $table): void {
            $table->dropColumn('last_scanned_at');
        });
    }
};
