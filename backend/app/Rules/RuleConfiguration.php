<?php

namespace App\Rules;

use InvalidArgumentException;

final readonly class RuleConfiguration
{
    /**
     * Ordre de décision du complément 2 de l’annexe (modifiable dans les paramètres) :
     * E2 à la mi-temps, F121-D, vitalité, forte baisse (F162-Bis), hausse, écart négatif (F121-E1),
     * écart trop grand (F121-G), petit écart (alerte haute), sinon abstention.
     */
    public const DEFAULT_PIPELINE = [
        'F121-E2',
        'F121-D',
        'vitality',
        'trend_drop',
        'trend_rise',
        'gap_negative',
        'gap_too_high',
        'gap_small',
    ];

    /**
     * Étapes facultatives : « minutes_remaining » (désactivée par défaut) et « convergence » (désactivée par défaut).
     */
    public const PIPELINE_STEPS = [
        'F121-E2',
        'minutes_remaining',
        'F121-D',
        'F121-X',
        'vitality',
        'trend_drop',
        'trend_rise',
        'gap_negative',
        'gap_too_high',
        'gap_small',
        'convergence',
    ];

    public const DEFINED_RULES = ['F121-E2', 'F121-D', 'F121-C', 'F121-C.2', 'F162-Bis', 'F121-E1'];

    /**
     * Durée réglementaire utilisée par la règle facultative des minutes restantes.
     */
    public const REGULATION_MINUTES = 90;

    /**
     * @param  list<string>  $activeRules
     * @param  array<string, int|float>  $methodWeights
     * @param  list<string>  $pipeline
     * @param  float  $maximumDirectionalGap  F121-A (1.50) : paramètre conservé mais inactif dans l’ordre du complément 2.
     * @param  float  $stableOddsChangePercent  Seuil de forte baisse de la tendance (5 %).
     * @param  float  $crossGapMaximum  F121-X (à confirmer) : écart croisé |écart domicile − écart extérieur| maximal.
     * @param  bool  $followLeader  F121-C.2 (à confirmer) : si une équipe mène de 2 buts ou plus, seule elle est évaluée.
     * @param  bool  $halftimeSignalDecides  F121-E2 décide à la mi-temps. Faux quand le scan Plancher de la pause (scan E2,
     *                                       annexe « Quoi coder v2 ») est actif : le signal d’origine est journalisé sans décider.
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
        public int $openMatchMinimumGoals = 4,
        public float $halftimeUnderMinimum = 1.15,
        public float $halftimeUnderMaximum = 1.40,
        public string $negativeGapLevel = 'Critique',
        public string $positiveGapLevel = 'Haute',
        public array $pipeline = self::DEFAULT_PIPELINE,
        public float $abstentionGapThreshold = 0.50,
        public int $minimumMinutesRemaining = 10,
        public float $crossGapMaximum = 1.0,
        public bool $followLeader = false,
        public bool $halftimeSignalDecides = true,
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
            'abstentionGapThreshold' => $abstentionGapThreshold,
            'crossGapMaximum' => $crossGapMaximum,
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

        if ($openMatchMinimumGoals < 0 || $minimumMinutesRemaining < 0) {
            throw new InvalidArgumentException('Le nombre de buts et de minutes doit être positif ou nul.');
        }

        foreach ($activeRules as $ruleId) {
            if (! is_string($ruleId) || $ruleId === '') {
                throw new InvalidArgumentException('Chaque identifiant de règle active doit être une chaîne non vide.');
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
