<?php

namespace App\Rules;

final class F121C
{
    public function evaluate(RuleInput $input): RuleResult
    {
        $currentScoreKey = "{$input->homeScore}-{$input->awayScore}";
        $homeNextScoreKey = ($input->homeScore + 1)."-{$input->awayScore}";
        $awayNextScoreKey = "{$input->homeScore}-".($input->awayScore + 1);

        $currentOdds = $input->exactScoreOdds[$currentScoreKey] ?? null;
        $homeNextOdds = $input->exactScoreOdds[$homeNextScoreKey] ?? null;
        $awayNextOdds = $input->exactScoreOdds[$awayNextScoreKey] ?? null;

        if (! $this->isValidOdds($currentOdds)
            || ! $this->isValidOdds($homeNextOdds)
            || ! $this->isValidOdds($awayNextOdds)) {
            return new RuleResult(
                ruleId: 'F121-C',
                verdict: RuleVerdict::Abstain,
                reason: 'Les cotes du score actuel et des deux scores suivants sont nécessaires.',
            );
        }

        $homeGap = (float) $homeNextOdds - (float) $currentOdds;
        $awayGap = (float) $awayNextOdds - (float) $currentOdds;
        $selectedTeam = match (true) {
            $homeGap < $awayGap => 'home',
            $awayGap < $homeGap => 'away',
            default => null,
        };
        $selectedGap = match ($selectedTeam) {
            'home' => $homeGap,
            'away' => $awayGap,
            default => null,
        };

        return new RuleResult(
            ruleId: 'F121-C',
            verdict: $selectedTeam === null ? RuleVerdict::Abstain : RuleVerdict::Candidate,
            score: $input->methodScores['F121-C'] ?? null,
            reason: $selectedTeam === null ? 'Les deux écarts sont égaux; aucune direction n’est définie.' : null,
            details: [
                'currentOdds' => (float) $currentOdds,
                'homeNextOdds' => (float) $homeNextOdds,
                'awayNextOdds' => (float) $awayNextOdds,
                'homeGap' => $homeGap,
                'awayGap' => $awayGap,
                'selectedTeam' => $selectedTeam,
                'selectedGap' => $selectedGap,
            ],
        );
    }

    private function isValidOdds(mixed $odds): bool
    {
        return is_numeric($odds) && is_finite((float) $odds) && (float) $odds > 0;
    }
}
