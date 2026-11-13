<?php

namespace App\Rules;

/**
 * Écart de l’équipe désignée (F121-A/G) : strictement entre 0 et le seuil (1.50, ou 1.00 à 0-0 si la cote du 0-0 est sous 2.50).
 * Un écart nul ou atteignant le seuil donne une abstention ; un écart négatif relève de F121-E1.
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

        $gap = round((float) $selectedGap, 6);
        $reason = match (true) {
            $gap < 0 => 'Écart négatif : traité par F121-E1.',
            $gap == 0.0 => 'Écart nul : abstention.',
            $gap >= $limit => 'L’écart directionnel atteint ou dépasse le seuil configuré.',
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
