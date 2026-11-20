<?php

namespace Tests\Unit;

use App\Rules\EngineResult;
use App\Rules\RuleConfiguration;
use App\Rules\RuleEngine;
use App\Rules\RuleInput;
use PHPUnit\Framework\TestCase;

/**
 * Règle F121 appliquée aux deux équipes : prochain but à domicile (h+1-a) et à l’extérieur (h-a+1), chacun avec son
 * écart et sa tendance. Exemples transmis par le client.
 */
class TwoSidedRuleTest extends TestCase
{
    public function test_arsenal_everton_rising_odds_of_two_nil_is_an_abstention_for_arsenal(): void
    {
        $result = $this->decide(1, 0, ['1-0' => 2.29, '2-0' => 3.60, '1-1' => 8.00], ['home' => $this->change(3.20, 3.60), 'away' => 0.0]);

        $this->assertFalse($result->shouldAlert);
        $this->assertStringContainsString('Domicile (2-0) : cote 3.60, écart +1.31, tendance +12.5 % → abstention (la cote monte)', $result->reason);
        $this->assertStringContainsString('Extérieur (1-1) : cote 8.00, écart +5.71, tendance 0 % → abstention (écart supérieur au seuil d’abstention (F121-G))', $result->reason);
        $this->assertStringNotContainsString('aucune équipe désignée', mb_strtolower($result->reason));
    }

    public function test_senegal_sudan_two_nil_falling_from_four_to_three_fifty_alerts_for_senegal(): void
    {
        $result = $this->decide(1, 0, ['1-0' => 2.80, '2-0' => 3.50, '1-1' => 6.00], ['home' => $this->change(4.00, 3.50), 'away' => 1.0]);

        $this->assertTrue($result->shouldAlert);
        $this->assertSame('home', $result->selection);
        $this->assertSame('F162-Bis', $result->decisiveRule);
        $this->assertSame('Critique', $result->level);
        $this->assertStringContainsString('prochain but de l’équipe à domicile, score 2-0', $result->reason);
        $this->assertStringContainsString('tendance −12.5 % → alerte Critique', $result->reason);
    }

    public function test_grimsby_cheltenham_negative_gap_is_critical(): void
    {
        $result = $this->decide(1, 1, ['1-1' => 3.19, '2-1' => 3.10, '1-2' => 10.00], ['home' => -3.2, 'away' => 0.0]);

        $this->assertTrue($result->shouldAlert);
        $this->assertSame('home', $result->selection);
        $this->assertSame('F121-E1', $result->decisiveRule);
        $this->assertSame('Critique', $result->level);
        $this->assertStringContainsString('Domicile (2-1) : cote 3.10, écart −0.09', $result->reason);
    }

    public function test_crewe_wigan_positive_gap_above_the_threshold_is_an_abstention(): void
    {
        $result = $this->decide(1, 1, ['1-1' => 2.34, '1-2' => 3.20, '2-1' => 9.00], ['home' => 0.0, 'away' => -1.6]);

        $this->assertFalse($result->shouldAlert);
        $this->assertStringContainsString('Extérieur (1-2) : cote 3.20, écart +0.86, tendance −1.6 % → abstention (écart supérieur au seuil d’abstention (F121-G))', $result->reason);
    }

    public function test_away_team_falling_odds_alert_even_when_the_home_team_has_the_smaller_gap(): void
    {
        $result = $this->decide(2, 0, ['2-0' => 3.00, '3-0' => 4.00, '2-1' => 4.50], ['home' => 2.0, 'away' => -8.0]);

        $this->assertTrue($result->shouldAlert, 'Avant : seule l’équipe à l’écart le plus faible (domicile) était évaluée.');
        $this->assertSame('away', $result->selection);
        $this->assertSame('F162-Bis', $result->decisiveRule);
        $this->assertStringContainsString('prochain but de l’équipe à l’extérieur, score 2-1', $result->reason);
    }

    public function test_after_a_goal_from_two_nil_to_three_nil_the_away_score_falling_since_the_first_post_goal_odds_alerts(): void
    {
        $result = (new RuleEngine)->evaluate(
            new RuleInput(
                homeScore: 3,
                awayScore: 0,
                exactScoreOdds: ['3-0' => 2.50, '4-0' => 6.00, '3-1' => 7.00],
                vitalityScore: 70,
                sidePostGoal: [
                    'home' => ['phase' => RuleInput::POST_GOAL_WINDOW, 'change' => 1.0],
                    'away' => ['phase' => RuleInput::POST_GOAL_WINDOW, 'change' => -9.0],
                ],
            ),
            new RuleConfiguration,
        );

        $this->assertTrue($result->shouldAlert);
        $this->assertSame('away', $result->selection);
        $this->assertSame('F162-Bis', $result->decisiveRule);
        $this->assertStringContainsString('Extérieur (3-1) : cote 7.00, écart +4.50, variation après le but −9 % → alerte Critique', $result->reason);
    }

    public function test_both_teams_in_signal_critical_wins_then_most_negative_gap_then_strongest_drop(): void
    {
        $bothCritical = $this->decide(1, 1, ['1-1' => 3.00, '2-1' => 2.80, '1-2' => 3.30], ['home' => -1.0, 'away' => -7.0]);
        $this->assertTrue($bothCritical->shouldAlert);
        $this->assertSame('home', $bothCritical->selection, 'Écart −0.20 contre +0.30 : l’écart le plus négatif l’emporte.');
        $this->assertStringContainsString('L’autre équipe (extérieur) donne aussi un signal (Critique)', $bothCritical->reason);

        $criticalBeatsHigh = $this->decide(1, 1, ['1-1' => 3.00, '2-1' => 3.30, '1-2' => 3.40], ['home' => -1.0, 'away' => -6.0]);
        $this->assertSame('away', $criticalBeatsHigh->selection, 'Haute (domicile, écart +0.30) contre Critique (extérieur, forte baisse).');
        $this->assertSame('Critique', $criticalBeatsHigh->level);
        $this->assertStringContainsString('L’autre équipe (domicile) donne aussi un signal (Haute)', $criticalBeatsHigh->reason);

        $equalGaps = $this->decide(1, 1, ['1-1' => 3.00, '2-1' => 2.90, '1-2' => 2.90], ['home' => -6.0, 'away' => -9.0]);
        $this->assertSame('away', $equalGaps->selection, 'Écarts égaux : la baisse la plus forte l’emporte.');
    }

    public function test_the_rule_no_longer_needs_f121_c_to_be_active(): void
    {
        $result = $this->decide(
            1,
            1,
            ['1-1' => 3.19, '2-1' => 3.10, '1-2' => 10.00],
            ['home' => 0.0, 'away' => 0.0],
            new RuleConfiguration(activeRules: ['F121-E1', 'F162-Bis']),
        );

        $this->assertTrue($result->shouldAlert);
        $this->assertSame('F121-E1', $result->decisiveRule);
    }

    public function test_common_steps_stay_shared_by_the_match(): void
    {
        $deadMatch = (new RuleEngine)->evaluate(
            new RuleInput(homeScore: 1, awayScore: 1, exactScoreOdds: ['1-1' => 3.19, '2-1' => 3.10, '1-2' => 10.00], vitalityScore: 40, sideOddsChangePercent: ['home' => -20.0, 'away' => -20.0]),
            new RuleConfiguration,
        );

        $this->assertFalse($deadMatch->shouldAlert, 'Vitalité ≤ 40 : abstention pour tout le match, avant les deux équipes.');
        $this->assertSame([], $deadMatch->sides);
        $this->assertSame('vitality', last($deadMatch->steps)['step']);
    }

    /**
     * @param  array<string, float>  $odds
     * @param  array{home: float|null, away: float|null}  $changes
     */
    private function decide(int $home, int $away, array $odds, array $changes, ?RuleConfiguration $configuration = null): EngineResult
    {
        return (new RuleEngine)->evaluate(
            new RuleInput(homeScore: $home, awayScore: $away, exactScoreOdds: $odds, vitalityScore: 70, sideOddsChangePercent: $changes),
            $configuration ?? new RuleConfiguration,
        );
    }

    private function change(float $before, float $now): float
    {
        return ($now - $before) / $before * 100;
    }
}
