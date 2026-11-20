<?php

namespace App\Rules;

/**
 * Moteur de décision Phase 1 : classe pure, sans réseau ni base de données.
 *
 * Étapes communes au match (complément 2, ordre modifiable) : F121-E2 à la mi-temps, minutes restantes (facultative),
 * F121-D (match ouvert), vitalité. Puis la règle F121 est appliquée aux DEUX équipes : prochain but à domicile
 * (score h+1-a) et à l’extérieur (h-a+1), chacune avec son écart et sa tendance (forte baisse F162-Bis, hausse,
 * écart négatif F121-E1, écart trop grand F121-G, petit écart). Après un but, le complément 4 s’applique à chaque équipe.
 *
 * Départage (à confirmer avec le client) : critique avant haute avant abstention ; à niveau égal, l’écart le plus
 * négatif, puis la baisse la plus forte. L’autre équipe est citée dans la justification.
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
        private readonly SideEvaluator $sideEvaluator = new SideEvaluator,
    ) {}

    public function evaluate(RuleInput $input, RuleConfiguration $configuration): EngineResult
    {
        $directionalResult = $this->f121C->evaluate($input);
        $leaderResult = $this->f121C2->evaluate($input, $directionalResult);
        // Équipe à l’écart le plus faible : sert à l’ancienne tendance unique et aux filtres affichés sans alerte.
        $lowestGapSide = $directionalResult->details['selectedTeam'] ?? null;
        $f121E2 = $this->f121E2->evaluate($input, $configuration);
        $f121D = $this->f121D->evaluate($input, $configuration);
        $convergenceScore = $this->convergenceCalculator->calculate($input->methodScores, $configuration->methodWeights);
        $vitalityFilter = $this->vitalityFilter->evaluate($input, $configuration);
        $steps = [];

        $finish = function (bool $alert, string $reason, array $sideOutcomes = [], ?SideOutcome $winner = null, ?string $rule = null, ?string $level = null, ?string $action = null) use (&$steps, $input, $configuration, $directionalResult, $leaderResult, $f121E2, $f121D, $vitalityFilter, $convergenceScore, $lowestGapSide): EngineResult {
            $focus = $winner ?? $this->lowestGapOutcome($sideOutcomes, $lowestGapSide);
            $designation = match (true) {
                $focus !== null && $focus->gap !== null => new RuleResult('F121-C', RuleVerdict::Candidate, details: ['selectedTeam' => $focus->side, 'selectedGap' => $focus->gap]),
                $focus === null && $directionalResult->verdict === RuleVerdict::Candidate => $directionalResult,
                default => null,
            };
            $available = [
                'F121-E2' => $f121E2,
                'F121-D' => $f121D,
                'F121-C' => $directionalResult,
                'F121-C.2' => $leaderResult,
                'F121-E1' => $this->f121E1->evaluate($input, $designation),
            ];
            $rules = [];
            foreach ($configuration->activeRules as $ruleId) {
                $rules[$ruleId] = $available[$ruleId] ?? ($ruleId === 'F162-Bis'
                    ? new RuleResult('F162-Bis', RuleVerdict::NoSignal, reason: 'Évaluée dans l’ordre de décision (tendance de chaque équipe).')
                    : $this->undefinedRule->evaluate($ruleId));
            }
            $filters = [
                'gap' => $this->gapFilter->evaluate($input, $configuration, $designation),
                'trend' => $this->trendFilter->evaluate($focus !== null ? $focus->change : $input->oddsChangePercent, $configuration),
                'vitality' => $vitalityFilter,
            ];

            return new EngineResult(
                $alert,
                $convergenceScore,
                $rules,
                $filters,
                $reason,
                $steps,
                $rule,
                $level,
                $winner?->side,
                $action,
                array_map(fn (SideOutcome $outcome): array => $outcome->toArray(), $sideOutcomes),
            );
        };
        $abstain = function (string $step, string $reason) use (&$steps, $finish): EngineResult {
            $steps[] = ['step' => $step, 'outcome' => 'abstention', 'reason' => $reason];

            return $finish(false, $reason);
        };
        $continue = function (string $step, ?string $reason = null) use (&$steps): void {
            $steps[] = ['step' => $step, 'outcome' => 'continue', 'reason' => $reason];
        };

        $halftimeHandled = in_array('F121-E2', $configuration->pipeline, true) && $configuration->isActive('F121-E2');
        if ($input->halftime === true && ! $halftimeHandled) {
            return $abstain('F121-E2', 'Match à la mi-temps : seul F121-E2 peut produire une alerte, et cette étape est inactive.');
        }

        foreach ($configuration->pipeline as $index => $step) {
            if (in_array($step, SideEvaluator::SIDE_STEPS, true)) {
                $sideSteps = array_values(array_filter(
                    array_slice($configuration->pipeline, $index),
                    fn (string $candidate): bool => in_array($candidate, SideEvaluator::SIDE_STEPS, true),
                ));

                return $this->decideSides($input, $configuration, $sideSteps, $lowestGapSide, $steps, $finish);
            }

            switch ($step) {
                case 'F121-E2':
                    if (! $configuration->isActive('F121-E2') || $input->halftime !== true) {
                        $steps[] = ['step' => $step, 'outcome' => 'non_applicable', 'reason' => $f121E2->reason];

                        break;
                    }

                    if ($f121E2->verdict === RuleVerdict::Candidate) {
                        return $this->commonAlert($step, 'F121-E2', 'Mi-temps', $f121E2->suggestedAction, 'Signal mi-temps : cote Under 2.5 dans la plage configurée.', $steps, $finish);
                    }

                    return $abstain($step, 'Match à la mi-temps sans signal F121-E2 : '.$f121E2->reason);

                case 'minutes_remaining':
                    if ($input->minute !== null
                        && RuleConfiguration::REGULATION_MINUTES - $input->minute < $configuration->minimumMinutesRemaining) {
                        return $abstain($step, "Il reste moins de {$configuration->minimumMinutesRemaining} minutes de jeu : abstention (règle facultative, à confirmer).");
                    }

                    $continue($step);

                    break;

                case 'F121-D':
                    if ($configuration->isActive('F121-D') && $f121D->verdict === RuleVerdict::Candidate) {
                        return $this->commonAlert($step, 'F121-D', 'Neutre', $f121D->suggestedAction, 'Match ouvert : cotes des scores suivants sous le seuil configuré.', $steps, $finish);
                    }

                    $continue($step, $f121D->reason);

                    break;

                case 'vitality':
                    if (! $vitalityFilter->passed) {
                        return $abstain($step, (string) $vitalityFilter->reason);
                    }

                    $continue($step);

                    break;

                case 'convergence':
                    $steps[] = ['step' => $step, 'outcome' => 'non_applicable', 'reason' => 'Appliquée au moment d’une alerte sur une équipe.'];

                    break;
            }
        }

        return $abstain('fin', 'Aucune règle satisfaite : abstention.');
    }

    /**
     * Alerte sur le match entier (F121-E2, F121-D) : pas d’équipe, donc pas d’étape de convergence.
     *
     * @param  list<array<string, mixed>>  $steps
     */
    private function commonAlert(string $step, string $rule, string $level, ?string $action, string $reason, array &$steps, \Closure $finish): EngineResult
    {
        $steps[] = ['step' => $step, 'outcome' => 'alert', 'reason' => null];

        return $finish(true, $reason, rule: $rule, level: $level, action: $action);
    }

    /**
     * Applique les étapes d’équipe aux deux côtés, puis départage.
     *
     * @param  list<string>  $sideSteps
     * @param  list<array<string, mixed>>  $steps
     */
    private function decideSides(
        RuleInput $input,
        RuleConfiguration $configuration,
        array $sideSteps,
        ?string $lowestGapSide,
        array &$steps,
        \Closure $finish,
    ): EngineResult {
        $outcomes = [];
        foreach ([SideOutcome::HOME, SideOutcome::AWAY] as $side) {
            $outcome = $this->sideEvaluator->evaluate(
                $side,
                $input,
                $configuration,
                $sideSteps,
                $this->sideChange($input, $side, $lowestGapSide),
                $this->sidePostGoal($input, $side, $lowestGapSide),
            );
            $outcomes[] = $outcome;
            array_push($steps, ...$outcome->steps);
        }

        $summary = 'Détail — '.implode(' ; ', array_map(fn (SideOutcome $outcome): string => $outcome->summary(), $outcomes)).'.';
        $alerts = array_values(array_filter($outcomes, fn (SideOutcome $outcome): bool => $outcome->alert));
        if ($alerts === []) {
            return $finish(false, 'Abstention pour les deux équipes. '.$summary, $outcomes);
        }

        usort($alerts, fn (SideOutcome $left, SideOutcome $right): int => [$right->severity, $left->gap ?? INF, $left->change ?? INF]
            <=> [$left->severity, $right->gap ?? INF, $right->change ?? INF]);
        $winner = $alerts[0];
        $other = $alerts[1] ?? null;

        if (in_array('convergence', $configuration->pipeline, true)) {
            $convergence = $this->convergenceCalculator->calculate($input->methodScores, $configuration->methodWeights);
            if ($convergence === null || $convergence <= $configuration->minimumConvergenceScore) {
                $reason = $convergence === null
                    ? 'La convergence ne peut pas être calculée sans les scores et poids définis.'
                    : 'Le score de convergence ne dépasse pas le seuil configuré.';
                $steps[] = ['step' => 'convergence', 'outcome' => 'abstention', 'reason' => $reason];

                return $finish(false, $reason.' '.$summary, $outcomes);
            }
        }

        $reason = sprintf(
            'Alerte %s : prochain but %s, score %s — %s.',
            $winner->level,
            $winner->side === SideOutcome::HOME ? 'de l’équipe à domicile' : 'de l’équipe à l’extérieur',
            $winner->scoreKey,
            $winner->reason,
        );
        if ($other !== null) {
            $reason .= sprintf(
                ' L’autre équipe (%s) donne aussi un signal (%s) : départage par le niveau, puis l’écart le plus négatif, puis la baisse la plus forte (à confirmer).',
                mb_strtolower($other->label()),
                $other->level,
            );
        }

        return $finish(true, $reason.' '.$summary, $outcomes, $winner, $winner->rule, $winner->level, 'Prochain but');
    }

    /**
     * Tendance d’une équipe : valeur par équipe si fournie ; sinon l’ancienne tendance unique, qui portait sur le
     * score de l’équipe à l’écart le plus faible.
     */
    private function sideChange(RuleInput $input, string $side, ?string $lowestGapSide): ?float
    {
        if ($input->sideOddsChangePercent !== null) {
            $change = $input->sideOddsChangePercent[$side] ?? null;

            return is_numeric($change) ? (float) $change : null;
        }

        return $side === $lowestGapSide ? $input->oddsChangePercent : null;
    }

    /**
     * @return array{phase: string|null, change: float|null}|null
     */
    private function sidePostGoal(RuleInput $input, string $side, ?string $lowestGapSide): ?array
    {
        if ($input->sidePostGoal !== null) {
            return $input->sidePostGoal[$side] ?? null;
        }

        if ($input->postGoalPhase === null) {
            return null;
        }

        return ['phase' => $input->postGoalPhase, 'change' => $side === $lowestGapSide ? $input->postGoalChangePercent : null];
    }

    /**
     * @param  list<SideOutcome>  $outcomes
     */
    private function lowestGapOutcome(array $outcomes, ?string $lowestGapSide): ?SideOutcome
    {
        foreach ($outcomes as $outcome) {
            if ($outcome->side === $lowestGapSide) {
                return $outcome;
            }
        }

        return null;
    }

    /**
     * Score du prochain but de l’équipe à l’écart le plus faible (classement chaud / calme du scan).
     */
    public function suggestedExactScoreKey(RuleInput $input, RuleConfiguration $configuration): ?string
    {
        return match ($this->f121C->evaluate($input)->details['selectedTeam'] ?? null) {
            'home' => ($input->homeScore + 1).'-'.$input->awayScore,
            'away' => $input->homeScore.'-'.($input->awayScore + 1),
            default => null,
        };
    }
}
