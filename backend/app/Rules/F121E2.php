<?php

namespace App\Rules;

/**
 * F121-E2 (signal mi-temps) : à la mi-temps, cote Under 2.5 (total du match) entre deux bornes incluses.
 */
final class F121E2
{
    public const ACTION = 'Over 0.5 buts en 2ème mi-temps';

    public function evaluate(RuleInput $input, RuleConfiguration $configuration): RuleResult
    {
        if ($input->halftime !== true) {
            return new RuleResult(
                ruleId: 'F121-E2',
                verdict: RuleVerdict::NoSignal,
                reason: 'Le match n’est pas à la mi-temps.',
            );
        }

        $odds = $input->under25Odds;
        if ($odds === null || ! is_finite($odds) || $odds <= 0) {
            return new RuleResult(
                ruleId: 'F121-E2',
                verdict: RuleVerdict::Abstain,
                reason: 'La cote Under 2.5 (total du match) est indisponible.',
            );
        }

        $isCandidate = $odds >= $configuration->halftimeUnderMinimum
            && $odds <= $configuration->halftimeUnderMaximum;

        return new RuleResult(
            ruleId: 'F121-E2',
            verdict: $isCandidate ? RuleVerdict::Candidate : RuleVerdict::NoSignal,
            suggestedAction: $isCandidate ? self::ACTION : null,
            score: $input->methodScores['F121-E2'] ?? null,
            reason: $isCandidate ? null : 'La cote Under 2.5 est hors de la plage du signal mi-temps.',
            details: [
                'under25Odds' => $odds,
                'minimum' => $configuration->halftimeUnderMinimum,
                'maximum' => $configuration->halftimeUnderMaximum,
            ],
        );
    }
}
