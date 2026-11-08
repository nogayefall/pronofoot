<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tracked_matches', function (Blueprint $table) {
            $table->timestamp('last_goal_detected_at')->nullable()->after('is_active');
        });

        Schema::table('match_snapshots', function (Blueprint $table) {
            $table->decimal('vitality_score', 5, 2)->nullable()->after('statistics');
            $table->decimal('odds_change_percent', 8, 3)->nullable()->after('vitality_score');
            $table->timestamp('odds_captured_at')->nullable()->after('odds_change_percent');
            $table->timestamp('statistics_captured_at')->nullable()->after('odds_captured_at');
        });

        Schema::table('opportunity_logs', function (Blueprint $table) {
            $table->string('rule_id')->nullable()->after('event_type');
            $table->string('selection')->nullable()->after('rule_id');
            $table->index(['tracked_match_id', 'rule_id', 'selection', 'decision'], 'opportunity_alert_deduplication');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tracked_matches', function (Blueprint $table) {
            $table->dropColumn('last_goal_detected_at');
        });

        Schema::table('opportunity_logs', function (Blueprint $table) {
            $table->dropIndex('opportunity_alert_deduplication');
            $table->dropColumn(['rule_id', 'selection']);
        });

        Schema::table('match_snapshots', function (Blueprint $table) {
            $table->dropColumn(['vitality_score', 'odds_change_percent', 'odds_captured_at', 'statistics_captured_at']);
        });
    }
};
