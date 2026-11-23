<?php

namespace Tests\Unit;

use App\Rules\GoalFloor;
use PHPUnit\Framework\TestCase;

/**
 * Mode Plancher : les 6 matchs réels de l’annexe « Quoi coder v2 » (sortie exacte du code du document). Les cotes des
 * scores de la liste et des paris viennent du document quand il les donne ; les autres cotes (scores hors liste, au-dessus
 * de 8.00 ou déjà dépassés) sont des valeurs d’illustration.
 */
class GoalFloorTest extends TestCase
{
    private const GETAFE = [
        '0-2' => 4.25, '0-3' => 3.75, '1-2' => 7.0, '1-3' => 7.0, '0-4' => 7.0,
        '2-2' => 13.0, '1-4' => 15.0, '0-5' => 17.0, '2-3' => 21.0,
        // Scores déjà dépassés (non atteignables) : jamais dans la liste, même sous 8.00.
        '0-0' => 6.0, '0-1' => 5.0, '1-1' => 6.5,
    ];

    private const CHICAGO = [
        '0-0' => 4.5, '1-0' => 5.0, '1-1' => 6.0, '2-0' => 7.5, '0-1' => 7.0,
        '0-2' => 11.0, '2-1' => 9.0, '1-2' => 13.0, '3-0' => 15.0,
    ];

    public function test_getafe_atletico_at_halftime_0_2(): void
    {
        $result = $this->propose(0, 2, self::GETAFE, ['2.5' => 1.225, '3.5' => 2.064, '4.5' => 4.2]);

        $this->assertSame(['0-2', '0-3', '0-4', '1-2', '1-3'], array_column($result['list'], 'score'));
        $this->assertSame(4, $result['totalMax']);
        $this->assertSame(2, $result['floor']);
        $this->assertSame([
            ['type' => 'central', 'line' => 3.5, 'bet' => 'Over 3.5', 'odds' => 2.064, 'lowValue' => false],
            ['type' => 'prudent', 'line' => 2.5, 'bet' => 'Over 2.5', 'odds' => 1.225, 'lowValue' => true],
        ], $result['proposals']);
    }

    public function test_getafe_with_line_3_5_already_posted_only_proposes_over_2_5(): void
    {
        $result = $this->propose(0, 2, self::GETAFE, ['2.5' => 1.225, '3.5' => 2.064], [3.5]);

        $this->assertSame(['Over 2.5'], array_column($result['proposals'], 'bet'));
        $this->assertSame([['type' => 'central', 'line' => 3.5, 'bet' => 'Over 3.5', 'reason' => 'ligne déjà posée']], $result['skipped']);
    }

    public function test_atalanta_inter_at_halftime_1_2(): void
    {
        $odds = ['1-2' => 5.5, '2-2' => 6.0, '1-3' => 6.5, '2-3' => 7.5, '1-4' => 8.0, '3-2' => 9.0, '2-4' => 13.0, '3-3' => 17.0, '1-5' => 15.0, '0-2' => 3.0];
        $result = $this->propose(1, 2, $odds, ['3.5' => 1.14, '4.5' => 1.69]);

        $this->assertSame(['1-2', '1-3', '1-4', '2-2', '2-3'], array_column($result['list'], 'score'), '1-4 à 8.00 inclus.');
        $this->assertSame([5, 2], [$result['totalMax'], $result['floor']]);
        $this->assertSame([['Over 4.5', 1.69, false], ['Over 3.5', 1.14, true]], $this->bets($result));
    }

    public function test_marseille_le_mans_at_halftime_2_0(): void
    {
        $odds = ['2-0' => 3.2, '3-0' => 5.0, '2-1' => 5.5, '3-1' => 7.5, '4-0' => 9.5, '2-2' => 12.0, '4-1' => 13.0, '3-2' => 21.0, '1-0' => 2.5];
        $result = $this->propose(2, 0, $odds, ['2.5' => 1.17, '3.5' => 1.864]);

        $this->assertSame(['2-0', '2-1', '3-0', '3-1'], array_column($result['list'], 'score'));
        $this->assertSame([4, 2], [$result['totalMax'], $result['floor']]);
        $this->assertSame([['Over 3.5', 1.864, false], ['Over 2.5', 1.17, true]], $this->bets($result));
    }

    public function test_chicago_charlotte_at_halftime_0_0(): void
    {
        $result = $this->propose(0, 0, self::CHICAGO, ['0.5' => 1.10, '1.5' => 1.48]);

        $this->assertSame(['0-0', '0-1', '1-0', '1-1', '2-0'], array_column($result['list'], 'score'));
        $this->assertSame([2, 2], [$result['totalMax'], $result['floor']]);
        $this->assertSame([['Over 1.5', 1.48, false], ['Over 0.5', 1.10, true]], $this->bets($result));
    }

    public function test_chicago_at_2_1_has_no_reachable_score_in_the_list_and_no_bet(): void
    {
        $this->assertNull((new GoalFloor)->propose(2, 1, self::CHICAGO, ['0.5' => 1.10, '1.5' => 1.48, '3.5' => 1.9], []));
        $this->assertNull((new GoalFloor)->floor(2, 1, self::CHICAGO));
    }

    public function test_anderlecht_ohl_at_halftime_0_0(): void
    {
        $odds = ['0-0' => 5.5, '1-0' => 4.0, '1-1' => 6.5, '2-0' => 6.5, '0-1' => 8.0, '2-1' => 11.0, '0-2' => 17.0, '3-0' => 13.0];
        $result = $this->propose(0, 0, $odds, ['0.5' => 1.155, '1.5' => 1.84]);

        $this->assertSame(['0-0', '0-1', '1-0', '1-1', '2-0'], array_column($result['list'], 'score'));
        $this->assertSame([2, 2], [$result['totalMax'], $result['floor']]);
        $this->assertSame([['Over 1.5', 1.84, false], ['Over 0.5', 1.155, true]], $this->bets($result));
    }

    public function test_paris_fc_angers_at_minute_11_0_0(): void
    {
        $odds = ['0-0' => 7.0, '1-0' => 6.0, '2-0' => 6.0, '3-0' => 8.0, '0-1' => 8.5, '1-1' => 9.0, '2-1' => 10.0, '4-0' => 12.0];
        $result = $this->propose(0, 0, $odds, ['1.5' => 1.225, '2.5' => 1.768]);

        $this->assertSame(['0-0', '1-0', '2-0', '3-0'], array_column($result['list'], 'score'));
        $this->assertSame([3, 3], [$result['totalMax'], $result['floor']]);
        $this->assertSame([['Over 2.5', 1.768, false], ['Over 1.5', 1.225, true]], $this->bets($result));
    }

    public function test_floor_of_one_gives_only_the_central_bet_and_floor_below_one_gives_nothing(): void
    {
        $one = $this->propose(1, 1, ['1-1' => 3.0, '2-1' => 4.0, '1-2' => 9.0], ['2.5' => 1.8, '1.5' => 1.05]);
        $this->assertSame(1, $one['floor']);
        $this->assertSame(['Over 2.5'], array_column($one['proposals'], 'bet'), 'Plancher 1 : pas de prudent (déjà acquis).');

        $this->assertNull((new GoalFloor)->propose(1, 1, ['1-1' => 2.0, '2-1' => 9.0, '1-2' => 9.0], ['1.5' => 1.0], []), 'Seul le score actuel dans la liste : plancher 0.');
        $this->assertSame(0, (new GoalFloor)->summary(1, 1, ['1-1' => 2.0, '2-1' => 9.0])['floor'], 'Le résumé garde la liste pour le Journal.');
    }

    public function test_locked_or_missing_odds_are_ignored(): void
    {
        // 0-4 verrouillée (1.001) : hors liste ; Over 2.5 absente : pari prudent écarté.
        $result = $this->propose(0, 2, [...self::GETAFE, '0-4' => 1.001], ['3.5' => 2.064, '2.5' => 1.001]);

        $this->assertSame(['0-2', '0-3', '1-2', '1-3'], array_column($result['list'], 'score'));
        $this->assertSame([4, 2], [$result['totalMax'], $result['floor']]);
        $this->assertSame(['Over 3.5'], array_column($result['proposals'], 'bet'));
        $this->assertSame('cote absente ou verrouillée', $result['skipped'][0]['reason']);
    }

    public function test_an_acquired_line_is_never_proposed(): void
    {
        // Déjà posé par une alerte neutre : Over 1.5 ; le central reste.
        $result = $this->propose(0, 0, self::CHICAGO, ['0.5' => 1.10, '1.5' => 1.48], [1.5, 0.5]);
        $this->assertSame([], $result['proposals']);
        $this->assertSame(['ligne déjà posée', 'ligne déjà posée'], array_column($result['skipped'], 'reason'));
    }

    public function test_scan_moment_follows_the_three_windows_and_never_repeats_a_scan(): void
    {
        $this->assertNull(GoalFloor::scanMoment('1H', 2, []));
        $this->assertSame('depart', GoalFloor::scanMoment('1H', 3, []));
        $this->assertSame('depart', GoalFloor::scanMoment('1H', 11, []));
        $this->assertNull(GoalFloor::scanMoment('1H', 12, []));
        $this->assertNull(GoalFloor::scanMoment('1H', 5, ['depart']), 'Jamais deux fois le même scan.');
        $this->assertSame('pause', GoalFloor::scanMoment('HT', 45, ['depart']));
        $this->assertNull(GoalFloor::scanMoment('HT', 45, ['pause']));
        $this->assertNull(GoalFloor::scanMoment('2H', 59, []));
        $this->assertSame('soixante', GoalFloor::scanMoment('2H', 60, []));
        $this->assertSame('soixante', GoalFloor::scanMoment('2H', 65, ['depart', 'pause']));
        $this->assertNull(GoalFloor::scanMoment('2H', 66, []));
        $this->assertNull(GoalFloor::scanMoment('ET', 95, []));
        // Fenêtres modifiables et scans activables séparément.
        $this->assertSame('depart', GoalFloor::scanMoment('1H', 14, [], ['depart' => [10, 15]]));
        $this->assertNull(GoalFloor::scanMoment('HT', 45, [], [], ['depart', 'soixante']));
    }

    /**
     * @param  array<string, float>  $exact
     * @param  array<string, float>  $over
     * @param  list<float>  $posted
     * @return array<string, mixed>
     */
    private function propose(int $home, int $away, array $exact, array $over, array $posted = []): array
    {
        $result = (new GoalFloor)->propose($home, $away, $exact, $over, $posted);
        $this->assertNotNull($result);

        return $result;
    }

    /**
     * @param  array<string, mixed>  $result
     * @return list<array{0: string, 1: float, 2: bool}>
     */
    private function bets(array $result): array
    {
        return array_map(fn (array $proposal): array => [$proposal['bet'], $proposal['odds'], $proposal['lowValue']], $result['proposals']);
    }
}
