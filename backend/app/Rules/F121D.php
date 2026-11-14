<?php

namespace App\Rules;

/**
 * F121-D (match ouvert) : score « élevé » (au moins N buts au total, N à confirmer) et cotes des deux scores
 * suivants inférieures ou égales au seuil (8.00 inclus) : pari neutre Over 4.5.
 */
final class F121D
{
    public const ACTION = 'Over 4.5 buts';

    public function evaluate(RuleInput $input, RuleConfiguration $configuration): RuleResult
    {
        $totalGoals = $input->homeScore + $input->awayScore;
        if ($totalGoals < $configuration->openMatchMinimumGoals) {
            return new RuleResult(
                ruleId: 'F121-D',
                verdict: RuleVerdict::NoSignal,
                reason: "Score de {$totalGoals} but(s) : moins que les {$configuration->openMatchMinimumGoals} buts d’un match ouvert.",
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

        $isCandidate = (float) $homeNextOdds <= $configuration->upcomingScoreOddsLimit
            && (float) $awayNextOdds <= $configuration->upcomingScoreOddsLimit;

        return new RuleResult(
            ruleId: 'F121-D',
            verdict: $isCandidate ? RuleVerdict::Candidate : RuleVerdict::NoSignal,
            suggestedAction: $isCandidate ? self::ACTION : null,
            score: $input->methodScores['F121-D'] ?? null,
            reason: $isCandidate ? null : 'Une cote des scores suivants dépasse le seuil configuré.',
            details: [
                'totalGoals' => $totalGoals,
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
