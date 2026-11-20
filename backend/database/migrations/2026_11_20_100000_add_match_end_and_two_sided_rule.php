<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Retours du client (20 novembre 2026) :
 *  - fin de match : relevés consécutifs absents du flux, date et motif de fin ;
 *  - règle F121 pour les deux équipes : première cote après un but conservée pour chaque équipe ;
 *  - Journal : un relevé identique au précédent met à jour la ligne existante (compteur) au lieu d’en créer une.
 */
return new class extends Migration
{
    private const SETTINGS = [
        'scan.missing_readings_before_end' => ['4', 'integer', 'Nombre de relevés consécutifs sans le match dans le flux en direct avant de le considérer terminé (environ 2 minutes à 30 s).', false],
        'scan.max_match_duration_minutes' => ['270', 'integer', 'Un match dont le coup d’envoi date de plus de ce nombre de minutes est retiré du suivi (4 h 30).', false],
        'scan.idle_interval_seconds' => ['300', 'integer', 'Pause entre deux appels quand aucun match n’est suivi et qu’aucun match des championnats suivis n’est en direct.', true],
    ];

    public function up(): void
    {
        Schema::table('tracked_matches', function (Blueprint $table): void {
            $table->unsignedSmallInteger('missing_readings')->default(0)->after('no_scan_since');
            $table->timestamp('ended_at')->nullable()->after('missing_readings');
            $table->string('ended_reason')->nullable()->after('ended_at');
            $table->json('post_goal_references')->nullable()->after('post_goal_reference_odds');
        });

        Schema::table('opportunity_logs', function (Blueprint $table): void {
            $table->unsignedInteger('repeat_count')->default(1)->after('reason');
            $table->timestamp('first_evaluated_at')->nullable()->after('repeat_count');
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

        Schema::table('opportunity_logs', function (Blueprint $table): void {
            $table->dropColumn(['repeat_count', 'first_evaluated_at']);
        });

        Schema::table('tracked_matches', function (Blueprint $table): void {
            $table->dropColumn(['missing_readings', 'ended_at', 'ended_reason', 'post_goal_references']);
        });
    }
};
