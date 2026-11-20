<?php

namespace App\Rules;

/**
 * Ordre de décision appliqué à UNE équipe (complément 2), à partir de l’étape de tendance : forte baisse (F162-Bis),
 * hausse = abstention, écart négatif = critique (F121-E1), écart > seuil = abstention (F121-G), petit écart = haute.
 * Après un but (complément 4), ces étapes sont remplacées par la règle du premier relevé puis de la fenêtre.
 * Écart = cote du score du prochain but de l’équipe − cote du score actuel.
 */
final class SideEvaluator
{
    public const SIDE_STEPS = ['trend_drop', 'trend_rise', 'gap_negative', 'gap_too_high', 'gap_small'];

    /**
     * @param  list<string>  $steps  Étapes d’équipe de l’ordre de décision, dans l’ordre configuré.
     * @param  array{phase: string|null, change: float|null}|null  $postGoal
     */
    public function evaluate(
        string $side,
        RuleInput $input,
        RuleConfiguration $configuration,
        array $steps,
        ?float $change,
        ?array $postGoal = null,
    ): SideOutcome {
        $scoreKey = $side === SideOutcome::HOME
            ? ($input->homeScore + 1).'-'.$input->awayScore
            : $input->homeScore.'-'.($input->awayScore + 1);
        $currentOdds = $this->odds($input->exactScoreOdds["{$input->homeScore}-{$input->awayScore}"] ?? null);
        $nextOdds = $this->odds($input->exactScoreOdds[$scoreKey] ?? null);
        $gap = $currentOdds === null || $nextOdds === null ? null : round($nextOdds - $currentOdds, 6);
        $phase = $postGoal['phase'] ?? null;
        $shownChange = $phase === null ? $change : ($postGoal['change'] ?? null);
        $trace = [];
        $outcome = function (bool $alert, int $severity, ?string $rule, ?string $level, string $reason, string $step) use (&$trace, $side, $scoreKey, $nextOdds, $currentOdds, $gap, $shownChange, $phase): SideOutcome {
            $trace[] = ['step' => $step, 'outcome' => $alert ? 'alert' : 'abstention', 'reason' => $reason, 'side' => $side];

            return new SideOutcome($side, $scoreKey, $nextOdds, $currentOdds, $gap, $shownChange, $alert, $severity, $rule, $level, $reason, $trace, $phase);
        };
        $alert = fn (int $severity, string $rule, string $reason, string $step): SideOutcome => $outcome(
            true,
            $severity,
            $rule,
            $severity === 2 ? $configuration->negativeGapLevel : $configuration->positiveGapLevel,
            $reason,
            $step,
        );
        $abstain = fn (string $reason, string $step): SideOutcome => $outcome(false, 0, null, null, $reason, $step);
        $continue = function (string $step) use (&$trace, $side): void {
            $trace[] = ['step' => $step, 'outcome' => 'continue', 'reason' => null, 'side' => $side];
        };

        if ($gap === null) {
            return $abstain('cotes du score actuel ou du prochain but indisponibles', $steps[0] ?? 'gap_negative');
        }

        $threshold = (float) $configuration->stableOddsChangePercent;
        if ($phase === RuleInput::POST_GOAL_FIRST_READING) {
            return match (true) {
                $gap < 0 && ! $configuration->isActive('F121-E1') => $abstain('premier relevé après un but : écart négatif, mais F121-E1 est inactive', 'post_goal_first_reading'),
                $gap < 0 => $alert(2, 'F121-E1', 'premier relevé après un but : écart négatif, alerte immédiate (F121-E1)', 'post_goal_first_reading'),
                $gap <= $configuration->abstentionGapThreshold => $alert(1, 'F121-C', 'premier relevé après un but : écart entre 0 et le seuil, alerte immédiate', 'post_goal_first_reading'),
                default => $abstain('premier relevé après un but : écart supérieur au seuil, attente', 'post_goal_first_reading'),
            };
        }

        if ($phase === RuleInput::POST_GOAL_WINDOW) {
            $windowChange = $postGoal['change'] ?? null;

            return match (true) {
                $windowChange === null || ! is_finite($windowChange) => $abstain('fenêtre après un but : variation depuis la première cote après le but non calculable', 'post_goal_window'),
                $configuration->isActive('F162-Bis') && $windowChange < -$threshold => $alert(2, 'F162-Bis', 'fenêtre après un but : baisse de plus de '.$this->percent($threshold).' depuis la première cote après le but (F162-Bis)', 'post_goal_window'),
                default => $abstain('fenêtre après un but : pas de baisse de plus de '.$this->percent($threshold).' depuis la première cote après le but', 'post_goal_window'),
            };
        }

        $trendUsable = $configuration->trendSource === 'cote_suggeree'
            && $configuration->stableOddsChangePercent !== null
            && $change !== null
            && is_finite($change);
        foreach ($steps as $step) {
            switch ($step) {
                case 'trend_drop':
                    if (! $trendUsable) {
                        return $abstain('tendance non calculable', $step);
                    }

                    if ($configuration->isActive('F162-Bis') && $change < -$threshold) {
                        return $alert(2, 'F162-Bis', 'baisse de plus de '.$this->percent($threshold).' en 2 minutes : le bookmaker a eu une information (F162-Bis)', $step);
                    }

                    $continue($step);

                    break;

                case 'trend_rise':
                    if (! $trendUsable) {
                        return $abstain('tendance non calculable', $step);
                    }

                    if ($change > 0) {
                        return $abstain('la cote monte', $step);
                    }

                    $continue($step);

                    break;

                case 'gap_negative':
                    if ($gap < 0) {
                        return $configuration->isActive('F121-E1')
                            ? $alert(2, 'F121-E1', 'écart négatif : le bookmaker attend un but de cette équipe (F121-E1)', $step)
                            : $abstain('écart négatif, mais F121-E1 est inactive', $step);
                    }

                    $continue($step);

                    break;

                case 'gap_too_high':
                    if ($gap > $configuration->abstentionGapThreshold) {
                        return $abstain('écart supérieur au seuil d’abstention (F121-G)', $step);
                    }

                    $continue($step);

                    break;

                case 'gap_small':
                    if ($gap > 0 && $gap <= $configuration->abstentionGapThreshold) {
                        return $alert(1, 'F121-C', 'petit écart positif : un but de cette équipe est probable', $step);
                    }

                    $continue($step);

                    break;
            }
        }

        return $abstain($gap == 0.0 ? 'écart nul : aucune règle satisfaite' : 'aucune règle satisfaite', 'fin');
    }

    private function odds(mixed $value): ?float
    {
        return is_numeric($value) && is_finite((float) $value) && (float) $value > 0 ? (float) $value : null;
    }

    private function percent(float $value): string
    {
        return rtrim(rtrim(number_format($value, 2, '.', ''), '0'), '.').' %';
    }
}
