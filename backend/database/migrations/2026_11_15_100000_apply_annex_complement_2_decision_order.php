<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Complément 2 de l’annexe Phase 1 : nouvel ordre de décision (F162-Bis prioritaire, F121-G à 0.50), score « élevé »
 * de F121-D en nombre de buts (à confirmer), règle facultative des minutes restantes (désactivée, à confirmer).
 */
return new class extends Migration
{
    private const PIPELINE = ['F121-E2', 'F121-D', 'vitality', 'trend_drop', 'trend_rise', 'gap_negative', 'gap_too_high', 'gap_small'];

    public function up(): void
    {
        $now = now();
        $settings = [
            'rules.decision_pipeline' => [json_encode(self::PIPELINE, JSON_THROW_ON_ERROR), 'json', 'Ordre de décision du complément 2 : E2 mi-temps, F121-D, vitalité, forte baisse (F162-Bis), hausse, écart négatif (F121-E1), écart > seuil (F121-G), petit écart (alerte haute). Les étapes facultatives « minutes_remaining » et « convergence » s’activent par leur paramètre.', true],
            'rules.open_match_min_goals' => ['4', 'integer', 'F121-D : nombre minimal de buts pour un score « élevé ». À confirmer.', true],
            'rules.abstention_gap_threshold' => ['0.50', 'decimal', 'F121-G : au-delà de cet écart positif (sans forte baisse), abstention ; entre 0 exclu et ce seuil inclus, alerte haute.', false],
            'rules.minutes_remaining_enabled' => ['0', 'boolean', 'Règle facultative hors pseudo-code du client : abstention s’il reste moins de N minutes de jeu. Désactivée, à confirmer.', true],
            'rules.minutes_remaining_min' => ['10', 'integer', 'N minutes de jeu restantes (sur 90) sous lesquelles la règle facultative s’abstient. À confirmer.', true],
            'tendance_seuil_stable' => ['5', 'decimal', 'Forte baisse : une baisse de la cote suggérée de plus de ce pourcentage en 2 minutes déclenche F162-Bis (alerte critique). Une hausse donne une abstention.', false],
            'rules.maximum_directional_gap' => ['1.50', 'decimal', 'F121-A (1.50) : inactif dans l’ordre du complément 2, conservé comme paramètre.', false],
            'rules.zero_zero_odds_wait_threshold' => ['2.50', 'decimal', 'Règle 0-0 du CDC : inactive dans l’ordre du complément 2, conservée comme paramètre.', false],
            'rules.zero_zero_gap_threshold' => ['1.00', 'decimal', 'Règle 0-0 du CDC : inactive dans l’ordre du complément 2, conservée comme paramètre.', false],
        ];

        foreach ($settings as $key => [$value, $type, $description, $needsConfirmation]) {
            $exists = DB::table('settings')->where('key', $key)->exists();
            DB::table('settings')->updateOrInsert(['key' => $key], [
                'value' => $value,
                'type' => $type,
                'description' => $description,
                'needs_confirmation' => $needsConfirmation,
                'updated_at' => $now,
                ...($exists ? [] : ['created_at' => $now]),
            ]);
        }

        DB::table('settings')->where('key', 'rules.open_match_scores')->delete();

        foreach (DB::table('rule_profiles')->get(['id', 'settings']) as $profile) {
            $profileSettings = json_decode((string) $profile->settings, true) ?: [];
            $activeRules = $profileSettings['active_rules'] ?? [];
            if (is_array($activeRules) && in_array('F121-E1', $activeRules, true) && ! in_array('F162-Bis', $activeRules, true)) {
                $profileSettings['active_rules'] = [...$activeRules, 'F162-Bis'];
                DB::table('rule_profiles')->where('id', $profile->id)->update([
                    'settings' => json_encode($profileSettings, JSON_THROW_ON_ERROR),
                    'updated_at' => $now,
                ]);
            }
        }
    }

    public function down(): void
    {
        DB::table('settings')->whereIn('key', [
            'rules.open_match_min_goals',
            'rules.abstention_gap_threshold',
            'rules.minutes_remaining_enabled',
            'rules.minutes_remaining_min',
        ])->delete();
    }
};
