<?php

namespace App\Rules;

/**
 * Mode Plancher (annexe client « Quoi coder v2 », 23 novembre 2026) : classe pure, traduction de plancher(), proposer()
 * et scan_du_moment(). Le mode Complet (festival, fourchette) n’est pas codé.
 *
 *  - Liste : scores exacts atteignables (h >= buts domicile et a >= buts extérieur), score actuel compris, de cote <= 8.00
 *    (8.00 inclus). Cotes absentes ou verrouillées (<= 1.001) ignorées.
 *  - total_max = plus grand total de la liste ; plancher = total_max − buts actuels ; plancher < 1 : aucun pari.
 *  - Pari central = Over (total_max − 0.5) ; pari prudent = Over (total_max − 1.5), seulement si plancher >= 2. Lignes
 *    sur le total du match (buts déjà marqués inclus).
 *  - Ligne déjà acquise (buts >= ligne), déjà posée (doublon) ou sans cote : non proposée. Cote < 1.25 : « valeur faible »,
 *    sans bloquer.
 *  - Trois scans par match, jamais à chaque but : départ (1re mi-temps, minute 3 à 11), pause (mi-temps), soixante
 *    (2e mi-temps, minute 60 à 65).
 */
final class GoalFloor
{
    public const SCANS = ['depart', 'pause', 'soixante'];

    public const SCAN_LABELS = ['depart' => 'départ', 'pause' => 'pause', 'soixante' => 'soixante'];

    public const LOCKED_ODDS = 1.001;

    public function __construct(
        public readonly float $scoreOddsLimit = 8.00,
        public readonly float $lowValueOdds = 1.25,
    ) {}

    /**
     * plancher() du document : null si aucun score de la liste, ou si le plancher est inférieur à 1.
     *
     * @param  array<string, int|float|string|null>  $exactScoreOdds  Cotes de score exact (« 1-2 » => 6.5).
     * @return array{goals: int, list: list<array{score: string, odds: float}>, totalMax: int, floor: int, bets: list<array{type: string, line: float}>}|null
     */
    public function floor(int $homeScore, int $awayScore, array $exactScoreOdds): ?array
    {
        $summary = $this->summary($homeScore, $awayScore, $exactScoreOdds);

        return $summary === null || $summary['floor'] < 1 ? null : $summary;
    }

    /**
     * Liste <= 8.00, total_max et plancher, même quand le plancher est inférieur à 1 (pour le Journal). Null si la liste
     * est vide.
     *
     * @param  array<string, int|float|string|null>  $exactScoreOdds
     * @return array{goals: int, list: list<array{score: string, odds: float}>, totalMax: int, floor: int, bets: list<array{type: string, line: float}>}|null
     */
    public function summary(int $homeScore, int $awayScore, array $exactScoreOdds): ?array
    {
        $goals = $homeScore + $awayScore;
        $list = [];
        foreach ($exactScoreOdds as $score => $odds) {
            if (! preg_match('/^(\d{1,2})-(\d{1,2})$/', (string) $score, $parts)) {
                continue;
            }

            $price = $this->price($odds);
            if ($price === null || $price > $this->scoreOddsLimit) {
                continue;
            }

            [$home, $away] = [(int) $parts[1], (int) $parts[2]];
            if ($home >= $homeScore && $away >= $awayScore) {
                $list[] = ['score' => "{$home}-{$away}", 'odds' => $price, 'home' => $home, 'away' => $away];
            }
        }

        if ($list === []) {
            return null;
        }

        // Tri comme sorted() en Python sur les clés (h, a).
        usort($list, fn (array $left, array $right): int => [$left['home'], $left['away']] <=> [$right['home'], $right['away']]);
        $totalMax = max(array_map(fn (array $item): int => $item['home'] + $item['away'], $list));
        $floor = $totalMax - $goals;
        $bets = [];
        if ($floor >= 1) {
            $bets[] = ['type' => 'central', 'line' => $totalMax - 0.5];
            if ($floor >= 2) {
                $bets[] = ['type' => 'prudent', 'line' => $totalMax - 1.5];
            }
        }

        return [
            'goals' => $goals,
            'list' => array_map(fn (array $item): array => ['score' => $item['score'], 'odds' => $item['odds']], $list),
            'totalMax' => $totalMax,
            'floor' => $floor,
            'bets' => $bets,
        ];
    }

    /**
     * proposer() du document : paris à afficher, sans ligne acquise, déjà posée ou sans cote. Les paris écartés sont
     * gardés avec leur raison, pour le Journal.
     *
     * @param  array<string, int|float|string|null>  $exactScoreOdds
     * @param  array<string, int|float|string|null>  $overLineOdds  Cotes Over du total du match par ligne (« 3.5 » => 2.064).
     * @param  list<float>  $alreadyPosted  Lignes Over déjà posées pour ce match.
     * @return array{goals: int, list: list<array{score: string, odds: float}>, totalMax: int, floor: int, bets: list<array{type: string, line: float}>, proposals: list<array{type: string, line: float, bet: string, odds: float, lowValue: bool}>, skipped: list<array{type: string, line: float, bet: string, reason: string}>}|null
     */
    public function propose(int $homeScore, int $awayScore, array $exactScoreOdds, array $overLineOdds, array $alreadyPosted): ?array
    {
        $floor = $this->floor($homeScore, $awayScore, $exactScoreOdds);
        if ($floor === null) {
            return null;
        }

        $proposals = [];
        $skipped = [];
        foreach ($floor['bets'] as $bet) {
            $line = $bet['line'];
            $label = 'Over '.self::line($line);
            $reason = match (true) {
                $line <= $floor['goals'] => 'ligne déjà acquise',
                $this->posted($line, $alreadyPosted) => 'ligne déjà posée',
                default => null,
            };
            $odds = $reason === null ? $this->price($overLineOdds[self::line($line)] ?? null) : null;
            if ($reason === null && $odds === null) {
                $reason = 'cote absente ou verrouillée';
            }

            if ($reason !== null) {
                $skipped[] = ['type' => $bet['type'], 'line' => $line, 'bet' => $label, 'reason' => $reason];

                continue;
            }

            $proposals[] = ['type' => $bet['type'], 'line' => $line, 'bet' => $label, 'odds' => $odds, 'lowValue' => $odds < $this->lowValueOdds];
        }

        return [...$floor, 'proposals' => $proposals, 'skipped' => $skipped];
    }

    /**
     * scan_du_moment() du document : « depart », « pause » ou « soixante » si un scan est dû, sinon null.
     *
     * @param  string|null  $phase  « 1H » (1re mi-temps), « HT » (mi-temps) ou « 2H » (2e mi-temps).
     * @param  list<string>  $done  Scans déjà faits pour ce match.
     * @param  array{depart?: array{0: int, 1: int}, soixante?: array{0: int, 1: int}}  $windows  Minutes incluses.
     * @param  list<string>  $enabled  Scans activés.
     */
    public static function scanMoment(?string $phase, ?int $minute, array $done, array $windows = [], array $enabled = self::SCANS): ?string
    {
        [$departFrom, $departTo] = $windows['depart'] ?? [3, 11];
        [$sixtyFrom, $sixtyTo] = $windows['soixante'] ?? [60, 65];
        $due = fn (string $scan): bool => in_array($scan, $enabled, true) && ! in_array($scan, $done, true);

        return match (true) {
            $phase === '1H' && $minute !== null && $minute >= $departFrom && $minute <= $departTo && $due('depart') => 'depart',
            $phase === 'HT' && $due('pause') => 'pause',
            $phase === '2H' && $minute !== null && $minute >= $sixtyFrom && $minute <= $sixtyTo && $due('soixante') => 'soixante',
            default => null,
        };
    }

    /**
     * Clé d’une ligne Over/Under : « 3.5 ».
     */
    public static function line(float $line): string
    {
        return number_format($line, 1, '.', '');
    }

    /**
     * @param  list<float>  $alreadyPosted
     */
    private function posted(float $line, array $alreadyPosted): bool
    {
        foreach ($alreadyPosted as $posted) {
            if (abs($posted - $line) < 0.001) {
                return true;
            }
        }

        return false;
    }

    private function price(mixed $odds): ?float
    {
        return is_numeric($odds) && is_finite((float) $odds) && (float) $odds > self::LOCKED_ODDS ? (float) $odds : null;
    }
}
