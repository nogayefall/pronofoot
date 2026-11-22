<?php

namespace Tests\Unit;

use App\Rules\ConfidenceScorer;
use App\Rules\RuleConfiguration;
use App\Rules\RuleEngine;
use App\Rules\RuleInput;
use PHPUnit\Framework\TestCase;

/**
 * Score de confiance automatique : exemples chiffrés du document client V12.
 */
class ConfidenceScorerTest extends TestCase
{
    private const WEIGHTS = ['F121-E1' => 25, 'F121-C' => 20, 'F162-Bis' => 20, 'F121-D' => 15, 'F121-E2' => 10, 'F121-C.2' => 10];

    public function test_f121_e1_uses_the_most_negative_gap_linearly_capped_at_95(): void
    {
        // Grimsby – Cheltenham, 68e : 1-1 à 3.19, 2-1 à 3.10, écart −0.09 : 17 dans le document (17.1 au dixième).
        $this->assertSame(17.1, $this->rule('F121-E1', 1, 1, ['1-1' => 3.19, '2-1' => 3.10, '1-2' => 9.0]));
        // Real Madrid – Allemagne, 22e : 0-0 à 3.66, 1-0 à 3.00, écart −0.66 : 125, plafonné à 95.
        $this->assertSame(95.0, $this->rule('F121-E1', 0, 0, ['0-0' => 3.66, '1-0' => 3.00, '0-1' => 5.0]));
        // Arsenal – Everton, 64e : écart +0.18, positif : 0.
        $this->assertSame(0.0, $this->rule('F121-E1', 1, 0, ['1-0' => 2.92, '2-0' => 3.10, '1-1' => 8.50]));
        // L’écart le plus négatif des deux équipes est retenu.
        $this->assertSame(38.0, $this->rule('F121-E1', 1, 1, ['1-1' => 4.0, '2-1' => 3.90, '1-2' => 3.80]));
    }

    public function test_f121_c_gives_90_to_the_team_with_the_smallest_gap_whether_it_leads_or_trails(): void
    {
        // Interprétation retenue, exemple Espagne-Angleterre, à valider par le client.
        $this->assertSame(90.0, $this->rule('F121-C', 1, 0, ['1-0' => 2.92, '2-0' => 3.10, '1-1' => 8.50]), 'Arsenal mène et a le plus petit écart (+0.18 contre +5.58).');
        $this->assertSame(90.0, $this->rule('F121-C', 0, 1, ['0-1' => 4.79, '1-1' => 4.50, '0-2' => 6.00]), 'Espagne derrière au score, plus petit écart (−0.29 contre +1.21).');
        $this->assertSame(90.0, $this->rule('F121-C', 1, 0, ['1-0' => 3.19, '2-0' => 7.50, '1-1' => 3.25]), 'Villarreal derrière, plus petit écart (+0.06) : plus de score 20.');
        $this->assertSame(0.0, $this->rule('F121-C', 1, 1, ['1-1' => 3.19, '2-1' => 3.10, '1-2' => 9.0]), 'Égalité au score.');
        $this->assertSame(0.0, $this->rule('F121-C', 0, 0, ['0-0' => 3.66, '1-0' => 3.00, '0-1' => 5.0]), 'Égalité 0-0.');
        $this->assertTrue($this->evaluate(1, 0, ['1-0' => 2.92, '2-0' => 3.10, '1-1' => 8.50])['rules']['F121-C']['toConfirm']);
    }

    public function test_f162_bis_scores_the_strongest_drop_over_the_trend_window(): void
    {
        $odds = ['1-0' => 2.92, '2-0' => 3.10, '1-1' => 8.50];
        $this->assertSame(95.0, $this->rule('F162-Bis', 1, 0, $odds, changes: ['home' => -17.0, 'away' => 2.0]));
        $this->assertSame(75.0, $this->rule('F162-Bis', 1, 0, $odds, changes: ['home' => -6.25, 'away' => null]));
        $this->assertSame(75.0, $this->rule('F162-Bis', 1, 0, $odds, changes: ['home' => -5.0]), '5 % inclus.');
        $this->assertSame(75.0, $this->rule('F162-Bis', 1, 0, $odds, changes: ['home' => -10.0]), '10 % : pas plus de 10 %.');
        $this->assertSame(0.0, $this->rule('F162-Bis', 1, 0, $odds, changes: ['home' => 1.5]));
        $this->assertSame(0.0, $this->rule('F162-Bis', 1, 0, $odds), 'Sans tendance : 0.');
    }

    public function test_f121_d_needs_both_next_scores_at_8_or_less_and_keeps_the_minimum_goals_condition(): void
    {
        $open = new RuleConfiguration(openMatchMinimumGoals: 2);
        // Atalanta – Frosinone : 3-2 à 6.00 et 2-3 à 8.00 (borne incluse) : 80.
        $this->assertSame(80.0, $this->rule('F121-D', 2, 2, ['2-2' => 9.0, '3-2' => 6.00, '2-3' => 8.00], $open));
        $this->assertSame(0.0, $this->rule('F121-D', 2, 2, ['2-2' => 9.0, '3-2' => 6.00, '2-3' => 8.01], $open));
        // Rennes – Racing, 2-0 : 80 si la condition de buts le permet ; avec le minimum actuel du moteur (4 buts) : 0.
        $this->assertSame(80.0, $this->rule('F121-D', 2, 0, ['2-0' => 3.0, '3-0' => 4.50, '2-1' => 5.50], $open));
        $this->assertSame(0.0, $this->rule('F121-D', 2, 0, ['2-0' => 3.0, '3-0' => 4.50, '2-1' => 5.50]));
    }

    public function test_f121_e2_scores_the_under_2_5_odds_only_at_halftime(): void
    {
        $odds = ['1-0' => 3.0, '2-0' => 6.0, '1-1' => 4.0];
        $this->assertSame(85.0, $this->rule('F121-E2', 1, 0, $odds, halftime: true, under: 1.36), 'Como – Man U.');
        $this->assertSame(85.0, $this->rule('F121-E2', 1, 0, $odds, halftime: true, under: 1.40), '1.40 inclus.');
        $this->assertSame(30.0, $this->rule('F121-E2', 1, 0, $odds, halftime: true, under: 1.10), 'Match trop fermé.');
        $this->assertSame(0.0, $this->rule('F121-E2', 1, 0, $odds, halftime: true, under: 1.45));
        $this->assertSame(0.0, $this->rule('F121-E2', 1, 0, $odds, halftime: false, under: 1.36), 'Hors mi-temps.');
    }

    public function test_f121_c2_gives_90_when_a_team_leads_by_two_goals(): void
    {
        $this->assertSame(90.0, $this->rule('F121-C.2', 2, 0, ['2-0' => 3.0, '3-0' => 6.0, '2-1' => 5.0]), 'Bruges – Lens.');
        $this->assertSame(0.0, $this->rule('F121-C.2', 1, 1, ['1-1' => 3.19, '2-1' => 3.10, '1-2' => 9.0]), 'Grimsby – Cheltenham.');
    }

    public function test_arsenal_everton_full_example_gives_37_and_the_engine_stores_the_same_score(): void
    {
        $odds = ['1-0' => 2.92, '2-0' => 3.10, '1-1' => 8.50];
        $confidence = $this->evaluate(1, 0, $odds, changes: ['home' => -17.0, 'away' => null]);

        $this->assertSame(37.0, $confidence['score']);
        $this->assertSame([0.0, 90.0, 95.0, 0.0, 0.0, 0.0], array_column($confidence['rules'], 'score'));
        $this->assertSame([0.0, 18.0, 19.0, 0.0, 0.0, 0.0], array_column($confidence['rules'], 'contribution'));
        $this->assertFalse($confidence['passes'], '37.0 % < 55 %.');

        // Le moteur (scan réel et Testeur) calcule le même score, sans bloquer l’alerte : convergence désactivée.
        $result = (new RuleEngine)->evaluate(
            new RuleInput(homeScore: 1, awayScore: 0, exactScoreOdds: $odds, vitalityScore: 90, sideOddsChangePercent: ['home' => -17.0, 'away' => null]),
            new RuleConfiguration(methodWeights: self::WEIGHTS, minimumConvergenceScore: 55.0),
        );
        $this->assertSame(37.0, $result->convergenceScore);
        $this->assertSame(37.0, $result->confidence['score']);
        $this->assertTrue($result->shouldAlert, 'Forte baisse F162-Bis : l’alerte n’est pas bloquée par le score.');
        $this->assertSame('F162-Bis', $result->decisiveRule);
    }

    public function test_the_score_is_not_computed_without_weights_or_with_a_weight_on_a_rule_without_formula(): void
    {
        $odds = ['1-0' => 2.92, '2-0' => 3.10, '1-1' => 8.50];
        $this->assertNull($this->evaluate(1, 0, $odds, configuration: new RuleConfiguration)['score']);
        $this->assertNull($this->evaluate(1, 0, $odds, configuration: new RuleConfiguration(methodWeights: ['F121-C' => 1, 'F121-X' => 1]))['score']);
    }

    /**
     * @param  array<string, float>  $odds
     * @param  array{home?: float|null, away?: float|null}  $changes
     */
    private function rule(string $ruleId, int $home, int $away, array $odds, ?RuleConfiguration $configuration = null, array $changes = [], ?bool $halftime = null, ?float $under = null): float
    {
        return $this->evaluate($home, $away, $odds, $configuration, $changes, $halftime, $under)['rules'][$ruleId]['score'];
    }

    /**
     * @param  array<string, float>  $odds
     * @param  array{home?: float|null, away?: float|null}  $changes
     * @return array<string, mixed>
     */
    private function evaluate(int $home, int $away, array $odds, ?RuleConfiguration $configuration = null, array $changes = [], ?bool $halftime = null, ?float $under = null): array
    {
        return (new ConfidenceScorer)->evaluate(
            new RuleInput(homeScore: $home, awayScore: $away, exactScoreOdds: $odds, halftime: $halftime, under25Odds: $under),
            $configuration ?? new RuleConfiguration(methodWeights: self::WEIGHTS, minimumConvergenceScore: 55.0),
            $changes,
        );
    }
}
