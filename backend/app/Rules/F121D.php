<?php

namespace App\Rules;

final class F121D
{
    public function evaluate(RuleInput $input, RuleConfiguration $configuration): RuleResult
    {
        if (! in_array([$input->homeScore, $input->awayScore], [[2, 3], [3, 2]], true)) {
            return new RuleResult(
                ruleId: 'F121-D',
                verdict: RuleVerdict::NotDefined,
                reason: 'Les documents donnent les scores 2–3 et 3–2 comme exemples, sans définir les autres scores concernés.',
            );
        }

        $homeNextOdds = $input->exactScoreOdds[($input->homeScore + 1)."-{$input->awayScore}"] ?? null;
        $awayNextOdds = $input->exactScoreOdds["{$input->homeScore}-".($input->awayScore + 1)] ?? null;

        if (! $this->isValidOdds($homeNextOdds) || ! $this->isValidOdds($awayNextOdds)) {
            return new RuleResult(
                ruleId: 'F121-D',
                verdict: RuleVerdict::Abstain,
                reason: 'Les deux cotes des scores suivants sont nécessaires.',
            );
        }

        $isCandidate = (float) $homeNextOdds < $configuration->upcomingScoreOddsLimit
            && (float) $awayNextOdds < $configuration->upcomingScoreOddsLimit;

        return new RuleResult(
            ruleId: 'F121-D',
            verdict: $isCandidate ? RuleVerdict::Candidate : RuleVerdict::NoSignal,
            suggestedAction: $isCandidate
                ? ($configuration->conditionalOverSuggestion ?? 'Over 4.5')
                : null,
            score: $input->methodScores['F121-D'] ?? null,
            reason: $isCandidate ? null : 'Toutes les cotes des scores suivants ne sont pas sous le seuil configuré.',
            details: [
                'homeNextOdds' => (float) $homeNextOdds,
                'awayNextOdds' => (float) $awayNextOdds,
                'oddsLimit' => $configuration->upcomingScoreOddsLimit,
            ],
        );
    }

    private function isValidOdds(mixed $odds): bool
    {
        return is_numeric($odds) && is_finite((float) $odds) && (float) $odds > 0;
    }
}
