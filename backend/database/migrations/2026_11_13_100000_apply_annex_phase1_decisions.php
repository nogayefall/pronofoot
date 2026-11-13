<?php

use App\Rules\RuleConfiguration;
use App\Rules\VitalityCalculator;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Décisions figées de l’annexe Phase 1 corrigée (vitalité, tendance, F121-D, F121-E1/E2).
 * L’ordre de décision et la liste des scores de match ouvert restent à confirmer.
 */
return new class extends Migration
{
    public function up(): void
    {
        $now = now();
        $updates = [
            'rules.minimum_vitality' => ['41', 'decimal', 'Vitalité minimale : ≤ 40 match « mort » (abstention), ≥ 41 « vivant » (annexe Phase 1).', false],
            'rules.upcoming_score_odds_limit' => ['8.00', 'decimal', 'F121-D : cotes des scores suivants inférieures ou égales à ce seuil (8.00 inclus, annexe Phase 1).', false],
            'tendance_source' => ['cote_suggeree', 'string', 'Tendance suivie sur la cote du score suggéré (annexe Phase 1).', false],
            'tendance_seuil_stable' => ['5', 'decimal', 'Tendance : baisse strictement supérieure à ce pourcentage = validée ; sinon abstention. Baisse exactement égale : à confirmer (abstention).', false],
            'rules.vitality_normalization_references' => [
                json_encode(VitalityCalculator::DEFAULT_SCALE, JSON_THROW_ON_ERROR),
                'json',
                'Barème de vitalité : paliers [minimum inclus, points] par statistique (totaux des deux équipes ; possession de l’équipe la plus haute).',
                false,
            ],
            'rules.halftime_under25_min' => ['1.15', 'decimal', 'F121-E2 : borne basse incluse de la cote Under 2.5 à la mi-temps.', false],
            'rules.halftime_under25_max' => ['1.40', 'decimal', 'F121-E2 : borne haute incluse de la cote Under 2.5 à la mi-temps.', false],
            'rules.open_match_scores' => [
                json_encode(['2-2', '2-3', '3-2'], JSON_THROW_ON_ERROR),
                'json',
                'F121-D : scores de match ouvert. 2-3 et 3-2 viennent du CDC, 2-2 de la situation 9 de l’annexe ; liste à confirmer.',
                true,
            ],
            'alerts.level_negative_gap' => ['Critique', 'string', 'Niveau d’alerte d’un écart négatif (F121-E1).', false],
            'alerts.level_positive_gap' => ['Haute', 'string', 'Niveau d’alerte d’un écart positif sous le seuil.', false],
            'rules.decision_pipeline' => [
                json_encode(RuleConfiguration::DEFAULT_PIPELINE, JSON_THROW_ON_ERROR),
                'json',
                'Ordre de décision lu dans les exemples du client, pas une règle écrite : à confirmer.',
                true,
            ],
        ];

        foreach ($updates as $key => [$value, $type, $description, $needsConfirmation]) {
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

        DB::table('settings')->where('key', 'ecart_negatif_comportement')->delete();
    }

    public function down(): void
    {
        DB::table('settings')->whereIn('key', [
            'rules.halftime_under25_min',
            'rules.halftime_under25_max',
            'rules.open_match_scores',
            'alerts.level_negative_gap',
            'alerts.level_positive_gap',
            'rules.decision_pipeline',
        ])->delete();
    }
};
