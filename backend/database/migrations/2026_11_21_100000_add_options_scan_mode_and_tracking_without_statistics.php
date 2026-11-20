<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Retours du client (21 novembre 2026) :
 *  - suivi sans statistiques quand les cotes de score exact sont disponibles ;
 *  - mode de scan (automatique / manuel) et pause ;
 *  - F121-X (écart croisé) et F121-C.2 (suivre le leader), désactivées et à confirmer.
 */
return new class extends Migration
{
    private const SETTINGS = [
        'scan.allow_tracking_without_statistics' => ['1', 'boolean', 'Autorise le suivi d’un match dont la ligue ne couvre pas les statistiques, si ses cotes de score exact sont disponibles. Vitalité non disponible : son filtre n’est pas appliqué (à confirmer).', true],
        'scan.paused' => ['0', 'boolean', 'Scan en pause : aucun appel API tant que le scan n’est pas repris.', false],
        'rules.f121x_enabled' => ['0', 'boolean', 'F121-X : pari neutre (un but de plus) si l’écart croisé |écart domicile − écart extérieur| est sous le seuil dans un match ouvert.', true],
        'rules.f121x_cross_gap_max' => ['1.00', 'decimal', 'F121-X : écart croisé maximal.', true],
        'rules.follow_leader_enabled' => ['0', 'boolean', 'F121-C.2 : si une équipe mène de 2 buts ou plus, seule cette équipe est évaluée.', true],
    ];

    public function up(): void
    {
        Schema::table('tracked_matches', function (Blueprint $table): void {
            $table->boolean('statistics_available')->nullable()->after('tracking_mode');
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

        DB::table('settings')->where('key', 'scan.auto_mode')->update([
            'description' => 'Mode de scan : automatique (championnats suivis et matchs ajoutés à la main) ou manuel (matchs ajoutés à la main seulement).',
        ]);
    }

    public function down(): void
    {
        DB::table('settings')->whereIn('key', array_keys(self::SETTINGS))->delete();

        Schema::table('tracked_matches', function (Blueprint $table): void {
            $table->dropColumn('statistics_available');
        });
    }
};
