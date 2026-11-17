<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Complément 4 : première cote relevée après le dernier but (point de départ de la tendance après un but).
 * Remise à zéro à chaque nouveau but ; l’historique des relevés n’est jamais supprimé.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tracked_matches', function (Blueprint $table): void {
            $table->string('post_goal_reference_score', 10)->nullable()->after('last_goal_detected_at');
            $table->decimal('post_goal_reference_odds', 10, 3)->nullable()->after('post_goal_reference_score');
        });
    }

    public function down(): void
    {
        Schema::table('tracked_matches', function (Blueprint $table): void {
            $table->dropColumn(['post_goal_reference_score', 'post_goal_reference_odds']);
        });
    }
};
