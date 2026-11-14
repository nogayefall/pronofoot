<?php

namespace App\Rules;

/**
 * Écart de l’équipe désignée (complément 2) : négatif = alerte critique (F121-E1), entre 0 exclu et 0.50 inclus =
 * alerte haute, au-dessus de 0.50 = abstention (F121-G), nul = abstention. Le filtre est validé quand l’écart
 * permet une alerte. Le seuil de 1.50 (F121-A) et la règle du 0-0 restent des paramètres inactifs.
 */
final class GapFilter
{
    public function evaluate(
        RuleInput $input,
        RuleConfiguration $configuration,
        ?RuleResult $directionalResult,
    ): FilterResult {
        $details = $directionalResult?->details ?? [];
        $selectedGap = $details['selectedGap'] ?? null;
        $selectedTeam = $details['selectedTeam'] ?? null;

        if ($directionalResult?->verdict !== RuleVerdict::Candidate
            || ! is_numeric($selectedGap)
            || ! in_array($selectedTeam, ['home', 'away'], true)) {
            return new FilterResult(false, 'Aucun écart directionnel exploitable.');
        }

        $gap = round((float) $selectedGap, 6);
        $limit = $configuration->abstentionGapThreshold;
        $reason = match (true) {
            $gap < 0 => null,
            $gap == 0.0 => 'Écart nul : abstention.',
            $gap > $limit => 'Écart positif supérieur au seuil d’abstention (F121-G).',
            default => null,
        };

        return new FilterResult(
            passed: $reason === null,
            reason: $reason,
            details: [
                'selectedTeam' => $selectedTeam,
                'selectedGap' => (float) $selectedGap,
                'limit' => $limit,
            ],
        );
    }
}
