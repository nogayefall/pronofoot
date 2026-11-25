<?php

namespace App\Rules;

/**
 * Moteur de décision Phase 1 : classe pure, sans réseau ni base de données.
 *
 * Étapes communes au match (complément 2, ordre modifiable) : F121-E2 à la mi-temps, minutes restantes (facultative),
 * F121-D (match ouvert), vitalité. Puis la règle F121 est appliquée aux DEUX équipes : prochain but à domicile
 * (score h+1-a) et à l’extérieur (h-a+1), chacune avec son écart et sa tendance (forte baisse F162-Bis, hausse,
 * écart négatif F121-E1, écart trop grand F121-G, petit écart). Après un but, le complément 4 s’applique à chaque équipe.
 * Si une seule équipe est en signal, F162-Bis exige un écart <= seuil F121-G (réglage, activé par défaut).
 *
 * Options d’une alerte (règle du client) : si une seule équipe donne un signal, deux options — ciblée « prochain but de
 * l’équipe » puis neutre « un but de plus dans le match » (Over buts actuels + 0,5). Si les deux équipes donnent un signal,
 * pas d’équipe désignée : option neutre seule. Aucune option n’est jouée automatiquement.
 */
final class RuleEngine
{
    public const VITALITY_UNAVAILABLE = 'Vitalité non disponible (statistiques non couvertes)';

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
        private readonly ConfidenceScorer $confidenceScorer = new ConfidenceScorer,
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
        // Score de confiance automatique (V12) : calculé et conservé à chaque évaluation ; il ne bloque une alerte que si
        // l’étape « convergence » est activée.
        $confidence = $this->confidenceScorer->evaluate($input, $configuration, [
            'home' => $this->sideChange($input, SideOutcome::HOME, $lowestGapSide),
            'away' => $this->sideChange($input, SideOutcome::AWAY, $lowestGapSide),
        ]);
        $convergenceScore = $confidence['score'];
        $vitalityFilter = $input->vitalityUnavailable
            ? new FilterResult(true, self::VITALITY_UNAVAILABLE.' : filtre non appliqué (à confirmer).', ['applied' => false])
            : $this->vitalityFilter->evaluate($input, $configuration);
        $steps = [];

        $finish = function (bool $alert, string $reason, array $sideOutcomes = [], ?SideOutcome $winner = null, ?string $rule = null, ?string $level = null, ?string $action = null, array $options = []) use (&$steps, $input, $configuration, $directionalResult, $leaderResult, $f121E2, $f121D, $vitalityFilter, $convergenceScore, $confidence, $lowestGapSide): EngineResult {
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

            if ($input->vitalityUnavailable) {
                $reason .= ' '.self::VITALITY_UNAVAILABLE.' : filtre vitalité non appliqué (à confirmer).';
            }

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
                $options,
                $confidence,
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

                return $this->decideSides($input, $configuration, $sideSteps, $lowestGapSide, $steps, $finish, $convergenceScore);
            }

            switch ($step) {
                case 'F121-E2':
                    if (! $configuration->isActive('F121-E2') || $input->halftime !== true) {
                        $steps[] = ['step' => $step, 'outcome' => 'non_applicable', 'reason' => $f121E2->reason];

                        break;
                    }

                    if ($f121E2->verdict === RuleVerdict::Candidate && ! $configuration->halftimeSignalDecides) {
                        return $abstain($step, 'Signal F121-E2 d’origine (Under 2.5 dans la plage configurée) journalisé sans décider : le scan Plancher de la pause est le scan E2.');
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

                case 'F121-X':
                    $crossGap = $this->crossGap($input);
                    if ($crossGap !== null && $crossGap < $configuration->crossGapMaximum
                        && $input->homeScore + $input->awayScore >= $configuration->openMatchMinimumGoals) {
                        $neutral = $this->neutralOption($input);

                        return $this->commonAlert($step, 'F121-X', 'Neutre', $neutral['action'], sprintf('Écart croisé %s < %s dans un match ouvert : pari neutre, %s (F121-X, à confirmer).', number_format($crossGap, 2, '.', ''), number_format($configuration->crossGapMaximum, 2, '.', ''), $this->optionText($neutral)), $steps, $finish, [[...$neutral, 'origin' => 'cross_gap']]);
                    }

                    $continue($step, $crossGap === null ? 'Écart croisé non calculable.' : 'Écart croisé '.number_format($crossGap, 2, '.', '').' : pas de pari neutre F121-X.');

                    break;

                case 'vitality':
                    if ($input->vitalityUnavailable) {
                        $steps[] = ['step' => $step, 'outcome' => 'non_applicable', 'reason' => self::VITALITY_UNAVAILABLE.'.'];

                        break;
                    }

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
    private function commonAlert(string $step, string $rule, string $level, ?string $action, string $reason, array &$steps, \Closure $finish, array $options = []): EngineResult
    {
        $steps[] = ['step' => $step, 'outcome' => 'alert', 'reason' => null];

        return $finish(true, $reason, rule: $rule, level: $level, action: $action, options: $options);
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
        ?float $convergence,
    ): EngineResult {
        $sides = [SideOutcome::HOME, SideOutcome::AWAY];
        $leadMargin = $input->homeScore - $input->awayScore;
        // F121-C.2 : le réglage ET la case du profil, comme les autres règles.
        if ($configuration->followLeader && $configuration->isActive('F121-C.2') && abs($leadMargin) >= 2) {
            $leader = $leadMargin > 0 ? SideOutcome::HOME : SideOutcome::AWAY;
            $sides = [$leader];
            $steps[] = [
                'step' => 'F121-C.2',
                'outcome' => 'non_applicable',
                'reason' => 'Une équipe mène de 2 buts ou plus : seule elle est évaluée (F121-C.2, à confirmer).',
                'side' => $leader === SideOutcome::HOME ? SideOutcome::AWAY : SideOutcome::HOME,
            ];
        }

        $outcomes = [];
        foreach ($sides as $side) {
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

        $alerts = array_values(array_filter($outcomes, fn (SideOutcome $outcome): bool => $outcome->alert));
        $blocked = null;
        if (count($alerts) === 1 && $this->strongDropBlockedByGap($alerts[0], $configuration)) {
            $blocked = sprintf(
                'baisse de cote seule (F162-Bis), mais écart %s supérieur à %s (F121-G) : pas d’alerte',
                SideOutcome::signed((float) $alerts[0]->gap, 2),
                number_format($configuration->abstentionGapThreshold, 2, '.', ''),
            );
            $steps[] = ['step' => 'strong_drop_gap', 'outcome' => 'abstention', 'reason' => $blocked, 'side' => $alerts[0]->side];
            $outcomes = array_map(fn (SideOutcome $outcome): SideOutcome => $outcome->alert ? $outcome->withoutAlert($blocked) : $outcome, $outcomes);
            $alerts = [];
        }

        $summary = 'Détail — '.implode(' ; ', array_map(fn (SideOutcome $outcome): string => $outcome->summary(), $outcomes)).'.';
        if ($blocked !== null) {
            return $finish(false, 'Abstention : '.$blocked.'. '.$summary, $outcomes);
        }

        if ($alerts === []) {
            return $finish(false, (count($outcomes) === 2 ? 'Abstention pour les deux équipes. ' : 'Abstention. ').$summary, $outcomes);
        }

        if (in_array('convergence', $configuration->pipeline, true)) {
            if ($convergence === null || $convergence <= $configuration->minimumConvergenceScore) {
                $reason = $convergence === null
                    ? 'La convergence ne peut pas être calculée sans les poids du profil.'
                    : 'Le score de convergence ne dépasse pas le seuil configuré.';
                $steps[] = ['step' => 'convergence', 'outcome' => 'abstention', 'reason' => $reason];

                return $finish(false, $reason.' '.$summary, $outcomes);
            }
        }

        $neutral = $this->neutralOption($input);
        if (count($alerts) === 1) {
            $winner = $alerts[0];
            $targeted = [
                'type' => 'targeted',
                'label' => 'Prochain but '.($winner->side === SideOutcome::HOME ? 'de l’équipe à domicile' : 'de l’équipe à l’extérieur'),
                'side' => $winner->side,
                'scoreKey' => $winner->scoreKey,
                'odds' => $winner->nextOdds,
                'gap' => $winner->gap,
                'level' => $winner->level,
                'rule' => $winner->rule,
            ];
            $reason = sprintf(
                'Alerte %s : une seule équipe en signal (%s) — %s. Option 1 (ciblée) : %s. Option 2 (neutre) : %s. Aucune option n’est jouée automatiquement.',
                $winner->level,
                mb_strtolower($winner->label()),
                $winner->reason,
                $this->optionText($targeted),
                $this->optionText($neutral),
            );

            return $finish(true, $reason.' '.$summary, $outcomes, $winner, $winner->rule, $winner->level, 'Prochain but', [$targeted, $neutral]);
        }

        // Les deux équipes en signal : pas d’équipe désignée, option neutre seule. Le niveau et la règle retenus sont
        // ceux du signal le plus grave (domicile en cas d’égalité).
        usort($alerts, fn (SideOutcome $left, SideOutcome $right): int => $right->severity <=> $left->severity);
        $strongest = $alerts[0];
        $reason = sprintf(
            'Alerte %s : les deux équipes donnent un signal, pas d’équipe désignée. Option neutre seule : %s. Écarts : domicile %s, extérieur %s. Aucune option n’est jouée automatiquement.',
            $strongest->level,
            $this->optionText($neutral),
            $this->gapText($outcomes, SideOutcome::HOME),
            $this->gapText($outcomes, SideOutcome::AWAY),
        );

        return $finish(true, $reason.' '.$summary, $outcomes, null, $strongest->rule, $strongest->level, $neutral['action'], [[...$neutral, 'origin' => 'both_sides']]);
    }

    /**
     * « F162-Bis exige un écart <= seuil F121-G » : seule équipe en signal, signal venu de la baisse de cote, écart
     * au-delà du seuil. Les règles après un but (complément 4) ne sont pas concernées.
     */
    private function strongDropBlockedByGap(SideOutcome $outcome, RuleConfiguration $configuration): bool
    {
        return $configuration->strongDropRequiresGap
            && $outcome->rule === 'F162-Bis'
            && $outcome->postGoalPhase === null
            && $outcome->gap !== null
            && $outcome->gap > $configuration->abstentionGapThreshold;
    }

    /**
     * Option neutre : « un but de plus dans le match », Over (buts actuels + 0,5) sur le total du match ; la cote n’est
     * donnée que si le marché Over/Under est disponible.
     *
     * @return array{type: string, label: string, line: string, action: string, odds: float|null}
     */
    private function neutralOption(RuleInput $input): array
    {
        $line = number_format($input->homeScore + $input->awayScore + 0.5, 1, '.', '');
        $odds = $input->overLineOdds[$line] ?? null;

        return [
            'type' => 'neutral',
            'label' => 'Un but de plus dans le match',
            'line' => "Over {$line}",
            'action' => "Over {$line} buts",
            'odds' => is_numeric($odds) && (float) $odds > 0 ? (float) $odds : null,
        ];
    }

    /**
     * @param  array<string, mixed>  $option
     */
    private function optionText(array $option): string
    {
        $odds = is_numeric($option['odds'] ?? null) ? 'cote '.number_format((float) $option['odds'], 2, '.', '') : 'cote non disponible';

        if (($option['type'] ?? null) === 'neutral') {
            return "un but de plus dans le match, {$option['line']}, {$odds}";
        }

        $gap = is_numeric($option['gap'] ?? null) ? ', écart '.SideOutcome::signed((float) $option['gap'], 2) : '';

        return mb_strtolower((string) $option['label']).", score {$option['scoreKey']}, {$odds}{$gap}";
    }

    /**
     * @param  list<SideOutcome>  $outcomes
     */
    private function gapText(array $outcomes, string $side): string
    {
        foreach ($outcomes as $outcome) {
            if ($outcome->side === $side) {
                return $outcome->gap === null ? 'n.c.' : SideOutcome::signed($outcome->gap, 2);
            }
        }

        return 'n.c.';
    }

    /**
     * F121-X : écart croisé = |écart domicile − écart extérieur| = |cote h+1-a − cote h-a+1|.
     */
    private function crossGap(RuleInput $input): ?float
    {
        $odds = fn (string $key): ?float => is_numeric($input->exactScoreOdds[$key] ?? null) && (float) $input->exactScoreOdds[$key] > 0
            ? (float) $input->exactScoreOdds[$key]
            : null;
        $current = $odds("{$input->homeScore}-{$input->awayScore}");
        $home = $odds(($input->homeScore + 1).'-'.$input->awayScore);
        $away = $odds($input->homeScore.'-'.($input->awayScore + 1));

        return $current === null || $home === null || $away === null ? null : abs($home - $away);
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
