<?php

namespace App\Services;

use App\Models\RuleProfile;
use App\Rules\RuleConfiguration;
use InvalidArgumentException;

/**
 * Construit la configuration du moteur à partir d’un profil de règles (module 3.6) et des paramètres enregistrés.
 * Utilisée à l’identique par le scan et par « Tester la combinaison ».
 */
final class RuleConfigurationFactory
{
    public function __construct(private readonly ScanSettings $settings) {}

    /**
     * @param  array<string, int|float|bool|array|string|null>|null  $settings  Paramètres déjà chargés (sinon lus en base).
     */
    public function make(RuleProfile $profile, ?array $settings = null): RuleConfiguration
    {
        $settings ??= $this->settings->all();
        $profileSettings = $profile->settings ?? [];
        $activeRules = $profileSettings['active_rules'] ?? RuleConfiguration::DEFINED_RULES;
        $methodWeights = $profileSettings['method_weights'] ?? [];

        if (! is_array($activeRules) || ! is_array($methodWeights)) {
            throw new InvalidArgumentException('Le profil contient une liste de règles ou des poids invalides.');
        }

        return new RuleConfiguration(
            activeRules: array_values($activeRules),
            maximumDirectionalGap: $this->settings->decimal($settings, 'rules.maximum_directional_gap'),
            zeroZeroOddsWaitThreshold: $this->settings->decimal($settings, 'rules.zero_zero_odds_wait_threshold'),
            zeroZeroGapThreshold: $this->settings->decimal($settings, 'rules.zero_zero_gap_threshold'),
            upcomingScoreOddsLimit: $this->settings->decimal($settings, 'rules.upcoming_score_odds_limit'),
            minimumVitality: $this->settings->decimal($settings, 'rules.minimum_vitality'),
            trendSource: $this->settings->nullableString($settings, 'tendance_source'),
            stableOddsChangePercent: $this->settings->nullableFloat($settings, 'tendance_seuil_stable'),
            minimumConvergenceScore: $this->validationThreshold($profile, $settings),
            methodWeights: $methodWeights,
            openMatchScores: $this->stringList($settings, 'rules.open_match_scores', ['2-2', '2-3', '3-2']),
            halftimeUnderMinimum: $this->settings->decimal($settings, 'rules.halftime_under25_min'),
            halftimeUnderMaximum: $this->settings->decimal($settings, 'rules.halftime_under25_max'),
            negativeGapLevel: $this->settings->nullableString($settings, 'alerts.level_negative_gap') ?? 'Critique',
            positiveGapLevel: $this->settings->nullableString($settings, 'alerts.level_positive_gap') ?? 'Haute',
            pipeline: $this->pipeline($settings),
        );
    }

    /**
     * Seuil de validation du profil (« Score de confiance > X % »), sinon le seuil global du PRD/TRD.
     *
     * @param  array<string, int|float|bool|array|string|null>  $settings
     */
    public function validationThreshold(RuleProfile $profile, array $settings): float
    {
        $profileThreshold = $profile->settings['validation_threshold'] ?? null;

        return is_numeric($profileThreshold)
            ? (float) $profileThreshold
            : $this->settings->decimal($settings, 'rules.minimum_convergence_score');
    }

    /**
     * L’étape « convergence » est ajoutée en fin d’ordre de décision seulement si le paramètre l’active.
     *
     * @param  array<string, int|float|bool|array|string|null>  $settings
     * @return list<string>
     */
    public function pipeline(array $settings): array
    {
        $pipeline = array_values(array_filter(
            $this->stringList($settings, 'rules.decision_pipeline', RuleConfiguration::DEFAULT_PIPELINE),
            fn (string $step): bool => $step !== 'convergence',
        ));

        if (($settings['rules.convergence_enabled'] ?? false) === true) {
            $pipeline[] = 'convergence';
        }

        return $pipeline;
    }

    /**
     * @param  array<string, int|float|bool|array|string|null>  $settings
     * @param  list<string>  $default
     * @return list<string>
     */
    private function stringList(array $settings, string $key, array $default): array
    {
        $value = $settings[$key] ?? null;
        if (! is_array($value)) {
            return $default;
        }

        return array_values(array_map('strval', $value));
    }
}
