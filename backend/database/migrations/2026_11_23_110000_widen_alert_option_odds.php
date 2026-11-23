<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Cotes des options à trois décimales (constaté au premier scan Plancher réel : 1.444 et 1.083 enregistrées 1.44 et
 * 1.08). Les options Plancher existantes reprennent la cote exacte gardée dans le Journal.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('alert_options', function (Blueprint $table): void {
            $table->decimal('odds', 8, 3)->nullable()->change();
        });

        $options = DB::table('alert_options')
            ->join('alerts', 'alerts.id', '=', 'alert_options.alert_id')
            ->join('opportunity_logs', 'opportunity_logs.id', '=', 'alerts.opportunity_log_id')
            ->whereIn('alert_options.type', ['plancher_central', 'plancher_prudent'])
            ->whereNotNull('opportunity_logs.plancher')
            ->get(['alert_options.id', 'alert_options.type', 'opportunity_logs.plancher']);
        foreach ($options as $option) {
            $plancher = json_decode((string) $option->plancher, true);
            foreach (is_array($plancher['proposals'] ?? null) ? $plancher['proposals'] : [] as $proposal) {
                if ('plancher_'.($proposal['type'] ?? '') === $option->type && is_numeric($proposal['odds'] ?? null)) {
                    DB::table('alert_options')->where('id', $option->id)->update(['odds' => (float) $proposal['odds']]);
                }
            }
        }
    }

    public function down(): void
    {
        Schema::table('alert_options', function (Blueprint $table): void {
            $table->decimal('odds', 8, 2)->nullable()->change();
        });
    }
};
