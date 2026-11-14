<?php

namespace Tests\Unit;

use App\Rules\ConvergenceCalculator;
use App\Rules\EngineResult;
use App\Rules\RuleConfiguration;
use App\Rules\RuleEngine;
use App\Rules\RuleInput;
use App\Rules\RuleVerdict;
use InvalidArgumentException;
use PHPUnit\Framework\TestCase;

class RuleEngineTest extends TestCase
{
    public function test_f121_c_follows_the_smaller_gap_in_the_documented_zero_zero_example(): void
    {
        $input = fn (float $trend): RuleInput => new RuleInput(
            homeScore: 0,
            awayScore: 0,
            exactScoreOdds: ['0-0' => 7.5, '1-0' => 8.6, '0-1' => 9.8],
            vitalityScore: 61,
            oddsChangePercent: $trend,
        );
        $strongDrop = (new RuleEngine)->evaluate($input(-6.0), new RuleConfiguration);
        $slightDrop = (new RuleEngine)->evaluate($input(-1.0), new RuleConfiguration);

        $this->assertSame('home', $strongDrop->rules['F121-C']->details['selectedTeam']);
        $this->assertEqualsWithDelta(1.1, $strongDrop->rules['F121-C']->details['selectedGap'], 0.0001);
        $this->assertTrue($strongDrop->shouldAlert);
        $this->assertSame('F162-Bis', $strongDrop->decisiveRule, 'Forte baisse prioritaire sur l’écart.');
        $this->assertSame('Critique', $strongDrop->level);
        $this->assertSame('home', $strongDrop->selection);
        $this->assertFalse($slightDrop->shouldAlert, 'Écart 1.10 > 0.50 sans forte baisse : F121-G.');
        $this->assertSame('Écart positif supérieur au seuil d’abstention (F121-G).', $slightDrop->reason);
    }

    public function test_negative_gap_is_a_critical_alert_through_f121_e1(): void
    {
        $input = new RuleInput(
            homeScore: 0,
            awayScore: 0,
            exactScoreOdds: ['0-0' => 7.5, '1-0' => 6.5, '0-1' => 9.8],
            vitalityScore: 61,
            oddsChangePercent: -1.0,
        );
        $result = (new RuleEngine)->evaluate($input, new RuleConfiguration);

        $this->assertSame(RuleVerdict::Candidate, $result->rules['F121-C']->verdict);
        $this->assertSame(-1.0, $result->rules['F121-C']->details['selectedGap']);
        $this->assertSame(RuleVerdict::Candidate, $result->rules['F121-E1']->verdict);
        $this->assertTrue($result->shouldAlert);
        $this->assertSame('F121-E1', $result->decisiveRule);
        $this->assertSame('Critique', $result->level);
        $this->assertSame('home', $result->selection);

        $withoutE1 = (new RuleEngine)->evaluate($input, new RuleConfiguration(activeRules: ['F121-C', 'F121-C.2', 'F162-Bis']));
        $this->assertFalse($withoutE1->shouldAlert);
        $this->assertSame('Écart négatif, mais F121-E1 est inactive.', $withoutE1->reason);

        $customLevel = (new RuleEngine)->evaluate($input, new RuleConfiguration(negativeGapLevel: 'Urgente'));
        $this->assertSame('Urgente', $customLevel->level);
    }

    public function test_strong_drop_rule_can_be_deactivated_in_the_profile(): void
    {
        $input = new RuleInput(
            homeScore: 0,
            awayScore: 0,
            exactScoreOdds: ['0-0' => 7.5, '1-0' => 8.6, '0-1' => 9.8],
            vitalityScore: 61,
            oddsChangePercent: -20.0,
        );

        $result = (new RuleEngine)->evaluate($input, new RuleConfiguration(activeRules: ['F121-C', 'F121-C.2', 'F121-E1']));

        $this->assertFalse($result->shouldAlert);
        $this->assertSame('gap_too_high', last($result->steps)['step']);
    }

    public function test_f121_c_two_follows_the_leader_when_the_leader_is_not_the_smallest_gap(): void
    {
        $result = (new RuleEngine)->evaluate(
            new RuleInput(
                homeScore: 2,
                awayScore: 0,
                exactScoreOdds: ['2-0' => 3.0, '3-0' => 4.4, '2-1' => 3.5],
                vitalityScore: 61,
                oddsChangePercent: -6.0,
            ),
            new RuleConfiguration,
        );

        $this->assertSame('away', $result->rules['F121-C']->details['selectedTeam']);
        $this->assertSame('home', $result->rules['F121-C.2']->details['selectedTeam']);
        $this->assertTrue($result->shouldAlert);
        $this->assertSame('home', $result->selection);
    }

    public function test_small_positive_gap_up_to_the_threshold_is_a_high_alert(): void
    {
        $decide = fn (float $nextOdds): EngineResult => (new RuleEngine)->evaluate(
            new RuleInput(
                homeScore: 1,
                awayScore: 0,
                exactScoreOdds: ['1-0' => 3.0, '2-0' => $nextOdds, '1-1' => 9.0],
                vitalityScore: 61,
                oddsChangePercent: -2.0,
            ),
            new RuleConfiguration,
        );

        $this->assertSame('Haute', $decide(3.5)->level, 'Écart 0.50 inclus.');
        $this->assertFalse($decide(3.51)->shouldAlert, 'Écart 0.51 > 0.50 : F121-G.');
        $this->assertFalse($decide(3.0)->shouldAlert, 'Écart nul : abstention.');
        $this->assertSame('Haute', (new RuleEngine)->evaluate(
            new RuleInput(homeScore: 1, awayScore: 0, exactScoreOdds: ['1-0' => 3.0, '2-0' => 3.8, '1-1' => 9.0], vitalityScore: 61, oddsChangePercent: 0.0),
            new RuleConfiguration(abstentionGapThreshold: 1.0),
        )->level, 'Seuil de F121-G modifiable.');
    }

    public function test_f121_a_and_zero_zero_thresholds_are_kept_but_inactive(): void
    {
        $result = (new RuleEngine)->evaluate(
            new RuleInput(
                homeScore: 0,
                awayScore: 0,
                exactScoreOdds: ['0-0' => 2.4, '1-0' => 3.4, '0-1' => 4.0],
                vitalityScore: 61,
                oddsChangePercent: -1.0,
            ),
            new RuleConfiguration(maximumDirectionalGap: 1.5, zeroZeroGapThreshold: 1.0),
        );

        $this->assertSame(0.5, $result->filters['gap']->details['limit']);
        $this->assertFalse($result->shouldAlert, 'Écart 1.00 > 0.50 : F121-G, quels que soient F121-A et la règle 0-0.');
    }

    public function test_optional_minutes_remaining_rule_abstains_near_the_end_only_when_enabled(): void
    {
        $input = new RuleInput(
            homeScore: 0,
            awayScore: 0,
            exactScoreOdds: ['0-0' => 7.5, '1-0' => 6.5, '0-1' => 9.8],
            vitalityScore: 61,
            oddsChangePercent: -1.0,
            minute: 85,
        );
        $enabled = [...array_slice(RuleConfiguration::DEFAULT_PIPELINE, 0, 1), 'minutes_remaining', ...array_slice(RuleConfiguration::DEFAULT_PIPELINE, 1)];

        $this->assertTrue((new RuleEngine)->evaluate($input, new RuleConfiguration)->shouldAlert, 'Désactivée par défaut.');
        $late = (new RuleEngine)->evaluate($input, new RuleConfiguration(pipeline: $enabled));
        $this->assertFalse($late->shouldAlert);
        $this->assertStringContainsString('moins de 10 minutes', $late->reason);
        $this->assertTrue((new RuleEngine)->evaluate(
            new RuleInput(homeScore: 0, awayScore: 0, exactScoreOdds: ['0-0' => 7.5, '1-0' => 6.5, '0-1' => 9.8], vitalityScore: 61, oddsChangePercent: -1.0, minute: 80),
            new RuleConfiguration(pipeline: $enabled),
        )->shouldAlert, 'À la 80e, il reste exactement 10 minutes : pas d’abstention.');
    }

    public function test_f121_d_signals_when_both_upcoming_score_odds_are_at_most_eight(): void
    {
        $engine = new RuleEngine;
        $configuration = new RuleConfiguration;

        $candidate = $engine->evaluate(
            new RuleInput(homeScore: 2, awayScore: 3, exactScoreOdds: ['2-3' => 4.0, '3-3' => 5.2, '2-4' => 6.0]),
            $configuration,
        );
        $atThreshold = $engine->evaluate(
            new RuleInput(homeScore: 2, awayScore: 3, exactScoreOdds: ['2-3' => 4.0, '3-3' => 8.0, '2-4' => 6.0]),
            $configuration,
        );

        $this->assertSame(RuleVerdict::Candidate, $candidate->rules['F121-D']->verdict);
        $this->assertSame('Over 4.5 buts', $candidate->rules['F121-D']->suggestedAction);
        $this->assertTrue($candidate->shouldAlert, 'F121-D décide avant la vitalité et la tendance.');
        $this->assertSame('F121-D', $candidate->decisiveRule);
        $this->assertSame(RuleVerdict::Candidate, $atThreshold->rules['F121-D']->verdict);

        $aboveThreshold = $engine->evaluate(
            new RuleInput(homeScore: 2, awayScore: 3, exactScoreOdds: ['2-3' => 4.0, '3-3' => 8.01, '2-4' => 6.0]),
            $configuration,
        );
        $this->assertSame(RuleVerdict::NoSignal, $aboveThreshold->rules['F121-D']->verdict);
        $this->assertFalse($aboveThreshold->shouldAlert);
    }

    public function test_f121_d_needs_the_configured_minimum_number_of_goals(): void
    {
        $odds = ['1-2' => 4.0, '2-2' => 5.0, '1-3' => 6.0];
        $result = (new RuleEngine)->evaluate(
            new RuleInput(homeScore: 1, awayScore: 2, exactScoreOdds: $odds),
            new RuleConfiguration(activeRules: ['F121-D']),
        );

        $this->assertSame(RuleVerdict::NoSignal, $result->rules['F121-D']->verdict, '3 buts < 4.');
        $this->assertFalse($result->shouldAlert);

        $configured = (new RuleEngine)->evaluate(
            new RuleInput(homeScore: 1, awayScore: 2, exactScoreOdds: $odds),
            new RuleConfiguration(activeRules: ['F121-D'], openMatchMinimumGoals: 3),
        );
        $this->assertTrue($configured->shouldAlert);
    }

    public function test_undefined_and_ambiguous_rules_never_produce_a_candidate(): void
    {
        $undefinedRuleIds = ['F121-E', 'F121-K', 'F121-T', 'F121-X', 'F122', 'F124', 'F126'];
        $result = (new RuleEngine)->evaluate(
            new RuleInput(
                homeScore: 0,
                awayScore: 0,
                exactScoreOdds: ['0-0' => 7.5, '1-0' => 8.6, '0-1' => 9.8],
                vitalityScore: 61,
                oddsChangePercent: -1.0,
                methodScores: array_fill_keys($undefinedRuleIds, 100),
            ),
            new RuleConfiguration(
                activeRules: $undefinedRuleIds,
                methodWeights: array_fill_keys($undefinedRuleIds, 1.0),
            ),
        );

        foreach ($undefinedRuleIds as $ruleId) {
            $this->assertSame(RuleVerdict::NotDefined, $result->rules[$ruleId]->verdict);
        }
        $this->assertFalse($result->shouldAlert);
    }

    public function test_vitality_of_forty_or_less_abstains_before_the_trend(): void
    {
        $result = (new RuleEngine)->evaluate(
            new RuleInput(
                homeScore: 0,
                awayScore: 0,
                exactScoreOdds: ['0-0' => 7.5, '1-0' => 6.5, '0-1' => 9.8],
                vitalityScore: 40,
                oddsChangePercent: -20.0,
            ),
            new RuleConfiguration,
        );

        $this->assertFalse($result->filters['vitality']->passed);
        $this->assertTrue($result->filters['trend']->passed, 'Une tendance stable ou en baisse ne bloque plus.');
        $this->assertFalse($result->shouldAlert);
        $this->assertSame('vitality', last($result->steps)['step']);
    }

    public function test_rising_trend_abstains_and_the_threshold_is_configurable(): void
    {
        $result = (new RuleEngine)->evaluate(
            new RuleInput(
                homeScore: 0,
                awayScore: 0,
                exactScoreOdds: ['0-0' => 7.5, '1-0' => 8.6, '0-1' => 9.8],
                vitalityScore: 61,
                oddsChangePercent: 3.0,
                methodScores: ['F121-C' => 82],
            ),
            new RuleConfiguration(
                trendSource: 'cote_suggeree',
                stableOddsChangePercent: 3.0,
                methodWeights: ['F121-C' => 1.0],
            ),
        );

        $this->assertFalse($result->filters['trend']->passed);
        $this->assertSame('rising', $result->filters['trend']->details['trend']);

        $custom = (new RuleEngine)->evaluate(
            new RuleInput(homeScore: 0, awayScore: 0, exactScoreOdds: [], oddsChangePercent: -4.0),
            new RuleConfiguration(stableOddsChangePercent: 3.0),
        );
        $this->assertTrue($custom->filters['trend']->passed);
    }

    public function test_suggested_exact_score_key_follows_the_active_team_selection(): void
    {
        $engine = new RuleEngine;
        $input = new RuleInput(
            homeScore: 2,
            awayScore: 0,
            exactScoreOdds: ['2-0' => 3.0, '3-0' => 4.4, '2-1' => 3.5],
        );

        $this->assertSame(
            '3-0',
            $engine->suggestedExactScoreKey(
                $input,
                new RuleConfiguration(activeRules: ['F121-C.2', 'F121-C']),
            ),
        );
        $this->assertNull(
            $engine->suggestedExactScoreKey(
                $input,
                new RuleConfiguration(activeRules: ['F121-D']),
            ),
        );
    }

    public function test_missing_trend_configuration_blocks_both_falling_and_stable_values(): void
    {
        $engine = new RuleEngine;

        foreach ([
            new RuleConfiguration(trendSource: null, stableOddsChangePercent: null),
            new RuleConfiguration(stableOddsChangePercent: null),
            new RuleConfiguration(trendSource: null),
        ] as $configuration) {
            foreach ([-10.0, 0.0] as $change) {
                $result = $engine->evaluate(
                    new RuleInput(
                        homeScore: 0,
                        awayScore: 0,
                        exactScoreOdds: ['0-0' => 7.5, '1-0' => 8.6, '0-1' => 9.8],
                        vitalityScore: 61,
                        oddsChangePercent: $change,
                        methodScores: ['F121-C' => 90],
                    ),
                    $configuration,
                );

                $this->assertFalse($result->filters['trend']->passed);
                $this->assertFalse($result->shouldAlert);
            }
        }
    }

    public function test_convergence_equal_to_the_threshold_does_not_alert(): void
    {
        $result = (new RuleEngine)->evaluate(
            new RuleInput(
                homeScore: 0,
                awayScore: 0,
                exactScoreOdds: ['0-0' => 7.5, '1-0' => 8.6, '0-1' => 9.8],
                vitalityScore: 61,
                oddsChangePercent: -6.0,
                methodScores: ['F121-C' => 75],
            ),
            new RuleConfiguration(
                methodWeights: ['F121-C' => 1.0],
                pipeline: [...RuleConfiguration::DEFAULT_PIPELINE, 'convergence'],
            ),
        );

        $this->assertSame(75.0, $result->convergenceScore);
        $this->assertFalse($result->shouldAlert);
        $this->assertSame('Le score de convergence ne dépasse pas le seuil configuré.', $result->reason);
    }

    public function test_rule_engine_has_no_alert_without_configured_method_scores(): void
    {
        $result = (new RuleEngine)->evaluate(
            new RuleInput(
                homeScore: 0,
                awayScore: 0,
                exactScoreOdds: ['0-0' => 7.5, '1-0' => 8.6, '0-1' => 9.8],
                vitalityScore: 61,
                oddsChangePercent: -6.0,
            ),
            new RuleConfiguration(
                methodWeights: ['F121-C' => 1.0],
                pipeline: [...RuleConfiguration::DEFAULT_PIPELINE, 'convergence'],
            ),
        );

        $this->assertNull($result->convergenceScore);
        $this->assertFalse($result->shouldAlert);
        $this->assertSame('La convergence ne peut pas être calculée sans les scores et poids définis.', $result->reason);

        $withoutConvergenceStep = (new RuleEngine)->evaluate(
            new RuleInput(
                homeScore: 0,
                awayScore: 0,
                exactScoreOdds: ['0-0' => 7.5, '1-0' => 8.6, '0-1' => 9.8],
                vitalityScore: 61,
                oddsChangePercent: -6.0,
            ),
            new RuleConfiguration,
        );
        $this->assertTrue($withoutConvergenceStep->shouldAlert);
    }

    public function test_convergence_is_a_weighted_average_and_requires_all_weighted_scores(): void
    {
        $calculator = new ConvergenceCalculator;

        $this->assertEqualsWithDelta(
            78.6,
            $calculator->calculate(
                ['gap' => 82, 'vitality' => 68, 'trend' => 90],
                ['gap' => 0.6, 'vitality' => 0.3, 'trend' => 0.1],
            ),
            0.0001,
        );
        $this->assertNull($calculator->calculate(['gap' => 82], ['gap' => 0.6, 'vitality' => 0.4]));
    }

    public function test_convergence_rejects_scores_outside_the_documented_range(): void
    {
        $this->expectException(InvalidArgumentException::class);

        (new ConvergenceCalculator)->calculate(['gap' => 101], ['gap' => 1.0]);
    }
}
