<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Score de confiance automatique (document client V12) : score et détail par règle conservés avec chaque évaluation.
 * Seuil de validation abaissé à 55 % sur les profils « v11 » et « V11.9 » (l’étape « convergence » reste désactivée).
 */
return new class extends Migration
{
    private const PROFILES = ['v11', 'V11.9'];

    public function up(): void
    {
        Schema::table('opportunity_logs', function (Blueprint $table): void {
            $table->json('confidence')->nullable()->after('filter_results');
        });

        $this->setThreshold(55.0);
    }

    public function down(): void
    {
        Schema::table('opportunity_logs', function (Blueprint $table): void {
            $table->dropColumn('confidence');
        });

        // Valeurs précédentes : v11 = 70, V11.9 = 75.
        $this->setThreshold(null, ['v11' => 70.0, 'V11.9' => 75.0]);
    }

    /**
     * @param  array<string, float>  $previous
     */
    private function setThreshold(?float $threshold, array $previous = []): void
    {
        foreach (DB::table('rule_profiles')->whereIn('name', self::PROFILES)->get(['id', 'name', 'settings']) as $profile) {
            $settings = json_decode((string) $profile->settings, true);
            if (! is_array($settings)) {
                continue;
            }

            $settings['validation_threshold'] = $threshold ?? ($previous[$profile->name] ?? null);
            DB::table('rule_profiles')->where('id', $profile->id)->update(['settings' => json_encode($settings), 'updated_at' => now()]);
        }
    }
};
