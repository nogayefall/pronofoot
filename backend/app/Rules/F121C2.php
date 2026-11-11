<?php

namespace App\Rules;

final class F121C2
{
    public function evaluate(RuleInput $input, RuleResult $directionalResult): RuleResult
    {
        $details = $directionalResult->details;
        if ($directionalResult->reason === F121C::NEGATIVE_GAP_REASON) {
            return new RuleResult(
                ruleId: 'F121-C.2',
                verdict: RuleVerdict::Abstain,
                reason: F121C::NEGATIVE_GAP_REASON,
                details: $details,
            );
        }

        $homeGap = $details['homeGap'] ?? null;
        $awayGap = $details['awayGap'] ?? null;

        if (! is_numeric($homeGap) || ! is_numeric($awayGap)) {
            return new RuleResult(
                ruleId: 'F121-C.2',
                verdict: RuleVerdict::Abstain,
                reason: 'Les écarts F121-C sont nécessaires pour évaluer F121-C.2.',
            );
        }

        $goalDifference = $input->homeScore - $input->awayScore;
        if (abs($goalDifference) < 2) {
            return new RuleResult(
                ruleId: 'F121-C.2',
                verdict: RuleVerdict::NoSignal,
                reason: 'Le score ne présente pas un avantage d’au moins deux buts.',
                details: $details,
            );
        }

        $selectedTeam = $goalDifference > 0 ? 'home' : 'away';
        $selectedGap = $goalDifference > 0 ? (float) $homeGap : (float) $awayGap;

        return new RuleResult(
            ruleId: 'F121-C.2',
            verdict: RuleVerdict::Candidate,
            score: $input->methodScores['F121-C.2'] ?? null,
            details: [
                ...$details,
                'selectedTeam' => $selectedTeam,
                'selectedGap' => $selectedGap,
                'leaderOverrideApplied' => true,
            ],
        );
    }
}
