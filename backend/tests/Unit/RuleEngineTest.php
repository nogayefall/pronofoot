<?php

namespace Tests\Unit;

use App\Rules\ConvergenceCalculator;
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
        $falling = (new RuleEngine)->evaluate($input(-6.0), new RuleConfiguration);
        $stable = (new RuleEngine)->evaluate($input(-1.0), new RuleConfiguration);

        $this->assertSame('home', $falling->rules['F121-C']->details['selectedTeam']);
        $this->assertEqualsWithDelta(1.1, $falling->rules['F121-C']->details['selectedGap'], 0.0001);
        $this->assertTrue($falling->filters['gap']->passed);
        $this->assertTrue($falling->shouldAlert);
        $this->assertSame('Haute', $falling->level);
        $this->assertSame('home', $falling->selection);
        $this->assertFalse($stable->shouldAlert, 'Annexe : une tendance stable donne une abstention.');
    }

    public function test_negative_gap_is_a_critical_alert_through_f121_e1(): void
    {
        $input = new RuleInput(
            homeScore: 0,
            awayScore: 0,
            exactScoreOdds: ['0-0' => 7.5, '1-0' => 6.5, '0-1' => 9.8],
            vitalityScore: 61,
            oddsChangePercent: -6.0,
        );
        $result = (new RuleEngine)->evaluate($input, new RuleConfiguration);

        $this->assertSame(RuleVerdict::Candidate, $result->rules['F121-C']->verdict);
        $this->assertSame(-1.0, $result->rules['F121-C']->details['selectedGap']);
        $this->assertSame(RuleVerdict::Candidate, $result->rules['F121-E1']->verdict);
        $this->assertTrue($result->shouldAlert);
        $this->assertSame('F121-E1', $result->decisiveRule);
        $this->assertSame('Critique', $result->level);
        $this->assertSame('home', $result->selection);

        $withoutE1 = (new RuleEngine)->evaluate($input, new RuleConfiguration(activeRules: ['F121-C', 'F121-C.2']));
        $this->assertFalse($withoutE1->shouldAlert);
        $this->assertSame('Écart négatif, mais F121-E1 est inactive.', $withoutE1->reason);

        $customLevel = (new RuleEngine)->evaluate($input, new RuleConfiguration(negativeGapLevel: 'Urgente'));
        $this->assertSame('Urgente', $customLevel->level);
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
        $this->assertTrue($result->filters['gap']->passed);
        $this->assertTrue($result->shouldAlert);
    }

    public function test_gap_equal_to_the_configured_limit_does_not_pass(): void
    {
        $result = (new RuleEngine)->evaluate(
            new RuleInput(
                homeScore: 1,
                awayScore: 0,
                exactScoreOdds: ['1-0' => 5.0, '2-0' => 6.5, '1-1' => 7.0],
                vitalityScore: 61,
                oddsChangePercent: -1.0,
                methodScores: ['F121-C' => 82],
            ),
            new RuleConfiguration(methodWeights: ['F121-C' => 1.0]),
        );

        $this->assertFalse($result->filters['gap']->passed);
        $this->assertFalse($result->shouldAlert);
    }

    public function test_zero_zero_special_case_uses_its_own_strict_gap_limit(): void
    {
        $result = (new RuleEngine)->evaluate(
            new RuleInput(
                homeScore: 0,
                awayScore: 0,
                exactScoreOdds: ['0-0' => 2.4, '1-0' => 3.4, '0-1' => 4.0],
                vitalityScore: 61,
                oddsChangePercent: -1.0,
                methodScores: ['F121-C' => 82],
            ),
            new RuleConfiguration(methodWeights: ['F121-C' => 1.0]),
        );

        $this->assertFalse($result->filters['gap']->passed);
        $this->assertSame(1.0, $result->filters['gap']->details['limit']);
    }

    public function test_f121_d_signals_when_both_upcoming_score_odds_are_at_most_eight(): void
    {
        $engine = new RuleEngine;
        $configuration = new RuleConfiguration(
            trendSource: 'cote_suggeree',
            stableOddsChangePercent: 3.0,
            methodWeights: ['F121-D' => 1.0],
        );

        $candidate = $engine->evaluate(
            new RuleInput(
                homeScore: 2,
                awayScore: 3,
                exactScoreOdds: ['2-3' => 4.0, '3-3' => 5.2, '2-4' => 6.0],
                vitalityScore: 61,
                oddsChangePercent: -1.0,
                methodScores: ['F121-D' => 82],
            ),
            $configuration,
        );
        $atThreshold = $engine->evaluate(
            new RuleInput(
                homeScore: 2,
                awayScore: 3,
                exactScoreOdds: ['2-3' => 4.0, '3-3' => 8.0, '2-4' => 6.0],
                vitalityScore: 61,
                oddsChangePercent: -1.0,
                methodScores: ['F121-D' => 82],
            ),
            $configuration,
        );

        $this->assertSame(RuleVerdict::Candidate, $candidate->rules['F121-D']->verdict);
        $this->assertSame('Over 4.5 buts', $candidate->rules['F121-D']->suggestedAction);
        $this->assertTrue($candidate->shouldAlert);
        $this->assertSame('F121-D', $candidate->decisiveRule);
        $this->assertSame(RuleVerdict::Candidate, $atThreshold->rules['F121-D']->verdict);

        $aboveThreshold = $engine->evaluate(
            new RuleInput(homeScore: 2, awayScore: 3, exactScoreOdds: ['2-3' => 4.0, '3-3' => 8.01, '2-4' => 6.0]),
            $configuration,
        );
        $this->assertSame(RuleVerdict::NoSignal, $aboveThreshold->rules['F121-D']->verdict);
        $this->assertFalse($aboveThreshold->shouldAlert);
    }

    public function test_f121_d_only_applies_to_the_configured_open_match_scores(): void
    {
        $result = (new RuleEngine)->evaluate(
            new RuleInput(
                homeScore: 3,
                awayScore: 3,
                exactScoreOdds: ['3-3' => 4.0, '4-3' => 5.0, '3-4' => 6.0],
                vitalityScore: 61,
                oddsChangePercent: -1.0,
                methodScores: ['F121-D' => 82],
            ),
            new RuleConfiguration(
                trendSource: 'cote_suggeree',
                stableOddsChangePercent: 3.0,
                activeRules: ['F121-D'],
                methodWeights: ['F121-D' => 1.0],
            ),
        );

        $this->assertSame(RuleVerdict::NoSignal, $result->rules['F121-D']->verdict);
        $this->assertFalse($result->shouldAlert);

        $configured = (new RuleEngine)->evaluate(
            new RuleInput(homeScore: 3, awayScore: 3, exactScoreOdds: ['3-3' => 4.0, '4-3' => 5.0, '3-4' => 6.0]),
            new RuleConfiguration(activeRules: ['F121-D'], openMatchScores: ['3-3']),
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

    public function test_vitality_below_forty_and_stable_trend_without_a_confirmed_tolerance_block_alerts(): void
    {
        $result = (new RuleEngine)->evaluate(
            new RuleInput(
                homeScore: 0,
                awayScore: 0,
                exactScoreOdds: ['0-0' => 7.5, '1-0' => 8.6, '0-1' => 9.8],
                vitalityScore: 39,
                oddsChangePercent: 0.0,
                methodScores: ['F121-C' => 82],
            ),
            new RuleConfiguration(methodWeights: ['F121-C' => 1.0]),
        );

        $this->assertFalse($result->filters['vitality']->passed);
        $this->assertFalse($result->filters['trend']->passed);
        $this->assertFalse($result->shouldAlert);
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
