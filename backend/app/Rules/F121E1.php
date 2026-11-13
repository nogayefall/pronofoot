<?php

namespace App\Rules;

/**
 * F121-E1 (écart négatif) : écart = cote du prochain but de l’équipe désignée − cote du score actuel.
 * Un écart négatif est une alerte critique ; positif ou nul, F121-E1 ne produit pas de signal.
 */
final class F121E1
{
    public function evaluate(RuleInput $input, ?RuleResult $designation): RuleResult
    {
        $details = $designation?->details ?? [];
        $selectedGap = $details['selectedGap'] ?? null;
        if ($designation?->verdict !== RuleVerdict::Candidate || ! is_numeric($selectedGap)) {
            return new RuleResult(
                ruleId: 'F121-E1',
                verdict: RuleVerdict::Abstain,
                reason: 'Aucune équipe désignée : écart non calculable.',
            );
        }

        $isNegative = (float) $selectedGap < 0;

        return new RuleResult(
            ruleId: 'F121-E1',
            verdict: $isNegative ? RuleVerdict::Candidate : RuleVerdict::NoSignal,
            score: $input->methodScores['F121-E1'] ?? null,
            reason: $isNegative ? null : 'Écart positif ou nul : pas d’écart négatif.',
            details: [
                'selectedTeam' => $details['selectedTeam'] ?? null,
                'selectedGap' => (float) $selectedGap,
            ],
        );
    }
}
