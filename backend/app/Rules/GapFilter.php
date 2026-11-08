<?php

namespace App\Rules;

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

        if (! is_numeric($selectedGap) || ! in_array($selectedTeam, ['home', 'away'], true)) {
            return new FilterResult(false, 'Aucun écart directionnel exploitable.');
        }

        $limit = $configuration->maximumDirectionalGap;
        $currentOdds = $input->exactScoreOdds["{$input->homeScore}-{$input->awayScore}"] ?? null;
        if ($input->homeScore === 0 && $input->awayScore === 0
            && is_numeric($currentOdds)
            && (float) $currentOdds < $configuration->zeroZeroOddsWaitThreshold) {
            $limit = $configuration->zeroZeroGapThreshold;
        }

        $passed = (float) $selectedGap < $limit;

        return new FilterResult(
            passed: $passed,
            reason: $passed ? null : 'L’écart directionnel ne passe pas le seuil configuré.',
            details: [
                'selectedTeam' => $selectedTeam,
                'selectedGap' => (float) $selectedGap,
                'limit' => $limit,
            ],
        );
    }
}
