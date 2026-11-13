<?php

namespace App\Rules;

/**
 * Moteur de décision Phase 1 : classe pure, sans réseau ni base de données.
 *
 * L’ordre par défaut (à confirmer par le client) : F121-E2 à la mi-temps, F121-D, désignation de l’équipe
 * (F121-C puis F121-C.2), vitalité, tendance, écart (négatif : F121-E1 ; entre 0 et le seuil : alerte haute).
 * F121-E2 et F121-D décident immédiatement ; l’écart propose une alerte que les étapes suivantes peuvent encore refuser.
 */
final class RuleEngine
{
    public function __construct(
        private readonly F121C $f121C = new F121C,
        private readonly F121C2 $f121C2 = new F121C2,
        private readonly F121D $f121D = new F121D,
        private readonly F121E1 $f121E1 = new F121E1,
        private readonly F121E2 $f121E2 = new F121E2,
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
        $designation = $this->designation($configuration, $directionalResult, $leaderResult);
        $available = [
            'F121-E2' => $this->f121E2->evaluate($input, $configuration),
            'F121-D' => $this->f121D->evaluate($input, $configuration),
            'F121-C' => $directionalResult,
            'F121-C.2' => $leaderResult,
            'F121-E1' => $this->f121E1->evaluate($input, $designation),
        ];

        $rules = [];
        foreach ($configuration->activeRules as $ruleId) {
            $rules[$ruleId] = $available[$ruleId] ?? $this->undefinedRule->evaluate($ruleId);
        }

        $filters = [
            'gap' => $this->gapFilter->evaluate($input, $configuration, $designation),
            'trend' => $this->trendFilter->evaluate($input, $configuration),
            'vitality' => $this->vitalityFilter->evaluate($input, $configuration),
        ];
        $convergenceScore = $this->convergenceCalculator->calculate($input->methodScores, $configuration->methodWeights);
        $result = fn (array $steps, string $reason, ?array $alert = null): EngineResult => new EngineResult(
            shouldAlert: $alert !== null,
            convergenceScore: $convergenceScore,
            rules: $rules,
            filters: $filters,
            reason: $reason,
            steps: $steps,
            decisiveRule: $alert['rule'] ?? null,
            level: $alert['level'] ?? null,
            selection: $alert['selection'] ?? null,
            suggestedAction: $alert['action'] ?? null,
        );

        $steps = [];
        $halftimeHandled = in_array('F121-E2', $configuration->pipeline, true) && $configuration->isActive('F121-E2');
        if ($input->halftime === true && ! $halftimeHandled) {
            $reason = 'Match à la mi-temps : seul F121-E2 peut produire une alerte, et cette étape est inactive.';
            $steps[] = ['step' => 'F121-E2', 'outcome' => 'abstention', 'reason' => $reason];

            return $result($steps, $reason);
        }

        $pendingAlert = null;
        foreach ($configuration->pipeline as $step) {
            switch ($step) {
                case 'F121-E2':
                    $rule = $available['F121-E2'];
                    if (! $configuration->isActive('F121-E2') || $input->halftime !== true) {
                        $steps[] = ['step' => $step, 'outcome' => 'non_applicable', 'reason' => $rule->reason];

                        break;
                    }

                    if ($rule->verdict === RuleVerdict::Candidate) {
                        $steps[] = ['step' => $step, 'outcome' => 'alert', 'reason' => null];

                        return $result($steps, 'Signal mi-temps : cote Under 2.5 dans la plage configurée.', [
                            'rule' => 'F121-E2',
                            'level' => 'Mi-temps',
                            'selection' => null,
                            'action' => $rule->suggestedAction,
                        ]);
                    }

                    $reason = 'Match à la mi-temps sans signal F121-E2 : '.$rule->reason;
                    $steps[] = ['step' => $step, 'outcome' => 'abstention', 'reason' => $reason];

                    return $result($steps, $reason);

                case 'F121-D':
                    $rule = $available['F121-D'];
                    if ($configuration->isActive('F121-D') && $rule->verdict === RuleVerdict::Candidate) {
                        $steps[] = ['step' => $step, 'outcome' => 'alert', 'reason' => null];

                        return $result($steps, 'Match ouvert : cotes des scores suivants sous le seuil configuré.', [
                            'rule' => 'F121-D',
                            'level' => 'Neutre',
                            'selection' => null,
                            'action' => $rule->suggestedAction,
                        ]);
                    }

                    $steps[] = ['step' => $step, 'outcome' => 'continue', 'reason' => $rule->reason];

                    break;

                case 'designation':
                    if ($designation === null || $designation->verdict !== RuleVerdict::Candidate) {
                        $reason = $designation?->reason ?? 'F121-C est inactive : aucune équipe désignée.';
                        $steps[] = ['step' => $step, 'outcome' => 'abstention', 'reason' => $reason];

                        return $result($steps, 'Aucune équipe désignée : '.$reason);
                    }

                    $steps[] = ['step' => $step, 'outcome' => 'continue', 'reason' => null];

                    break;

                case 'vitality':
                case 'trend':
                    $filter = $filters[$step];
                    if (! $filter->passed) {
                        $steps[] = ['step' => $step, 'outcome' => 'abstention', 'reason' => $filter->reason];

                        return $result($steps, (string) $filter->reason);
                    }

                    $steps[] = ['step' => $step, 'outcome' => 'continue', 'reason' => null];

                    break;

                case 'gap':
                    $e1 = $available['F121-E1'];
                    $team = $designation?->details['selectedTeam'] ?? null;
                    if ($configuration->isActive('F121-E1') && $e1->verdict === RuleVerdict::Candidate) {
                        $pendingAlert = [
                            'rule' => 'F121-E1',
                            'level' => $configuration->negativeGapLevel,
                            'selection' => $team,
                            'action' => 'Prochain but',
                            'reason' => 'Écart négatif : le bookmaker attend un but de l’équipe désignée.',
                        ];
                    } elseif ($filters['gap']->passed && $designation !== null) {
                        $pendingAlert = [
                            'rule' => $designation->ruleId,
                            'level' => $configuration->positiveGapLevel,
                            'selection' => $team,
                            'action' => 'Prochain but',
                            'reason' => 'Écart positif sous le seuil configuré.',
                        ];
                    } else {
                        $reason = (float) ($designation?->details['selectedGap'] ?? 0) < 0
                            ? 'Écart négatif, mais F121-E1 est inactive.'
                            : (string) $filters['gap']->reason;
                        $steps[] = ['step' => $step, 'outcome' => 'abstention', 'reason' => $reason];

                        return $result($steps, $reason);
                    }

                    $steps[] = ['step' => $step, 'outcome' => 'proposal', 'reason' => $pendingAlert['reason']];

                    break;

                case 'convergence':
                    if ($convergenceScore === null || $convergenceScore <= $configuration->minimumConvergenceScore) {
                        $reason = $convergenceScore === null
                            ? 'La convergence ne peut pas être calculée sans les scores et poids définis.'
                            : 'Le score de convergence ne dépasse pas le seuil configuré.';
                        $steps[] = ['step' => $step, 'outcome' => 'abstention', 'reason' => $reason];

                        return $result($steps, $reason);
                    }

                    $steps[] = ['step' => $step, 'outcome' => 'continue', 'reason' => null];

                    break;
            }
        }

        if ($pendingAlert === null) {
            return $result($steps, 'Aucune étape de décision n’a produit d’alerte.');
        }

        return $result($steps, $pendingAlert['reason'], $pendingAlert);
    }

    public function suggestedExactScoreKey(RuleInput $input, RuleConfiguration $configuration): ?string
    {
        $directionalResult = $this->f121C->evaluate($input);
        $designation = $this->designation(
            $configuration,
            $directionalResult,
            $this->f121C2->evaluate($input, $directionalResult),
        );

        if ($designation?->verdict !== RuleVerdict::Candidate) {
            return null;
        }

        return match ($designation->details['selectedTeam'] ?? null) {
            'home' => ($input->homeScore + 1).'-'.$input->awayScore,
            'away' => $input->homeScore.'-'.($input->awayScore + 1),
            default => null,
        };
    }

    /**
     * Désignation de l’équipe : F121-C, remplacée par F121-C.2 lorsqu’une équipe mène d’au moins deux buts.
     */
    private function designation(
        RuleConfiguration $configuration,
        RuleResult $directionalResult,
        RuleResult $leaderResult,
    ): ?RuleResult {
        if (! $configuration->isActive('F121-C')) {
            return null;
        }

        if ($configuration->isActive('F121-C.2') && $leaderResult->verdict === RuleVerdict::Candidate) {
            return $leaderResult;
        }

        return $directionalResult;
    }
}
