<?php

namespace Tests\Unit;

use App\Services\BetSettler;
use Carbon\CarbonImmutable;
use PHPUnit\Framework\TestCase;

/**
 * Règles de résultat automatique des options d’une alerte.
 */
class BetSettlerTest extends TestCase
{
    private const OPTIONS = [
        ['type' => 'targeted', 'side' => 'home'],
        ['type' => 'neutral'],
        ['type' => 'over45'],
        ['type' => 'halftime_over05'],
    ];

    public function test_targeted_option_is_won_when_the_designated_team_scores_next_and_lost_otherwise(): void
    {
        $this->assertSame(['won', 'won'], $this->outcomes([[2, 0, 70]], [1, 0], 2));
        $this->assertSame(['lost', 'won'], $this->outcomes([[1, 1, 70], [2, 1, 80]], [1, 0], 2), 'L’autre équipe marque d’abord.');
        $this->assertSame(['lost', 'lost'], $this->outcomes([[1, 0, 75], [1, 0, 90]], [1, 0], 2), 'Aucun but avant la fin du match.');
    }

    public function test_an_own_goal_counts_for_the_team_whose_score_increases(): void
    {
        // But contre son camp d’un joueur de l’équipe à l’extérieur : le score de l’équipe à domicile augmente.
        $this->assertSame(['won'], $this->outcomes([[2, 0, 66]], [1, 0], 1));
        $away = (new BetSettler)->settle([['type' => 'targeted', 'side' => 'away']], ['home' => 1, 'away' => 0], $this->timeline([[2, 0, 66]]), false, true);
        $this->assertSame(['lost'], $away['outcomes']);
    }

    public function test_two_goals_between_readings_by_the_same_team_or_both_teams(): void
    {
        $this->assertSame(['won', 'won'], $this->outcomes([[3, 0, 70]], [1, 0], 2), 'Deux buts de la même équipe : l’ordre est sans importance.');

        $ambiguous = (new BetSettler)->settle(self::OPTIONS, ['home' => 1, 'away' => 0], $this->timeline([[2, 1, 70]]), false, true);
        $this->assertNull($ambiguous['outcomes'][0], 'Les deux équipes marquent entre deux relevés : ordre inconnu.');
        $this->assertTrue($ambiguous['needsEvents']);
        $this->assertSame('won', $ambiguous['outcomes'][1], 'L’option neutre ne dépend pas de l’ordre.');

        $resolved = (new BetSettler)->settle(self::OPTIONS, ['home' => 1, 'away' => 0], $this->timeline([[2, 1, 70]]), false, true, goalOrder: ['away', 'home']);
        $this->assertSame('lost', $resolved['outcomes'][0], 'Événements : l’équipe à l’extérieur a marqué en premier.');
        $this->assertFalse($resolved['needsEvents']);
    }

    public function test_no_goal_loses_targeted_neutral_and_overs(): void
    {
        $result = (new BetSettler)->settle(self::OPTIONS, ['home' => 0, 'away' => 0], $this->timeline([[0, 0, 60], [0, 0, 90]]), false, true);

        $this->assertSame(['lost', 'lost', 'lost', 'lost'], $result['outcomes']);
    }

    public function test_over_four_point_five_needs_five_goals_in_the_final_score(): void
    {
        $settle = fn (array $timeline): string => (new BetSettler)->settle([['type' => 'over45']], ['home' => 2, 'away' => 2], $this->timeline($timeline), false, true)['outcomes'][0];

        $this->assertSame('won', $settle([[3, 2, 80]]));
        $this->assertSame('lost', $settle([[2, 2, 90]]));
    }

    public function test_second_half_over_zero_point_five_ignores_extra_time(): void
    {
        $settle = fn (array $timeline): string => (new BetSettler)->settle([['type' => 'halftime_over05']], ['home' => 0, 'away' => 0], $this->timeline($timeline), false, true)['outcomes'][0];

        $this->assertSame('won', $settle([[0, 1, 63]]));
        $this->assertSame('lost', $settle([[0, 0, 90], [1, 0, 105]]), 'But en prolongation : hors 2e mi-temps.');
    }

    public function test_extra_time_counts_by_default_and_can_be_excluded(): void
    {
        $timeline = $this->timeline([[1, 1, 90], [2, 1, 108]]);
        $counted = (new BetSettler)->settle([['type' => 'targeted', 'side' => 'home'], ['type' => 'neutral']], ['home' => 1, 'away' => 1], $timeline, false, true);
        $excluded = (new BetSettler)->settle([['type' => 'targeted', 'side' => 'home'], ['type' => 'neutral']], ['home' => 1, 'away' => 1], $timeline, false, false);

        $this->assertSame(['won', 'won'], $counted['outcomes']);
        $this->assertSame(['lost', 'lost'], $excluded['outcomes'], 'Prolongation non comptée : aucun but dans le temps réglementaire.');
    }

    public function test_a_stopped_abandoned_or_cancelled_match_cancels_every_option(): void
    {
        $result = (new BetSettler)->settle(self::OPTIONS, ['home' => 1, 'away' => 0], $this->timeline([[2, 0, 70]]), true, true);

        $this->assertSame(['cancelled', 'cancelled', 'cancelled', 'cancelled'], $result['outcomes']);
    }

    public function test_validity_limited_to_the_alert_duration_ignores_later_goals(): void
    {
        $start = CarbonImmutable::parse('2026-11-22 20:00:00');
        $timeline = [['home' => 1, 'away' => 0, 'minute' => 70, 'at' => $start->addMinutes(10)], ['home' => 2, 'away' => 0, 'minute' => 85, 'at' => $start->addMinutes(25)]];
        $options = [['type' => 'targeted', 'side' => 'home'], ['type' => 'neutral']];

        $this->assertSame(['won', 'won'], (new BetSettler)->settle($options, ['home' => 1, 'away' => 0], $timeline, false, true)['outcomes'], 'Fin du match (par défaut).');
        $this->assertSame(['lost', 'lost'], (new BetSettler)->settle($options, ['home' => 1, 'away' => 0], $timeline, false, true, $start->addMinutes(15))['outcomes'], 'Durée de l’alerte (15 min) : but trop tardif.');
    }

    /**
     * @param  list<array{0: int, 1: int, 2: int}>  $scores
     * @param  array{0: int, 1: int}  $base
     * @return list<string|null>
     */
    private function outcomes(array $scores, array $base, int $count): array
    {
        $result = (new BetSettler)->settle(array_slice(self::OPTIONS, 0, $count), ['home' => $base[0], 'away' => $base[1]], $this->timeline($scores), false, true);

        return $result['outcomes'];
    }

    /**
     * @param  list<array{0: int, 1: int, 2: int|null}>  $scores
     * @return list<array{home: int, away: int, minute: int|null, at: CarbonImmutable}>
     */
    private function timeline(array $scores): array
    {
        $start = CarbonImmutable::parse('2026-11-22 20:00:00');

        return array_map(fn (array $score, int $index): array => [
            'home' => $score[0],
            'away' => $score[1],
            'minute' => $score[2],
            'at' => $start->addMinutes($index + 1),
        ], $scores, array_keys($scores));
    }

    public function test_neftchi_al_hilal_over_four_point_five_is_lost_when_the_fourth_goal_is_cancelled(): void
    {
        // Alerte à 2-2 (4 buts, 59e), but annulé (1-2, 3 buts), puis 2-2 au final : 4 buts, Over 4.5 perdu.
        $timeline = [[2, 2, 59], [1, 2, 59], [1, 2, 60], [2, 2, 75], [2, 2, 90]];
        $settle = fn (array $timeline, ?string $line): string => (new BetSettler)->settle([['type' => 'neutral', 'line' => $line]], ['home' => 2, 'away' => 2], $this->timeline($timeline), false, true)['outcomes'][0];

        $this->assertSame('lost', $settle($timeline, 'Over 4.5'));
        $this->assertSame('lost', $settle($timeline, null), 'Sans ligne enregistrée : buts au moment de l’alerte + 0.5.');
        $this->assertSame('won', $settle([...$timeline, [3, 2, 90]], 'Over 4.5'), 'Cinquième but : gagnée.');
    }

    public function test_a_goal_cancelled_after_the_alert_never_wins_the_targeted_or_neutral_option(): void
    {
        // Al-Nassr – Al Sadd : alerte à 2-1 (76e), 3-1 annulé, final 2-1.
        $this->assertSame(['lost', 'lost'], $this->outcomes([[3, 1, 90], [2, 1, 90], [2, 1, 90]], [2, 1], 2));
        // But annulé, puis l’autre équipe marque : c’est elle qui a marqué le prochain but.
        $this->assertSame(['lost', 'won'], $this->outcomes([[3, 1, 80], [2, 1, 81], [2, 2, 88]], [2, 1], 2));
        // But annulé, puis la même équipe marque vraiment.
        $this->assertSame(['won', 'won'], $this->outcomes([[3, 1, 80], [2, 1, 81], [3, 1, 88]], [2, 1], 2));
        // Seul le dernier but est annulé : le premier reste le prochain but.
        $this->assertSame(['won', 'won'], $this->outcomes([[3, 1, 80], [4, 1, 82], [3, 1, 83]], [2, 1], 2));
        // But donné à la mauvaise équipe puis corrigé.
        $this->assertSame(['lost', 'won'], $this->outcomes([[3, 1, 80], [2, 2, 81]], [2, 1], 2));
    }

    public function test_a_goal_scored_before_the_alert_and_cancelled_after_is_removed_from_the_base(): void
    {
        $result = (new BetSettler)->settle([['type' => 'targeted', 'side' => 'home'], ['type' => 'neutral', 'line' => 'Over 4.5']], ['home' => 2, 'away' => 2], $this->timeline([[1, 2, 59], [2, 2, 75]]), false, true);

        $this->assertSame([null, 'lost'], $result['outcomes'], 'But annulé puis nouveau but, ou erreur passagère du flux : les événements départagent.');
        $this->assertTrue($result['needsEvents']);
        $this->assertSame(3, $result['minimumBaseGoals']);

        $cancelled = (new BetSettler)->settle([['type' => 'targeted', 'side' => 'home']], ['home' => 2, 'away' => 2], $this->timeline([[1, 2, 59], [2, 2, 75]]), false, true, goalOrder: ['home']);
        $this->assertSame(['won'], $cancelled['outcomes'], 'Événements : un vrai but du domicile après l’alerte.');
        $glitch = (new BetSettler)->settle([['type' => 'targeted', 'side' => 'home']], ['home' => 2, 'away' => 2], $this->timeline([[1, 2, 59], [2, 2, 75]]), false, true, goalOrder: []);
        $this->assertSame(['lost'], $glitch['outcomes'], 'Événements : aucun but après l’alerte, erreur du flux.');
    }

    public function test_chicago_charlotte_a_passing_feed_error_is_settled_by_the_match_events(): void
    {
        // Alerte à 1-1 (77e), 0-1 affiché par erreur à la 90e, score final 1-2 : Charlotte a marqué le prochain but.
        $settle = fn (?array $goalOrder): array => (new BetSettler)->settle([['type' => 'targeted', 'side' => 'home'], ['type' => 'neutral', 'line' => 'Over 2.5']], ['home' => 1, 'away' => 1], $this->timeline([[1, 1, 90], [0, 1, 90], [1, 2, 90]]), false, true, goalOrder: $goalOrder);

        $this->assertNull($settle(null)['outcomes'][0]);
        $this->assertTrue($settle(null)['needsEvents']);
        $this->assertSame(['lost', 'won'], $settle(['away'])['outcomes']);
    }

    public function test_a_cancelled_second_half_goal_does_not_win_over_zero_point_five(): void
    {
        $this->assertSame(['lost'], (new BetSettler)->settle([['type' => 'halftime_over05']], ['home' => 0, 'away' => 0], $this->timeline([[1, 0, 60], [0, 0, 61], [0, 0, 90]]), false, true)['outcomes']);
        $this->assertSame([null], (new BetSettler)->settle([['type' => 'halftime_over05']], ['home' => 0, 'away' => 1], $this->timeline([[0, 0, 60], [0, 1, 61], [0, 1, 90]]), false, true)['outcomes'], 'Doute : en attente.');
    }

    public function test_readings_during_the_penalty_shootout_never_add_a_goal(): void
    {
        // Pendant les tirs au but (statut P), le score relevé reste celui de la fin de la prolongation.
        $result = (new BetSettler)->settle(self::OPTIONS, ['home' => 2, 'away' => 2], $this->timeline([[2, 2, 120], [2, 2, 120], [2, 2, 120]]), false, true);
        $this->assertSame(['lost', 'lost', 'lost', 'lost'], $result['outcomes']);
        $this->assertFalse($result['needsEvents']);

        // But en prolongation puis tirs au but : seul le but de la 112e compte.
        $extraTime = (new BetSettler)->settle(self::OPTIONS, ['home' => 2, 'away' => 2], $this->timeline([[2, 3, 112], [2, 3, 120], [2, 3, 120]]), false, true);
        $this->assertSame(['lost', 'won', 'won', 'lost'], $extraTime['outcomes']);
    }
}
