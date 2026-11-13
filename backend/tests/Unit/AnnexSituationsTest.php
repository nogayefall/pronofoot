<?php

namespace Tests\Unit;

use App\Rules\FilterResult;
use App\Rules\RuleConfiguration;
use App\Rules\RuleEngine;
use App\Rules\RuleInput;
use App\Rules\VitalityCalculator;
use PHPUnit\Framework\TestCase;

/**
 * Situations et exemples de l’annexe Phase 1 corrigée (docs/PRONOFOOT_Annexe_Phase1_Corrigee.pdf).
 * Aucune donnée absente de l’annexe n’est inventée : les situations incomplètes attendent le fichier Excel du client.
 */
class AnnexSituationsTest extends TestCase
{
    private const PENDING_EXCEL = 'En attente du fichier Excel du client : ';

    public function test_situation_1_como_man_u_halftime_signal(): void
    {
        $result = (new RuleEngine)->evaluate(
            new RuleInput(homeScore: 1, awayScore: 0, exactScoreOdds: [], halftime: true, under25Odds: 1.36),
            new RuleConfiguration,
        );

        $this->assertTrue($result->shouldAlert);
        $this->assertSame('F121-E2', $result->decisiveRule);
        $this->assertSame('Mi-temps', $result->level);
        $this->assertSame('Over 0.5 buts en 2ème mi-temps', $result->suggestedAction);
    }

    /**
     * L’annexe ne donne ni vitalité ni cote à −2 min : seules les étapes dont elle fournit les données sont évaluées.
     */
    public function test_situation_2_real_madrid_negative_gap_is_critical_for_real(): void
    {
        $result = (new RuleEngine)->evaluate(
            new RuleInput(homeScore: 0, awayScore: 0, exactScoreOdds: ['0-0' => 3.66, '1-0' => 3.00, '0-1' => 10.00]),
            new RuleConfiguration(pipeline: ['F121-E2', 'F121-D', 'designation', 'gap']),
        );

        $this->assertTrue($result->shouldAlert);
        $this->assertSame('F121-E1', $result->decisiveRule);
        $this->assertSame('Critique', $result->level);
        $this->assertSame('home', $result->selection);
        $this->assertEqualsWithDelta(-0.66, $result->filters['gap']->details['selectedGap'], 0.0001);
    }

    /**
     * L’annexe ne donne ni vitalité ni cote à −2 min : seules les étapes dont elle fournit les données sont évaluées.
     */
    public function test_situation_3_grimsby_negative_gap_is_critical_for_grimsby(): void
    {
        $result = (new RuleEngine)->evaluate(
            new RuleInput(homeScore: 1, awayScore: 1, exactScoreOdds: ['1-1' => 3.19, '2-1' => 3.10, '1-2' => 10.00]),
            new RuleConfiguration(pipeline: ['F121-E2', 'F121-D', 'designation', 'gap']),
        );

        $this->assertTrue($result->shouldAlert);
        $this->assertSame('F121-E1', $result->decisiveRule);
        $this->assertSame('Critique', $result->level);
        $this->assertSame('home', $result->selection);
        $this->assertEqualsWithDelta(-0.09, $result->filters['gap']->details['selectedGap'], 0.0001);
    }

    public function test_situations_2_and_3_need_vitality_and_trend_in_the_full_pipeline(): void
    {
        $this->markTestIncomplete(self::PENDING_EXCEL.'situations 2 et 3, vitalité et cote du score suggéré à −2 min absentes de l’annexe.');
    }

    public function test_situation_4_vallecano_villarreal(): void
    {
        $this->markTestIncomplete(self::PENDING_EXCEL.'vitalité et cote à −2 min absentes (Alerte Haute attendue).');
    }

    public function test_situation_5_arsenal_everton_stable(): void
    {
        $this->markTestIncomplete(self::PENDING_EXCEL.'vitalité absente et cote à −2 min non chiffrée (abstention « cote stable » attendue).');
    }

    public function test_situation_6_arsenal_everton_falling(): void
    {
        $this->markTestIncomplete(self::PENDING_EXCEL.'vitalité absente. Incohérence : écart 3.10 − 2.92 = +0.18 positif, alors que l’annexe attend une Alerte Critique.');
    }

    public function test_situation_7_crewe_wigan(): void
    {
        $this->markTestIncomplete(self::PENDING_EXCEL.'vitalité et tendance absentes. Incohérence : écart +0.86 < 1.50 donne une Alerte Haute selon l’étape 6, l’annexe attend une abstention.');
    }

    public function test_situation_8_rennes_racing(): void
    {
        $this->markTestIncomplete(self::PENDING_EXCEL.'vitalité et tendance absentes (abstention « écart neutre 0.00 » attendue).');
    }

    public function test_situation_9_atalanta_frosinone_open_match(): void
    {
        $result = (new RuleEngine)->evaluate(
            new RuleInput(homeScore: 2, awayScore: 2, exactScoreOdds: ['2-2' => 8.00, '3-2' => 6.00, '2-3' => 8.00]),
            new RuleConfiguration,
        );

        $this->assertTrue($result->shouldAlert);
        $this->assertSame('F121-D', $result->decisiveRule);
        $this->assertSame('Neutre', $result->level);
        $this->assertSame('Over 4.5 buts', $result->suggestedAction);
    }

    public function test_situation_10_zagreb_nec_open_match(): void
    {
        $result = (new RuleEngine)->evaluate(
            new RuleInput(homeScore: 2, awayScore: 3, exactScoreOdds: ['2-3' => 2.448, '3-3' => 3.25, '2-4' => 7.00]),
            new RuleConfiguration,
        );

        $this->assertTrue($result->shouldAlert);
        $this->assertSame('F121-D', $result->decisiveRule);
        $this->assertSame('Over 4.5 buts', $result->suggestedAction);
    }

    public function test_vitality_example_atletico_osasuna_is_dead(): void
    {
        $vitality = (new VitalityCalculator)->calculate([
            'home' => ['shots' => 1, 'shots_on_target' => 0, 'possession' => 60, 'corners' => 2],
            'away' => ['shots' => 2, 'shots_on_target' => 1, 'possession' => 40, 'corners' => 1],
        ]);

        $this->assertSame(40.0, $vitality['score']);
        $this->assertSame(['shots' => 10, 'shots_on_target' => 10, 'possession' => 20, 'corners' => 0], $vitality['points']);
        $this->assertFalse($this->vitalityPasses($vitality['score']));
    }

    public function test_vitality_example_bayern_dortmund_is_alive(): void
    {
        $vitality = (new VitalityCalculator)->calculate([
            'home' => ['shots' => 12, 'shots_on_target' => 6, 'possession' => 55, 'corners' => 7],
            'away' => ['shots' => 8, 'shots_on_target' => 4, 'possession' => 45, 'corners' => 3],
        ]);

        $this->assertSame(90.0, $vitality['score']);
        $this->assertTrue($this->vitalityPasses($vitality['score']));
    }

    public function test_vitality_bounds_are_inclusive_and_missing_statistics_are_not_zero(): void
    {
        $calculator = new VitalityCalculator;
        $bounds = $calculator->calculate([
            'home' => ['shots' => 3, 'shots_on_target' => 1, 'possession' => 50, 'corners' => 4],
            'away' => ['shots' => 0, 'shots_on_target' => 0, 'possession' => 50, 'corners' => 0],
        ]);
        $this->assertSame(40.0, $bounds['score']);

        $this->assertNull($calculator->calculate([
            'home' => ['shots' => 12, 'shots_on_target' => null, 'possession' => 55, 'corners' => 7],
            'away' => ['shots' => 8, 'shots_on_target' => 4, 'possession' => 45, 'corners' => 3],
        ]));
        $this->assertNull($calculator->calculate(['shots' => 8, 'shots_on_target' => 4, 'possession' => 56, 'corners' => 3]));
    }

    public function test_trend_examples_from_the_annex(): void
    {
        $this->assertSame('falling', $this->trend(-6.25)->details['trend']);
        $this->assertTrue($this->trend(-6.25)->passed);
        $this->assertFalse($this->trend((3.25 - 3.20) / 3.20 * 100)->passed);
        $this->assertSame('rising', $this->trend(1.5)->details['trend']);
        $this->assertFalse($this->trend(-4.99)->passed);
        $this->assertSame('threshold', $this->trend(-5.0)->details['trend']);
        $this->assertFalse($this->trend(-5.0)->passed);
    }

    public function test_only_the_halftime_signal_can_alert_during_halftime(): void
    {
        $engine = new RuleEngine;
        $openMatch = ['2-2' => 8.00, '3-2' => 6.00, '2-3' => 8.00];

        $outOfRange = $engine->evaluate(
            new RuleInput(homeScore: 2, awayScore: 2, exactScoreOdds: $openMatch, halftime: true, under25Odds: 1.41),
            new RuleConfiguration,
        );
        $this->assertFalse($outOfRange->shouldAlert);

        $lowerBound = $engine->evaluate(
            new RuleInput(homeScore: 0, awayScore: 0, exactScoreOdds: [], halftime: true, under25Odds: 1.15),
            new RuleConfiguration,
        );
        $this->assertTrue($lowerBound->shouldAlert);
    }

    private function vitalityPasses(float $score): bool
    {
        return (new RuleEngine)->evaluate(
            new RuleInput(homeScore: 0, awayScore: 0, exactScoreOdds: [], vitalityScore: $score),
            new RuleConfiguration,
        )->filters['vitality']->passed;
    }

    private function trend(float $change): FilterResult
    {
        return (new RuleEngine)->evaluate(
            new RuleInput(homeScore: 0, awayScore: 0, exactScoreOdds: [], oddsChangePercent: $change),
            new RuleConfiguration,
        )->filters['trend'];
    }
}
