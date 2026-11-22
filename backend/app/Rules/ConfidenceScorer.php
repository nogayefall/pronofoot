<?php

namespace App\Rules;

/**
 * Score de confiance automatique (document client V12, formules définitives) : un score de 0 à 100 par règle, puis la
 * moyenne pondérée par les poids du profil. Classe pure, utilisée à l’identique par le scan réel et par le Testeur.
 *
 *  - F121-E1 : écart le plus négatif des deux équipes ; (|écart| / 0.50) × 95, plafonné à 95 ; 0 si l’écart est >= 0.
 *  - F121-C : équipe désignée = celle qui a le plus petit écart ; 90 si une équipe est désignée et que le score n’est
 *    pas à égalité, 0 sinon (interprétation retenue, exemple Espagne-Angleterre, à valider par le client).
 *  - F162-Bis : plus forte baisse sur la fenêtre de tendance du moteur (2 minutes) ; > 10 % = 95 ; 5 à 10 % = 75 ; sinon 0.
 *  - F121-D : deux scores suivants (h+1-a et h-a+1) ; 80 si les deux cotes sont <= 8.00 ; sinon 0. Au moins 4
 *    buts (condition du moteur, confirmée par le client).
 *  - F121-E2 : seulement à la mi-temps ; Under 2.5 dans la plage du moteur (1.15 à 1.40) = 85 ; en dessous = 30 ; au-dessus = 0.
 *  - F121-C.2 : une équipe mène de 2 buts ou plus = 90 ; sinon 0.
 *
 * Chaque score est arrondi au dixième, le score final aussi. Le score n’empêche aucune alerte tant que l’étape
 * « convergence » est désactivée.
 */
final class ConfidenceScorer
{
    public const RULES = ['F121-E1', 'F121-C', 'F162-Bis', 'F121-D', 'F121-E2', 'F121-C.2'];

    public const TO_CONFIRM = ['F121-C'];

    public function __construct(private readonly ConvergenceCalculator $calculator = new ConvergenceCalculator) {}

    /**
     * @param  array{home?: float|null, away?: float|null}  $changes  Tendance de la cote du prochain but de chaque équipe (%).
     * @return array{score: float|null, threshold: float, passes: bool|null, reason: string|null, rules: array<string, array{score: float, weight: float, contribution: float, detail: string, toConfirm: bool}>}
     */
    public function evaluate(RuleInput $input, RuleConfiguration $configuration, array $changes): array
    {
        $scores = [
            'F121-E1' => $this->negativeGap($input),
            'F121-C' => $this->directionalGap($input),
            'F162-Bis' => $this->strongDrop($changes),
            'F121-D' => $this->openMatch($input, $configuration),
            'F121-E2' => $this->halftime($input, $configuration),
            'F121-C.2' => $this->friction($input),
        ];

        $weights = array_filter($configuration->methodWeights, fn (mixed $weight): bool => is_numeric($weight) && (float) $weight > 0);
        $totalWeight = array_sum(array_map('floatval', $weights));
        $missing = array_diff(array_keys($weights), self::RULES);
        $score = match (true) {
            $weights === [] => null,
            $missing !== [] => null,
            default => $this->calculator->calculate(array_map(fn (array $rule): float => $rule[0], $scores), $weights),
        };
        $reason = match (true) {
            $weights === [] => 'Score non calculé : aucun poids défini dans le profil.',
            $missing !== [] => 'Score non calculé : aucune formule pour '.implode(', ', $missing).'.',
            default => null,
        };

        $rules = [];
        foreach ($scores as $ruleId => [$ruleScore, $detail]) {
            $weight = (float) ($weights[$ruleId] ?? 0);
            $rules[$ruleId] = [
                'score' => $ruleScore,
                'weight' => $weight,
                'contribution' => $totalWeight > 0 ? round($ruleScore * $weight / $totalWeight, 2) : 0.0,
                'detail' => $detail,
                'toConfirm' => in_array($ruleId, self::TO_CONFIRM, true),
            ];
        }

        $score = $score === null ? null : round($score, 1);

        return [
            'score' => $score,
            'threshold' => $configuration->minimumConvergenceScore,
            'passes' => $score === null ? null : $score > $configuration->minimumConvergenceScore,
            'reason' => $reason,
            'rules' => $rules,
        ];
    }

    /**
     * @return array{0: float, 1: string}
     */
    private function negativeGap(RuleInput $input): array
    {
        $gaps = array_filter($this->gaps($input), fn (?float $gap): bool => $gap !== null);
        if ($gaps === []) {
            return [0.0, 'Écart non calculable (cotes manquantes) : 0.'];
        }

        $gap = min($gaps);
        if ($gap >= 0) {
            return [0.0, 'Écart le plus faible '.$this->signed($gap).' (positif ou nul) : 0.'];
        }

        $score = round(min(95.0, abs($gap) / 0.50 * 95), 1);

        return [$score, 'Écart le plus négatif '.$this->signed($gap).' : ('.number_format(abs($gap), 2, '.', '').' / 0.50) × 95'.($score >= 95.0 ? ', plafonné à 95' : '')." = {$this->number($score)}."];
    }

    /**
     * F121-C : interprétation retenue, exemple Espagne-Angleterre, à valider par le client. L’équipe désignée est celle
     * qui a le plus petit écart ; 90 si une équipe est désignée et que le score n’est pas à égalité, 0 sinon. Que
     * l’équipe désignée mène ou soit derrière n’y change rien (le score « 20 » du document n’est pas appliqué).
     *
     * @return array{0: float, 1: string}
     */
    private function directionalGap(RuleInput $input): array
    {
        if ($input->homeScore === $input->awayScore) {
            return [0.0, 'Égalité au score : 0.'];
        }

        $gaps = $this->gaps($input);
        if ($gaps['home'] === null && $gaps['away'] === null) {
            return [0.0, 'Écarts non calculables (cotes manquantes) : aucune équipe désignée, 0.'];
        }

        if ($gaps['home'] !== null && $gaps['away'] !== null && $gaps['home'] === $gaps['away']) {
            return [0.0, 'Écarts égaux ('.$this->signed($gaps['home']).') : aucune équipe désignée, 0.'];
        }

        $designated = $gaps['away'] === null || ($gaps['home'] !== null && $gaps['home'] < $gaps['away']) ? 'home' : 'away';
        $other = $designated === 'home' ? 'away' : 'home';
        $label = fn (string $side): string => $side === 'home' ? 'domicile' : 'extérieur';
        $position = ($designated === 'home') === ($input->homeScore > $input->awayScore) ? 'mène' : 'est menée';

        return [90.0, sprintf(
            'Équipe désignée : %s, plus petit écart %s%s ; elle %s, score hors égalité : 90 (interprétation à valider).',
            $label($designated),
            $this->signed((float) $gaps[$designated]),
            $gaps[$other] === null ? '' : ' (contre '.$this->signed($gaps[$other]).')',
            $position,
        )];
    }

    /**
     * @param  array{home?: float|null, away?: float|null}  $changes
     * @return array{0: float, 1: string}
     */
    private function strongDrop(array $changes): array
    {
        $values = array_filter([$changes['home'] ?? null, $changes['away'] ?? null], fn (mixed $change): bool => is_numeric($change));
        if ($values === []) {
            return [0.0, 'Tendance sur 2 minutes non disponible : 0.'];
        }

        $change = (float) min($values);
        $drop = -$change;
        $score = match (true) {
            $drop > 10 => 95.0,
            $drop >= 5 => 75.0,
            default => 0.0,
        };
        $text = $change < 0 ? 'Baisse de '.$this->number($drop, 2).' %' : 'Variation '.$this->signed($change, 2).' % (pas de baisse)';

        return [$score, "{$text} sur 2 minutes : {$this->number($score)}."];
    }

    /**
     * @return array{0: float, 1: string}
     */
    private function openMatch(RuleInput $input, RuleConfiguration $configuration): array
    {
        $goals = $input->homeScore + $input->awayScore;
        if ($goals < $configuration->openMatchMinimumGoals) {
            return [0.0, "{$goals} but(s) : moins que les {$configuration->openMatchMinimumGoals} buts minimum, 0."];
        }

        $homeKey = ($input->homeScore + 1).'-'.$input->awayScore;
        $awayKey = $input->homeScore.'-'.($input->awayScore + 1);
        $home = $this->odds($input, $homeKey);
        $away = $this->odds($input, $awayKey);
        if ($home === null || $away === null) {
            return [0.0, 'Cotes des scores suivants manquantes : 0.'];
        }

        $limit = $configuration->upcomingScoreOddsLimit;
        $open = $home <= $limit && $away <= $limit;

        return [
            $open ? 80.0 : 0.0,
            sprintf('Scores suivants %s (%s) et %s (%s) : %s, %d.', $homeKey, $this->number($home, 2), $awayKey, $this->number($away, 2), $open ? 'les deux <= '.$this->number($limit, 2) : 'une cote > '.$this->number($limit, 2), $open ? 80 : 0),
        ];
    }

    /**
     * @return array{0: float, 1: string}
     */
    private function halftime(RuleInput $input, RuleConfiguration $configuration): array
    {
        if ($input->halftime !== true) {
            return [0.0, 'Pas à la mi-temps : 0.'];
        }

        $under = $input->under25Odds;
        if ($under === null || $under <= 0) {
            return [0.0, 'Cote Under 2.5 non disponible : 0.'];
        }

        $score = match (true) {
            $under < $configuration->halftimeUnderMinimum => 30.0,
            $under <= $configuration->halftimeUnderMaximum => 85.0,
            default => 0.0,
        };

        return [$score, 'Under 2.5 à '.$this->number($under, 2).' (plage '.$this->number($configuration->halftimeUnderMinimum, 2).' à '.$this->number($configuration->halftimeUnderMaximum, 2).") : {$this->number($score)}."];
    }

    /**
     * @return array{0: float, 1: string}
     */
    private function friction(RuleInput $input): array
    {
        $margin = abs($input->homeScore - $input->awayScore);

        return $margin >= 2
            ? [90.0, "Une équipe mène de {$margin} buts : 90."]
            : [0.0, 'Aucune équipe ne mène de 2 buts : 0.'];
    }

    /**
     * Écart de chaque équipe : cote de son prochain but − cote du score actuel.
     *
     * @return array{home: float|null, away: float|null}
     */
    private function gaps(RuleInput $input): array
    {
        $current = $this->odds($input, "{$input->homeScore}-{$input->awayScore}");
        $home = $this->odds($input, ($input->homeScore + 1).'-'.$input->awayScore);
        $away = $this->odds($input, $input->homeScore.'-'.($input->awayScore + 1));

        return [
            'home' => $current === null || $home === null ? null : round($home - $current, 4),
            'away' => $current === null || $away === null ? null : round($away - $current, 4),
        ];
    }

    private function odds(RuleInput $input, string $key): ?float
    {
        $odds = $input->exactScoreOdds[$key] ?? null;

        return is_numeric($odds) && is_finite((float) $odds) && (float) $odds > 0 ? (float) $odds : null;
    }

    private function signed(float $value, int $decimals = 2): string
    {
        return ($value > 0 ? '+' : '').number_format($value, $decimals, '.', '');
    }

    private function number(float $value, int $decimals = 1): string
    {
        return number_format($value, $decimals, '.', '');
    }
}
