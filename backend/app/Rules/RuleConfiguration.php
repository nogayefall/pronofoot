<?php

namespace App\Rules;

use InvalidArgumentException;

final readonly class RuleConfiguration
{
    /**
     * Ordre de décision lu dans les exemples du client (à confirmer). « convergence » est une étape facultative.
     */
    public const DEFAULT_PIPELINE = ['F121-E2', 'F121-D', 'designation', 'vitality', 'trend', 'gap'];

    public const PIPELINE_STEPS = ['F121-E2', 'F121-D', 'designation', 'vitality', 'trend', 'gap', 'convergence'];

    public const DEFINED_RULES = ['F121-E2', 'F121-D', 'F121-C', 'F121-C.2', 'F121-E1'];

    /**
     * @param  list<string>  $activeRules
     * @param  array<string, int|float>  $methodWeights
     * @param  list<string>  $openMatchScores
     * @param  list<string>  $pipeline
     */
    public function __construct(
        public array $activeRules = self::DEFINED_RULES,
        public float $maximumDirectionalGap = 1.5,
        public float $zeroZeroOddsWaitThreshold = 2.5,
        public float $zeroZeroGapThreshold = 1.0,
        public float $upcomingScoreOddsLimit = 8.0,
        public float $minimumVitality = 41.0,
        public ?string $trendSource = 'cote_suggeree',
        public ?float $stableOddsChangePercent = 5.0,
        public float $minimumConvergenceScore = 75.0,
        public array $methodWeights = [],
        public array $openMatchScores = ['2-2', '2-3', '3-2'],
        public float $halftimeUnderMinimum = 1.15,
        public float $halftimeUnderMaximum = 1.40,
        public string $negativeGapLevel = 'Critique',
        public string $positiveGapLevel = 'Haute',
        public array $pipeline = self::DEFAULT_PIPELINE,
    ) {
        foreach ([
            'maximumDirectionalGap' => $maximumDirectionalGap,
            'zeroZeroOddsWaitThreshold' => $zeroZeroOddsWaitThreshold,
            'zeroZeroGapThreshold' => $zeroZeroGapThreshold,
            'upcomingScoreOddsLimit' => $upcomingScoreOddsLimit,
            'minimumVitality' => $minimumVitality,
            'minimumConvergenceScore' => $minimumConvergenceScore,
            'halftimeUnderMinimum' => $halftimeUnderMinimum,
            'halftimeUnderMaximum' => $halftimeUnderMaximum,
        ] as $name => $value) {
            if (! is_finite($value) || $value < 0) {
                throw new InvalidArgumentException("Le paramètre {$name} doit être un nombre positif ou nul.");
            }
        }

        if ($minimumVitality > 100 || $minimumConvergenceScore > 100) {
            throw new InvalidArgumentException('La vitalité et la convergence ne peuvent pas dépasser 100.');
        }

        if ($halftimeUnderMinimum > $halftimeUnderMaximum) {
            throw new InvalidArgumentException('La borne basse Under 2.5 doit être inférieure ou égale à la borne haute.');
        }

        if ($stableOddsChangePercent !== null
            && (! is_finite($stableOddsChangePercent) || $stableOddsChangePercent < 0)) {
            throw new InvalidArgumentException('Le seuil de tendance doit être un nombre positif ou nul.');
        }

        foreach ($activeRules as $ruleId) {
            if (! is_string($ruleId) || $ruleId === '') {
                throw new InvalidArgumentException('Chaque identifiant de règle active doit être une chaîne non vide.');
            }
        }

        foreach ($openMatchScores as $score) {
            if (! is_string($score) || preg_match('/^\d{1,2}-\d{1,2}$/', $score) !== 1) {
                throw new InvalidArgumentException('Chaque score de match ouvert doit avoir la forme « 2-3 ».');
            }
        }

        if ($pipeline === [] || count($pipeline) !== count(array_unique($pipeline))) {
            throw new InvalidArgumentException('L’ordre de décision doit contenir des étapes distinctes.');
        }

        foreach ($pipeline as $step) {
            if (! in_array($step, self::PIPELINE_STEPS, true)) {
                throw new InvalidArgumentException("Étape de décision inconnue : {$step}.");
            }
        }

        if (trim($negativeGapLevel) === '' || trim($positiveGapLevel) === '') {
            throw new InvalidArgumentException('Les niveaux d’alerte doivent être renseignés.');
        }
    }

    public function isActive(string $ruleId): bool
    {
        return in_array($ruleId, $this->activeRules, true);
    }
}
