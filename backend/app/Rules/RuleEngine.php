<?php

namespace App\Rules;

/**
 * Moteur de décision Phase 1 : classe pure, sans réseau ni base de données.
 *
 * Ordre par défaut (complément 2 de l’annexe, modifiable) : F121-E2 à la mi-temps, F121-D (match ouvert),
 * vitalité, forte baisse de la cote suggérée (F162-Bis, prioritaire sur l’écart), hausse de la cote, écart négatif
 * (F121-E1), écart trop grand (F121-G), petit écart (alerte haute), sinon abstention. La première étape qui décide
 * l’emporte. L’équipe désignée (F121-C, puis F121-C.2 si une équipe mène de deux buts) fixe le score suggéré.
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
            $rules[$ruleId] = $available[$ruleId] ?? ($ruleId === 'F162-Bis'
                ? new RuleResult('F162-Bis', RuleVerdict::NoSignal, reason: 'Évaluée dans l’ordre de décision (tendance).')
                : $this->undefinedRule->evaluate($ruleId));
        }

        $filters = [
            'gap' => $this->gapFilter->evaluate($input, $configuration, $designation),
            'trend' => $this->trendFilter->evaluate($input, $configuration),
            'vitality' => $this->vitalityFilter->evaluate($input, $configuration),
        ];
        $convergenceScore = $this->convergenceCalculator->calculate($input->methodScores, $configuration->methodWeights);
        $team = $designation?->verdict === RuleVerdict::Candidate ? ($designation->details['selectedTeam'] ?? null) : null;
        $gap = $team === null ? null : round((float) $designation->details['selectedGap'], 6);
        $change = $filters['trend']->details['oddsChangePercent'] ?? null;
        $steps = [];

        $abstain = function (string $step, string $reason) use (&$steps, $rules, $filters, $convergenceScore): EngineResult {
            $steps[] = ['step' => $step, 'outcome' => 'abstention', 'reason' => $reason];

            return new EngineResult(false, $convergenceScore, $rules, $filters, $reason, $steps);
        };
        $alert = function (string $step, string $rule, string $level, ?string $selection, ?string $action, string $reason) use (&$steps, $rules, $filters, $convergenceScore, $configuration, $abstain): EngineResult {
            if ($selection !== null && in_array('convergence', $configuration->pipeline, true)
                && ($convergenceScore === null || $convergenceScore <= $configuration->minimumConvergenceScore)) {
                return $abstain('convergence', $convergenceScore === null
                    ? 'La convergence ne peut pas être calculée sans les scores et poids définis.'
                    : 'Le score de convergence ne dépasse pas le seuil configuré.');
            }

            $steps[] = ['step' => $step, 'outcome' => 'alert', 'reason' => null];

            return new EngineResult(true, $convergenceScore, $rules, $filters, $reason, $steps, $rule, $level, $selection, $action);
        };
        $continue = function (string $step, ?string $reason = null) use (&$steps): void {
            $steps[] = ['step' => $step, 'outcome' => 'continue', 'reason' => $reason];
        };
        $needsTeam = fn (): bool => $team !== null;

        $halftimeHandled = in_array('F121-E2', $configuration->pipeline, true) && $configuration->isActive('F121-E2');
        if ($input->halftime === true && ! $halftimeHandled) {
            return $abstain('F121-E2', 'Match à la mi-temps : seul F121-E2 peut produire une alerte, et cette étape est inactive.');
        }

        foreach ($configuration->pipeline as $step) {
            if ($input->postGoalPhase !== null
                && in_array($step, ['trend_drop', 'trend_rise', 'gap_negative', 'gap_too_high', 'gap_small'], true)) {
                return $this->postGoalDecision($input, $configuration, $designation, $team, $gap, $abstain, $alert);
            }

            switch ($step) {
                case 'F121-E2':
                    $rule = $available['F121-E2'];
                    if (! $configuration->isActive('F121-E2') || $input->halftime !== true) {
                        $steps[] = ['step' => $step, 'outcome' => 'non_applicable', 'reason' => $rule->reason];

                        break;
                    }

                    if ($rule->verdict === RuleVerdict::Candidate) {
                        return $alert($step, 'F121-E2', 'Mi-temps', null, $rule->suggestedAction, 'Signal mi-temps : cote Under 2.5 dans la plage configurée.');
                    }

                    return $abstain($step, 'Match à la mi-temps sans signal F121-E2 : '.$rule->reason);

                case 'minutes_remaining':
                    if ($input->minute !== null
                        && RuleConfiguration::REGULATION_MINUTES - $input->minute < $configuration->minimumMinutesRemaining) {
                        return $abstain($step, "Il reste moins de {$configuration->minimumMinutesRemaining} minutes de jeu : abstention (règle facultative, à confirmer).");
                    }

                    $continue($step);

                    break;

                case 'F121-D':
                    $rule = $available['F121-D'];
                    if ($configuration->isActive('F121-D') && $rule->verdict === RuleVerdict::Candidate) {
                        return $alert($step, 'F121-D', 'Neutre', null, $rule->suggestedAction, 'Match ouvert : cotes des scores suivants sous le seuil configuré.');
                    }

                    $continue($step, $rule->reason);

                    break;

                case 'vitality':
                    if (! $filters['vitality']->passed) {
                        return $abstain($step, (string) $filters['vitality']->reason);
                    }

                    $continue($step);

                    break;

                case 'trend_drop':
                    if (! $needsTeam()) {
                        return $abstain($step, 'Aucune équipe désignée : '.($designation?->reason ?? 'F121-C est inactive.'));
                    }

                    if ($change === null) {
                        return $abstain($step, (string) $filters['trend']->reason);
                    }

                    if ($configuration->isActive('F162-Bis') && $change < -(float) $configuration->stableOddsChangePercent) {
                        return $alert($step, 'F162-Bis', $configuration->negativeGapLevel, $team, 'Prochain but', 'Forte baisse de la cote du prochain but : le bookmaker a eu une information (F162-Bis).');
                    }

                    $continue($step);

                    break;

                case 'trend_rise':
                    if ($change === null) {
                        return $abstain($step, (string) $filters['trend']->reason);
                    }

                    if ($change > 0) {
                        return $abstain($step, 'La cote monte : abstention.');
                    }

                    $continue($step);

                    break;

                case 'gap_negative':
                    if (! $needsTeam()) {
                        return $abstain($step, 'Aucune équipe désignée : '.($designation?->reason ?? 'F121-C est inactive.'));
                    }

                    if ($gap < 0) {
                        if (! $configuration->isActive('F121-E1')) {
                            return $abstain($step, 'Écart négatif, mais F121-E1 est inactive.');
                        }

                        return $alert($step, 'F121-E1', $configuration->negativeGapLevel, $team, 'Prochain but', 'Écart négatif : le bookmaker attend un but de l’équipe désignée.');
                    }

                    $continue($step);

                    break;

                case 'gap_too_high':
                    if ($needsTeam() && $gap > $configuration->abstentionGapThreshold) {
                        return $abstain($step, 'Écart positif supérieur au seuil d’abstention (F121-G).');
                    }

                    $continue($step);

                    break;

                case 'gap_small':
                    if ($needsTeam() && $gap > 0 && $gap <= $configuration->abstentionGapThreshold) {
                        return $alert($step, $designation->ruleId, $configuration->positiveGapLevel, $team, 'Prochain but', 'Petit écart positif : un but de l’équipe désignée est probable.');
                    }

                    $continue($step);

                    break;

                case 'convergence':
                    $steps[] = ['step' => $step, 'outcome' => 'non_applicable', 'reason' => 'Appliquée au moment d’une alerte sur une équipe.'];

                    break;
            }
        }

        return $abstain('fin', $gap !== null && $gap == 0.0
            ? 'Écart nul : aucune règle satisfaite, abstention.'
            : 'Aucune règle satisfaite : abstention.');
    }

    /**
     * Complément 4 : après un but, les étapes de tendance et d’écart sont remplacées (E2, F121-D et la vitalité
     * restent appliqués avant, à confirmer).
     *  - Premier relevé après le but, une seule fois : écart < 0 → alerte critique (F121-E1) ; 0 ≤ écart ≤ 0.50 →
     *    alerte haute ; écart > 0.50 → attente.
     *  - Relevés suivants pendant la fenêtre : seule une baisse de plus du seuil (5 %) depuis la première cote
     *    après le but donne une alerte critique (F162-Bis) ; sinon abstention. Les règles d’écart ne s’appliquent pas.
     */
    private function postGoalDecision(
        RuleInput $input,
        RuleConfiguration $configuration,
        ?RuleResult $designation,
        ?string $team,
        ?float $gap,
        \Closure $abstain,
        \Closure $alert,
    ): EngineResult {
        if ($team === null || $gap === null) {
            return $abstain('post_goal', 'Après un but : aucune équipe désignée ('.($designation?->reason ?? 'F121-C est inactive.').').');
        }

        if ($input->postGoalPhase === RuleInput::POST_GOAL_FIRST_READING) {
            if ($gap < 0) {
                if (! $configuration->isActive('F121-E1')) {
                    return $abstain('post_goal_first_reading', 'Premier relevé après un but : écart négatif, mais F121-E1 est inactive.');
                }

                return $alert('post_goal_first_reading', 'F121-E1', $configuration->negativeGapLevel, $team, 'Prochain but', 'Premier relevé après un but : écart négatif, alerte immédiate (F121-E1).');
            }

            if ($gap <= $configuration->abstentionGapThreshold) {
                return $alert('post_goal_first_reading', $designation->ruleId, $configuration->positiveGapLevel, $team, 'Prochain but', 'Premier relevé après un but : écart entre 0 et le seuil, alerte immédiate.');
            }

            return $abstain('post_goal_first_reading', 'Premier relevé après un but : écart supérieur au seuil, attente (aucune alerte).');
        }

        $change = $input->postGoalChangePercent;
        if ($change === null || ! is_finite($change)) {
            return $abstain('post_goal_window', 'Fenêtre après un but : variation depuis la première cote post-but non calculable.');
        }

        if ($configuration->isActive('F162-Bis') && $change < -(float) $configuration->stableOddsChangePercent) {
            return $alert('post_goal_window', 'F162-Bis', $configuration->negativeGapLevel, $team, 'Prochain but', 'Fenêtre après un but : baisse de plus du seuil depuis la première cote post-but (F162-Bis).');
        }

        return $abstain('post_goal_window', 'Fenêtre après un but : pas de baisse de plus du seuil depuis la première cote post-but, abstention.');
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
