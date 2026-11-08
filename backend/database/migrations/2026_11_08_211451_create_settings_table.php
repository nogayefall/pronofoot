<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->longText('value')->nullable();
            $table->string('type', 24);
            $table->text('description');
            $table->boolean('needs_confirmation')->default(false);
            $table->timestamps();
        });

        $now = now();
        $settingsToInsert = [];
        $settings = [
            ['scan.odds_interval_seconds', '30', 'integer', 'Intervalle de lecture des cotes confirmé par le CDC Phase 1.', false],
            ['scan.statistics_interval_seconds', '60', 'integer', 'Intervalle de lecture des statistiques confirmé par le CDC Phase 1.', false],
            ['scan.goal_interval_seconds', '15', 'integer', 'Intervalle de relance post-but décrit dans le TRD.', false],
            ['scan.goal_window_seconds', '120', 'integer', 'Durée de relance post-but décrite dans le TRD.', false],
            ['alerts.expiration_minutes', '15', 'integer', 'Expiration d’une alerte sans but selon le CDC Phase 1.', false],
            ['rules.maximum_directional_gap', '1.50', 'decimal', 'Seuil d’écart directionnel du CDC Phase 1.', false],
            ['rules.zero_zero_odds_wait_threshold', '2.50', 'decimal', 'Seuil de cote 0-0 du CDC Phase 1.', false],
            ['rules.zero_zero_gap_threshold', '1.00', 'decimal', 'Écart requis à 0-0 selon le CDC Phase 1.', false],
            ['rules.upcoming_score_odds_limit', '7.00', 'decimal', 'Seuil des cotes des scores suivants selon le CDC Phase 1.', false],
            ['rules.minimum_vitality', '40', 'decimal', 'Vitalité minimale du CDC Phase 1.', false],
            ['rules.minimum_convergence_score', '75', 'decimal', 'Seuil de convergence du PRD/TRD, uniquement si les scores et poids sont configurés.', false],
            ['tendance_source', null, 'string', 'Source de la tendance : cote suggérée, hypothèse à confirmer par le client.', true],
            ['tendance_seuil_stable', null, 'decimal', 'Variation maximale définissant une tendance stable : à confirmer par le client.', true],
            ['rules.vitality_normalization_references', null, 'json', 'Références nécessaires à la normalisation de la vitalité : à confirmer par le client.', true],
        ];

        foreach ($settings as [$key, $value, $type, $description, $needsConfirmation]) {
            $settingsToInsert[] = [
                'key' => $key,
                'value' => $value,
                'type' => $type,
                'description' => $description,
                'needs_confirmation' => $needsConfirmation,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('settings')->insert($settingsToInsert);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
