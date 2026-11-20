<?php

namespace App\Rules;

use InvalidArgumentException;

final readonly class RuleInput
{
    /**
     * Complément 4 : premier relevé après un but (règle d’écart, une seule fois).
     */
    public const POST_GOAL_FIRST_READING = 'first_reading';

    /**
     * Complément 4 : relevés suivants dans la fenêtre après un but (seule une forte baisse depuis la première cote).
     */
    public const POST_GOAL_WINDOW = 'window';

    /**
     * @param  string|null  $postGoalPhase  Phase après un but : premier relevé, fenêtre, ou null hors fenêtre.
     * @param  float|null  $postGoalChangePercent  Variation depuis la première cote relevée après le dernier but.
     * @param  array<string, int|float>  $exactScoreOdds
     * @param  array<string, int|float>  $methodScores
     * @param  bool|null  $halftime  Match arrêté à la mi-temps.
     * @param  float|null  $under25Odds  Cote Under 2.5 buts (total du match), utilisée par F121-E2.
     * @param  int|null  $minute  Minute de jeu, utilisée par la règle facultative des minutes restantes.
     * @param  array{home?: float|null, away?: float|null}|null  $sideOddsChangePercent  Tendance de la cote du prochain
     *                                                                                   but de chaque équipe. Sans elle, $oddsChangePercent vaut pour l’équipe à l’écart le plus faible.
     * @param  array{home?: array{phase: string|null, change: float|null}, away?: array{phase: string|null, change: float|null}}|null  $sidePostGoal
     *                                                                                                                                                Phase et variation après un but, par équipe (complément 4).
     * @param  array<string, float>  $overLineOdds  Cotes Over du total de buts par ligne (« 1.5 » => 1.85), si le marché est disponible.
     * @param  bool  $vitalityUnavailable  Match suivi sans statistiques : la vitalité n’existe pas et son filtre n’est pas appliqué (à confirmer).
     */
    public function __construct(
        public int $homeScore,
        public int $awayScore,
        public array $exactScoreOdds,
        public ?float $vitalityScore = null,
        public ?float $oddsChangePercent = null,
        public array $methodScores = [],
        public ?bool $halftime = null,
        public ?float $under25Odds = null,
        public ?int $minute = null,
        public ?string $postGoalPhase = null,
        public ?float $postGoalChangePercent = null,
        public ?array $sideOddsChangePercent = null,
        public ?array $sidePostGoal = null,
        public array $overLineOdds = [],
        public bool $vitalityUnavailable = false,
    ) {
        $phases = [$postGoalPhase, $sidePostGoal['home']['phase'] ?? null, $sidePostGoal['away']['phase'] ?? null];
        foreach ($phases as $phase) {
            if ($phase !== null && ! in_array($phase, [self::POST_GOAL_FIRST_READING, self::POST_GOAL_WINDOW], true)) {
                throw new InvalidArgumentException('Phase après un but inconnue.');
            }
        }

        if ($homeScore < 0 || $awayScore < 0) {
            throw new InvalidArgumentException('Les scores du match doivent être positifs ou nuls.');
        }
    }
}
