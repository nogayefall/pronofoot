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

    public function test_both_teams_in_signal_give_only_the_neutral_option_without_designated_team(): void
    {
        $bothCritical = $this->decide(1, 1, ['1-1' => 3.00, '2-1' => 2.80, '1-2' => 3.30], ['home' => -1.0, 'away' => -7.0]);

        $this->assertTrue($bothCritical->shouldAlert);
        $this->assertNull($bothCritical->selection, 'Pas d’équipe désignée.');
        $this->assertSame('Over 2.5 buts', $bothCritical->suggestedAction, '1-1 : un but de plus = Over 2.5.');
        $this->assertSame('Critique', $bothCritical->level);
        $this->assertCount(1, $bothCritical->options);
        $this->assertSame('neutral', $bothCritical->options[0]['type']);
        $this->assertStringContainsString('les deux équipes donnent un signal, pas d’équipe désignée. Option neutre seule : un but de plus dans le match, Over 2.5, cote non disponible. Écarts : domicile −0.20, extérieur +0.30.', $bothCritical->reason);

        $criticalAndHigh = $this->decide(1, 1, ['1-1' => 3.00, '2-1' => 3.30, '1-2' => 3.40], ['home' => -1.0, 'away' => -6.0]);
        $this->assertNull($criticalAndHigh->selection, 'Haute (domicile) et Critique (extérieur) : toujours l’option neutre seule.');
        $this->assertSame('Critique', $criticalAndHigh->level, 'Niveau du signal le plus grave.');
        $this->assertSame(['neutral'], array_column($criticalAndHigh->options, 'type'));
    }

    public function test_a_single_team_in_signal_gives_two_options_targeted_first(): void
    {
        $result = (new RuleEngine)->evaluate(
            new RuleInput(
                homeScore: 1,
                awayScore: 0,
                exactScoreOdds: ['1-0' => 2.80, '2-0' => 3.50, '1-1' => 6.00],
                vitalityScore: 70,
                sideOddsChangePercent: ['home' => -12.5, 'away' => 1.0],
                overLineOdds: ['1.5' => 1.85, '2.5' => 3.10],
            ),
            new RuleConfiguration,
        );

        $this->assertSame('home', $result->selection);
        $this->assertSame(['targeted', 'neutral'], array_column($result->options, 'type'));
        $this->assertSame('2-0', $result->options[0]['scoreKey']);
        $this->assertSame(3.5, $result->options[0]['odds']);
        $this->assertSame('Over 1.5', $result->options[1]['line'], '1-0 : un but de plus = Over 1.5.');
        $this->assertSame(1.85, $result->options[1]['odds']);
        $this->assertStringContainsString('Option 1 (ciblée) : prochain but de l’équipe à domicile, score 2-0, cote 3.50, écart +0.70. Option 2 (neutre) : un but de plus dans le match, Over 1.5, cote 1.85. Aucune option n’est jouée automatiquement.', $result->reason);
    }

    public function test_two_all_gives_over_four_point_five_and_abstention_gives_no_option(): void
    {
        $twoAll = $this->decide(2, 2, ['2-2' => 5.00, '3-2' => 4.80, '2-3' => 9.50], ['home' => 0.0, 'away' => 0.0]);
        $this->assertSame('home', $twoAll->selection);
        $this->assertSame('Over 4.5', $twoAll->options[1]['line'], '2-2 : un but de plus = Over 4.5.');
        $this->assertNull($twoAll->options[1]['odds'], 'Marché Over/Under indisponible : option sans cote.');

        $abstention = $this->decide(1, 0, ['1-0' => 2.29, '2-0' => 3.60, '1-1' => 8.00], ['home' => 12.5, 'away' => 0.0]);
        $this->assertFalse($abstention->shouldAlert);
        $this->assertSame([], $abstention->options);
    }

    public function test_f121_d_keeps_its_over_four_point_five_without_targeted_option(): void
    {
        $result = $this->decide(2, 2, ['2-2' => 8.00, '3-2' => 6.00, '2-3' => 8.00], ['home' => -10.0, 'away' => 0.0]);

        $this->assertSame('F121-D', $result->decisiveRule);
        $this->assertSame('Over 4.5 buts', $result->suggestedAction);
        $this->assertSame([], $result->options);
    }

    public function test_f121_x_cross_gap_is_off_by_default_and_gives_a_neutral_bet_when_enabled(): void
    {
        $odds = ['2-2' => 6.00, '3-2' => 8.50, '2-3' => 9.00];
        $this->assertNotSame('F121-X', $this->decide(2, 2, $odds, ['home' => 0.0, 'away' => 0.0])->decisiveRule, 'Désactivée par défaut.');

        $pipeline = ['F121-E2', 'F121-D', 'F121-X', 'vitality', 'trend_drop', 'trend_rise', 'gap_negative', 'gap_too_high', 'gap_small'];
        $enabled = $this->decide(2, 2, $odds, ['home' => 0.0, 'away' => 0.0], new RuleConfiguration(pipeline: $pipeline));
        $this->assertSame('F121-X', $enabled->decisiveRule, 'Écart croisé |8.50 − 9.00| = 0.50 < 1.00, match ouvert (4 buts).');
        $this->assertSame('Over 4.5 buts', $enabled->suggestedAction);
        $this->assertSame(['neutral'], array_column($enabled->options, 'type'));

        $notOpen = $this->decide(1, 1, ['1-1' => 6.00, '2-1' => 8.50, '1-2' => 9.00], ['home' => 0.0, 'away' => 0.0], new RuleConfiguration(pipeline: $pipeline));
        $this->assertNotSame('F121-X', $notOpen->decisiveRule, 'Match non ouvert (2 buts) : pas de F121-X.');
    }

    public function test_follow_the_leader_is_off_by_default_and_only_evaluates_the_leader_when_enabled(): void
    {
        $odds = ['2-0' => 3.00, '3-0' => 4.00, '2-1' => 4.50];
        $this->assertSame('away', $this->decide(2, 0, $odds, ['home' => 2.0, 'away' => -8.0])->selection, 'Désactivé : les deux équipes sont évaluées.');

        $leaderOnly = $this->decide(2, 0, $odds, ['home' => 2.0, 'away' => -8.0], new RuleConfiguration(followLeader: true));
        $this->assertFalse($leaderOnly->shouldAlert, 'Seul le leader (domicile, cote en hausse) est évalué.');
        $this->assertCount(1, $leaderOnly->sides);
        $this->assertContains('F121-C.2', array_column($leaderOnly->steps, 'step'));
    }

    public function test_a_match_without_statistics_skips_the_vitality_filter_and_says_so(): void
    {
        $result = (new RuleEngine)->evaluate(
            new RuleInput(
                homeScore: 1,
                awayScore: 1,
                exactScoreOdds: ['1-1' => 3.19, '2-1' => 3.10, '1-2' => 10.00],
                sideOddsChangePercent: ['home' => 0.0, 'away' => 0.0],
                vitalityUnavailable: true,
            ),
            new RuleConfiguration,
        );

        $this->assertTrue($result->shouldAlert, 'Sans statistiques : le filtre vitalité n’est pas appliqué (à confirmer).');
        $this->assertTrue($result->filters['vitality']->passed);
        $this->assertStringContainsString('Vitalité non disponible (statistiques non couvertes)', $result->reason);
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
