<?php

namespace Tests\Unit;

use App\Rules\EngineResult;
use App\Rules\FilterResult;
use App\Rules\RuleConfiguration;
use App\Rules\RuleEngine;
use App\Rules\RuleInput;
use App\Rules\VitalityCalculator;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

/**
 * Les 10 situations de l’annexe Phase 1 (section 7), complétées par le complément 2 (statistiques et cotes à
 * T−2 min) et par la cote du score actuel de l’annexe 1. Vitalité et tendance sont recalculées à partir des données
 * brutes, avec l’ordre de décision par défaut du complément 2.
 */
class AnnexSituationsTest extends TestCase
{
    /**
     * @return array<string, array{array<string, mixed>, array<string, mixed>}>
     */
    public static function situations(): array
    {
        return [
            '1 Como – Man U, 45e, mi-temps' => [
                ['score' => [1, 0], 'odds' => [], 'halftime' => true, 'under25' => 1.36],
                ['alert' => true, 'rule' => 'F121-E2', 'level' => 'Mi-temps', 'action' => 'Over 0.5 buts en 2ème mi-temps'],
            ],
            '2 Real Madrid – Allemagne, 22e' => [
                ['score' => [0, 0], 'odds' => ['0-0' => 3.66, '1-0' => 3.00, '0-1' => 10.00], 'suggested' => [3.00, 3.10],
                    'stats' => [[4, 2, 2, 1, 55, 45, 3, 2]], 'vitality' => 50.0],
                ['alert' => true, 'rule' => 'F121-E1', 'level' => 'Critique', 'selection' => 'home'],
            ],
            '3 Grimsby – Cheltenham, 68e' => [
                ['score' => [1, 1], 'odds' => ['1-1' => 3.19, '2-1' => 3.10, '1-2' => 10.00], 'suggested' => [3.10, 3.10],
                    'stats' => [[6, 5, 3, 2, 52, 48, 5, 4]], 'vitality' => 70.0],
                ['alert' => true, 'rule' => 'F121-E1', 'level' => 'Critique', 'selection' => 'home'],
            ],
            '4 Vallecano – Villarreal, 62e' => [
                ['score' => [1, 0], 'odds' => ['1-0' => 3.19, '1-1' => 3.25, '2-0' => 7.50], 'suggested' => [3.25, 3.40],
                    'stats' => [[5, 8, 2, 4, 45, 55, 4, 6]], 'vitality' => 80.0],
                ['alert' => true, 'rule' => 'F121-C', 'level' => 'Haute', 'selection' => 'away'],
            ],
            '5 Arsenal – Everton, 27e' => [
                ['score' => [1, 0], 'odds' => ['1-0' => 5.32, '2-0' => 3.25, '1-1' => 8.50], 'suggested' => [3.25, 3.20],
                    'stats' => [[7, 3, 3, 1, 60, 40, 4, 2]], 'vitality' => 70.0],
                ['alert' => false, 'reason' => 'Domicile (2-0) : cote 3.25, écart −2.07, tendance +1.6 % → abstention (la cote monte)'],
            ],
            '6 Arsenal – Everton, 64e' => [
                ['score' => [1, 0], 'odds' => ['1-0' => 2.92, '2-0' => 3.10, '1-1' => 8.50], 'suggested' => [3.10, 3.75],
                    'stats' => [[12, 4, 6, 2, 65, 35, 7, 2]], 'vitality' => 100.0],
                ['alert' => true, 'rule' => 'F162-Bis', 'level' => 'Critique', 'selection' => 'home'],
            ],
            '7 Crewe – Wigan, 71e' => [
                ['score' => [1, 1], 'odds' => ['1-1' => 2.34, '1-2' => 3.20, '2-1' => 9.00], 'suggested' => [3.20, 3.15],
                    'stats' => [[4, 4, 1, 2, 48, 52, 3, 3]], 'vitality' => 60.0],
                ['alert' => false, 'reason' => 'Extérieur (1-2) : cote 3.20, écart +0.86, tendance +1.6 % → abstention (la cote monte)'],
            ],
            '8 Rennes – Racing, 51e' => [
                ['score' => [2, 0], 'odds' => ['2-0' => 4.50, '3-0' => 4.50, '2-1' => 5.50], 'suggested' => [4.50, 4.50],
                    'stats' => [[8, 4, 4, 2, 58, 42, 5, 2]], 'vitality' => 70.0],
                ['alert' => false, 'reason' => 'Domicile (3-0) : cote 4.50, écart 0.00, tendance 0 % → abstention (écart nul : aucune règle satisfaite)'],
            ],
            '9 Atalanta – Frosinone, 43e' => [
                ['score' => [2, 2], 'odds' => ['2-2' => 8.00, '3-2' => 6.00, '2-3' => 8.00], 'suggested' => [6.00, 6.50],
                    'stats' => [[10, 7, 5, 3, 55, 45, 6, 4]], 'vitality' => 90.0],
                ['alert' => true, 'rule' => 'F121-D', 'level' => 'Neutre', 'action' => 'Over 4.5 buts'],
            ],
            '10 Zagreb – NEC, 73e' => [
                ['score' => [2, 3], 'odds' => ['2-3' => 2.448, '3-3' => 3.25, '2-4' => 7.00], 'suggested' => [3.25, 3.40],
                    'stats' => [[12, 10, 6, 5, 50, 50, 8, 5]], 'vitality' => 90.0],
                ['alert' => true, 'rule' => 'F121-D', 'level' => 'Neutre', 'action' => 'Over 4.5 buts'],
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @param  array<string, mixed>  $expected
     */
    #[DataProvider('situations')]
    public function test_each_annex_situation_gives_the_expected_decision(array $data, array $expected): void
    {
        $vitality = null;
        if (isset($data['stats'])) {
            [$homeShots, $awayShots, $homeOnTarget, $awayOnTarget, $homePossession, $awayPossession, $homeCorners, $awayCorners] = $data['stats'][0];
            $vitality = (new VitalityCalculator)->calculate([
                'home' => ['shots' => $homeShots, 'shots_on_target' => $homeOnTarget, 'possession' => $homePossession, 'corners' => $homeCorners],
                'away' => ['shots' => $awayShots, 'shots_on_target' => $awayOnTarget, 'possession' => $awayPossession, 'corners' => $awayCorners],
            ])['score'];
            $this->assertSame($data['vitality'], $vitality, 'Vitalité du complément 2 (section 3).');
        }

        $trend = isset($data['suggested'])
            ? ($data['suggested'][0] - $data['suggested'][1]) / $data['suggested'][1] * 100
            : null;
        $engine = new RuleEngine;
        $input = new RuleInput(
            homeScore: $data['score'][0],
            awayScore: $data['score'][1],
            exactScoreOdds: $data['odds'],
            vitalityScore: $vitality,
            oddsChangePercent: $trend,
            halftime: $data['halftime'] ?? null,
            under25Odds: $data['under25'] ?? null,
        );
        $result = $engine->evaluate($input, new RuleConfiguration);

        $this->assertSame($expected['alert'], $result->shouldAlert, $result->reason);
        foreach (['rule' => 'decisiveRule', 'level' => 'level', 'selection' => 'selection', 'action' => 'suggestedAction'] as $key => $property) {
            if (array_key_exists($key, $expected)) {
                $this->assertSame($expected[$key], $result->{$property}, "{$key} : ".$result->reason);
            }
        }
        if (array_key_exists('reason', $expected)) {
            $this->assertStringContainsString($expected['reason'], $result->reason, 'La justification détaille les deux équipes.');
        }

        if (isset($data['suggested'])) {
            $suggestedKey = $engine->suggestedExactScoreKey($input, new RuleConfiguration);
            $this->assertSame($data['suggested'][0], $data['odds'][$suggestedKey], 'La cote suivie est celle du score suggéré (équipe désignée).');
        }
    }

    public function test_situation_6_strong_drop_overrides_the_positive_gap(): void
    {
        $result = $this->decide(1, 0, ['1-0' => 2.92, '2-0' => 3.10, '1-1' => 8.50], 100.0, (3.10 - 3.75) / 3.75 * 100);

        $this->assertEqualsWithDelta(0.18, $result->filters['gap']->details['selectedGap'], 0.0001);
        $this->assertSame('F162-Bis', $result->decisiveRule);
        $this->assertSame('strong_drop', $result->filters['trend']->details['trend']);
    }

    public function test_situation_7_rise_blocks_before_f121_g(): void
    {
        $result = $this->decide(1, 1, ['1-1' => 2.34, '1-2' => 3.20, '2-1' => 9.00], 60.0, (3.20 - 3.15) / 3.15 * 100);

        $this->assertFalse($result->shouldAlert);
        $this->assertSame('trend_rise', last($result->steps)['step']);
        $this->assertFalse($result->filters['gap']->passed, 'L’écart +0.86 > 0.50 serait aussi une abstention (F121-G).');
    }

    public function test_vitality_examples_atletico_dead_and_bayern_alive(): void
    {
        $calculator = new VitalityCalculator;
        $atletico = $calculator->calculate([
            'home' => ['shots' => 1, 'shots_on_target' => 0, 'possession' => 60, 'corners' => 2],
            'away' => ['shots' => 2, 'shots_on_target' => 1, 'possession' => 40, 'corners' => 1],
        ]);
        $bayern = $calculator->calculate([
            'home' => ['shots' => 12, 'shots_on_target' => 6, 'possession' => 55, 'corners' => 7],
            'away' => ['shots' => 8, 'shots_on_target' => 4, 'possession' => 45, 'corners' => 3],
        ]);

        $this->assertSame(40.0, $atletico['score']);
        $this->assertSame(90.0, $bayern['score']);
        $this->assertFalse($this->decide(0, 0, ['0-0' => 3.0, '1-0' => 3.1, '0-1' => 9.0], 40.0, -10.0)->shouldAlert, 'Vitalité ≤ 40 : abstention avant la tendance.');
        $this->assertNull($calculator->calculate([
            'home' => ['shots' => 12, 'shots_on_target' => null, 'possession' => 55, 'corners' => 7],
            'away' => ['shots' => 8, 'shots_on_target' => 4, 'possession' => 45, 'corners' => 3],
        ]));
    }

    public function test_trend_classification(): void
    {
        $this->assertSame('strong_drop', $this->trend(-6.25)->details['trend']);
        $this->assertSame('falling', $this->trend(-5.0)->details['trend'], 'Exactement −5 % : pas « plus de 5 % ».');
        $this->assertSame('stable', $this->trend(0.0)->details['trend']);
        $this->assertSame('rising', $this->trend(1.5)->details['trend']);
        $this->assertFalse($this->trend(1.5)->passed);
        $this->assertTrue($this->trend(-3.2)->passed);
    }

    public function test_only_the_halftime_signal_can_alert_during_halftime(): void
    {
        $engine = new RuleEngine;
        $openMatch = ['2-2' => 8.00, '3-2' => 6.00, '2-3' => 8.00];

        $this->assertFalse($engine->evaluate(
            new RuleInput(homeScore: 2, awayScore: 2, exactScoreOdds: $openMatch, halftime: true, under25Odds: 1.41),
            new RuleConfiguration,
        )->shouldAlert);
        $this->assertTrue($engine->evaluate(
            new RuleInput(homeScore: 0, awayScore: 0, exactScoreOdds: [], halftime: true, under25Odds: 1.15),
            new RuleConfiguration,
        )->shouldAlert);
    }

    private function decide(int $home, int $away, array $odds, float $vitality, float $trend): EngineResult
    {
        return (new RuleEngine)->evaluate(
            new RuleInput(homeScore: $home, awayScore: $away, exactScoreOdds: $odds, vitalityScore: $vitality, oddsChangePercent: $trend),
            new RuleConfiguration,
        );
    }

    private function trend(float $change): FilterResult
    {
        return (new RuleEngine)->evaluate(
            new RuleInput(homeScore: 0, awayScore: 0, exactScoreOdds: [], oddsChangePercent: $change),
            new RuleConfiguration,
        )->filters['trend'];
    }
}
