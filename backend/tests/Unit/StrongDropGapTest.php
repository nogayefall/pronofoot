<?php

namespace Tests\Unit;

use App\Rules\EngineResult;
use App\Rules\RuleConfiguration;
use App\Rules\RuleEngine;
use App\Rules\RuleInput;
use PHPUnit\Framework\TestCase;

/**
 * « F162-Bis exige un écart <= seuil F121-G » (décision du 25 novembre 2026), activé par défaut : seulement quand une
 * seule équipe est en signal, et jamais dans les 2 minutes après un but.
 */
class StrongDropGapTest extends TestCase
{
    /** RB Leipzig – Lens, alerte #2807 du 24 novembre 2026, 75e, 2-1. */
    private const LEIPZIG = ['2-1' => 2.37, '3-1' => 3.40, '2-2' => 6.50];

    private const LEIPZIG_CHANGES = ['home' => 4.6, 'away' => -7.143];

    public function test_leipzig_lens_2807_is_now_a_justified_abstention(): void
    {
        $result = $this->decide(2, 1, self::LEIPZIG, self::LEIPZIG_CHANGES);

        $this->assertFalse($result->shouldAlert);
        $this->assertNull($result->decisiveRule);
        $this->assertNull($result->selection);
        $this->assertSame([], $result->options);
        $this->assertStringStartsWith('Abstention : baisse de cote seule (F162-Bis), mais écart +4.13 supérieur à 0.50 (F121-G) : pas d’alerte.', $result->reason);
        $this->assertStringContainsString('Domicile (3-1) : cote 3.40, écart +1.03, tendance +4.6 % → abstention (la cote monte)', $result->reason);
        $this->assertStringContainsString('Extérieur (2-2) : cote 6.50, écart +4.13, tendance −7.1 % → abstention (baisse de cote seule (F162-Bis)', $result->reason);
        $this->assertStringNotContainsString('alerte Critique', $result->reason);
        $this->assertSame('strong_drop_gap', last($result->steps)['step']);
        $this->assertSame('away', last($result->steps)['side']);
        $this->assertSame([false, false], array_column($result->sides, 'alert'));
    }

    public function test_leipzig_lens_2807_alerted_before_and_still_does_when_the_setting_is_off(): void
    {
        $result = $this->decide(2, 1, self::LEIPZIG, self::LEIPZIG_CHANGES, new RuleConfiguration(strongDropRequiresGap: false));

        $this->assertTrue($result->shouldAlert);
        $this->assertSame(['F162-Bis', 'Critique', 'away'], [$result->decisiveRule, $result->level, $result->selection]);
    }

    public function test_the_threshold_is_included_and_follows_the_f121_g_setting(): void
    {
        $drop = ['home' => -8.0, 'away' => 1.0];
        $this->assertTrue($this->decide(1, 0, ['1-0' => 3.00, '2-0' => 3.50, '1-1' => 9.00], $drop)->shouldAlert, 'Écart 0.50 inclus.');
        $this->assertFalse($this->decide(1, 0, ['1-0' => 3.00, '2-0' => 3.51, '1-1' => 9.00], $drop)->shouldAlert, 'Écart 0.51.');
        $this->assertTrue($this->decide(1, 0, ['1-0' => 3.00, '2-0' => 3.51, '1-1' => 9.00], $drop, new RuleConfiguration(abstentionGapThreshold: 0.60))->shouldAlert);
        $this->assertTrue($this->decide(1, 0, ['1-0' => 3.00, '2-0' => 2.90, '1-1' => 9.00], $drop)->shouldAlert, 'Écart négatif : inchangé.');
    }

    public function test_two_teams_in_signal_keep_the_neutral_alert(): void
    {
        // Domicile : petit écart (alerte Haute) ; extérieur : baisse seule avec un écart de +3.50.
        $one = $this->decide(1, 1, ['1-1' => 3.00, '2-1' => 3.40, '1-2' => 6.50], ['home' => -1.0, 'away' => -7.143]);
        $this->assertTrue($one->shouldAlert);
        $this->assertNull($one->selection);
        $this->assertSame(['neutral'], array_column($one->options, 'type'));
        $this->assertSame('F162-Bis', $one->decisiveRule);

        // Deux baisses seules, deux écarts supérieurs au seuil : toujours l’alerte neutre.
        $both = $this->decide(1, 1, ['1-1' => 3.00, '2-1' => 4.00, '1-2' => 6.50], ['home' => -6.0, 'away' => -7.143]);
        $this->assertTrue($both->shouldAlert);
        $this->assertSame(['neutral'], array_column($both->options, 'type'));
    }

    public function test_the_two_minutes_after_a_goal_are_unchanged(): void
    {
        $result = (new RuleEngine)->evaluate(
            new RuleInput(homeScore: 2, awayScore: 1, exactScoreOdds: self::LEIPZIG, vitalityScore: 70, sidePostGoal: [
                'home' => ['phase' => RuleInput::POST_GOAL_WINDOW, 'change' => 4.6],
                'away' => ['phase' => RuleInput::POST_GOAL_WINDOW, 'change' => -7.143],
            ]),
            new RuleConfiguration,
        );

        $this->assertTrue($result->shouldAlert, 'Complément 4 : la baisse depuis la première cote après le but suffit.');
        $this->assertSame(['F162-Bis', 'away'], [$result->decisiveRule, $result->selection]);
    }

    public function test_follow_the_leader_counts_as_a_single_team(): void
    {
        $odds = ['2-0' => 3.00, '3-0' => 4.00, '2-1' => 4.50];
        $this->assertFalse($this->decide(2, 0, $odds, ['home' => -8.0, 'away' => -8.0], new RuleConfiguration(followLeader: true))->shouldAlert);
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
}
