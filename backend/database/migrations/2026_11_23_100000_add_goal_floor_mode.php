<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Mode Plancher (annexe client « Quoi coder v2 », 23 novembre 2026) : trois scans par match suivi (départ, pause,
 * soixante), jamais à chaque but. Détail de chaque scan au Journal (colonne plancher) et scans déjà faits par match.
 */
return new class extends Migration
{
    private const SETTINGS = [
        'plancher.scan_depart_enabled' => ['1', 'boolean', 'Scan Plancher « départ » (1re mi-temps). Point ouvert du document : le scan à 3 minutes n’a jamais été testé (seul 11 minutes l’est).', true],
        'plancher.depart_minute_from' => ['3', 'integer', 'Scan « départ » : première minute de la fenêtre (incluse).', false],
        'plancher.depart_minute_to' => ['11', 'integer', 'Scan « départ » : dernière minute de la fenêtre (incluse).', false],
        'plancher.scan_pause_enabled' => ['1', 'boolean', 'Scan Plancher « pause » (statut mi-temps) : c’est le scan E2, actif seulement si F121-E2 est cochée dans le profil actif.', false],
        'plancher.scan_soixante_enabled' => ['1', 'boolean', 'Scan Plancher « soixante » (2e mi-temps). Point ouvert du document : logique à confirmer (peu de temps restant).', true],
        'plancher.soixante_minute_from' => ['60', 'integer', 'Scan « soixante » : première minute de la fenêtre (incluse).', false],
        'plancher.soixante_minute_to' => ['65', 'integer', 'Scan « soixante » : dernière minute de la fenêtre (incluse).', false],
        'plancher.notify_depart' => ['1', 'boolean', 'Alerte Telegram pour le scan « départ » (sinon Journal seulement).', false],
        'plancher.notify_pause' => ['1', 'boolean', 'Alerte Telegram pour le scan « pause » (sinon Journal seulement).', false],
        'plancher.notify_soixante' => ['1', 'boolean', 'Alerte Telegram pour le scan « soixante » (sinon Journal seulement).', false],
        'plancher.score_odds_limit' => ['8.00', 'decimal', 'Plancher : scores exacts retenus si leur cote est inférieure ou égale à ce seuil (8.00 inclus).', false],
        'plancher.low_value_odds' => ['1.25', 'decimal', 'Plancher : un pari dont la cote est sous ce seuil est marqué « valeur faible », sans être bloqué.', false],
    ];

    public function up(): void
    {
        Schema::table('opportunity_logs', function (Blueprint $table): void {
            $table->json('plancher')->nullable()->after('confidence');
        });
        Schema::table('tracked_matches', function (Blueprint $table): void {
            $table->json('plancher_scans')->nullable()->after('post_goal_references');
        });

        foreach (self::SETTINGS as $key => [$value, $type, $description, $needsConfirmation]) {
            DB::table('settings')->updateOrInsert(['key' => $key], [
                'value' => $value,
                'type' => $type,
                'description' => $description,
                'needs_confirmation' => $needsConfirmation,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        DB::table('settings')->whereIn('key', array_keys(self::SETTINGS))->delete();
        Schema::table('tracked_matches', function (Blueprint $table): void {
            $table->dropColumn('plancher_scans');
        });
        Schema::table('opportunity_logs', function (Blueprint $table): void {
            $table->dropColumn('plancher');
        });
    }
};
