<?php

namespace App\Rules;

final class RuleEngine
{
    public function __construct(
        private readonly F121C $f121C = new F121C,
        private readonly F121C2 $f121C2 = new F121C2,
        private readonly F121D $f121D = new F121D,
        private readonly UndefinedRule $undefinedRule = new UndefinedRule,
        private readonly GapFilter $gapFilter = new GapFilter,
        private readonly TrendFilter $trendFilter = new TrendFilter,
        private readonly VitalityFilter $vitalityFilter = new VitalityFilter,
        private readonly ConvergenceCalculator $convergenceCalculator = new ConvergenceCalculator,
    ) {}

    public function evaluate(RuleInput $input, RuleConfiguration $configuration): EngineResult
    {
        $directionalResult = $this->f121C->evaluate($input);
        $leaderResult = $this->f121C2->evaluate($input, $directionalResult);
        $highScoreResult = $this->f121D->evaluate($input, $configuration);
        $availableRules = [
            'F121-C' => $directionalResult,
            'F121-C.2' => $leaderResult,
            'F121-D' => $highScoreResult,
        ];

        $rules = [];
        foreach ($configuration->activeRules as $ruleId) {
            $rules[$ruleId] = $availableRules[$ruleId] ?? $this->undefinedRule->evaluate($ruleId);
        }

        $activeDirectionalResult = $rules['F121-C.2'] ?? $rules['F121-C'] ?? null;
        if ($activeDirectionalResult?->verdict !== RuleVerdict::Candidate) {
            $activeDirectionalResult = $rules['F121-C'] ?? null;
        }

        $filters = [
            'gap' => $this->gapFilter->evaluate($input, $configuration, $activeDirectionalResult),
            'trend' => $this->trendFilter->evaluate($input, $configuration),
            'vitality' => $this->vitalityFilter->evaluate($input, $configuration),
        ];

        $convergenceScore = $this->convergenceCalculator->calculate(
            $input->methodScores,
            $configuration->methodWeights,
        );
        $hasCandidate = false;
        foreach ($rules as $rule) {
            if ($rule->verdict === RuleVerdict::Candidate) {
                $hasCandidate = true;
                break;
            }
        }

        $filtersPassed = true;
        foreach ($filters as $filter) {
            if (! $filter->passed) {
                $filtersPassed = false;
                break;
            }
        }

        $shouldAlert = $hasCandidate
            && $filtersPassed
            && $convergenceScore !== null
            && $convergenceScore > $configuration->minimumConvergenceScore;

        $reason = match (true) {
            ! $hasCandidate => 'Aucune règle active n’a produit de signal.',
            ! $filtersPassed => 'Au moins un des trois filtres de sécurité n’est pas validé.',
            $convergenceScore === null => 'La convergence ne peut pas être calculée sans les scores et poids définis.',
            $convergenceScore <= $configuration->minimumConvergenceScore => 'Le score de convergence ne dépasse pas le seuil configuré.',
            default => 'Les règles, les filtres et le seuil de convergence sont validés.',
        };

        return new EngineResult(
            shouldAlert: $shouldAlert,
            convergenceScore: $convergenceScore,
            rules: $rules,
            filters: $filters,
            reason: $reason,
        );
    }
}
