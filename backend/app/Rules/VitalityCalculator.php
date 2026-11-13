<?php

namespace App\Rules;

use InvalidArgumentException;

/**
 * Indice de vitalité F166/F167 selon l’annexe Phase 1 corrigée : statistiques des deux équipes additionnées,
 * possession de l’équipe la plus haute, bornes incluses. Une statistique manquante rend l’indice non calculable.
 */
final class VitalityCalculator
{
    /**
     * Barème par défaut de l’annexe : paliers [minimum inclus, points], du plus haut au plus bas.
     */
    public const DEFAULT_SCALE = [
        'shots' => [[15, 30], [8, 20], [3, 10]],
        'shots_on_target' => [[6, 30], [3, 20], [1, 10]],
        'possession' => [[60, 20], [50, 10]],
        'corners' => [[8, 20], [4, 10]],
    ];

    /**
     * @param  array<string, mixed>  $statistics  Clés home et away, chacune avec shots, shots_on_target, corners et possession.
     * @param  array<string, list<array{0: int|float, 1: int|float}>>  $scale
     * @return array{score: float, points: array<string, int|float>, values: array<string, int|float>}|null
     */
    public function calculate(array $statistics, array $scale = self::DEFAULT_SCALE): ?array
    {
        $this->assertValidScale($scale);
        $home = is_array($statistics['home'] ?? null) ? $statistics['home'] : null;
        $away = is_array($statistics['away'] ?? null) ? $statistics['away'] : null;
        if ($home === null || $away === null) {
            return null;
        }

        $values = [];
        foreach (array_keys(self::DEFAULT_SCALE) as $key) {
            $homeValue = $home[$key] ?? null;
            $awayValue = $away[$key] ?? null;
            if (! $this->isValidNumber($homeValue) || ! $this->isValidNumber($awayValue)) {
                return null;
            }

            $values[$key] = $key === 'possession'
                ? max((float) $homeValue, (float) $awayValue)
                : (float) $homeValue + (float) $awayValue;
        }

        $points = [];
        foreach ($values as $key => $value) {
            $points[$key] = 0;
            foreach ($scale[$key] as [$minimum, $awarded]) {
                if ($value >= $minimum) {
                    $points[$key] = $awarded;

                    break;
                }
            }
        }

        return [
            'score' => (float) array_sum($points),
            'points' => $points,
            'values' => $values,
        ];
    }

    /**
     * @param  array<string, mixed>  $scale
     */
    public function assertValidScale(array $scale): void
    {
        foreach (array_keys(self::DEFAULT_SCALE) as $key) {
            if (! is_array($scale[$key] ?? null) || $scale[$key] === []) {
                throw new InvalidArgumentException("Le barème de vitalité doit définir des paliers pour {$key}.");
            }

            $previousMinimum = INF;
            foreach ($scale[$key] as $tier) {
                if (! is_array($tier) || count($tier) !== 2
                    || ! $this->isValidNumber($tier[0] ?? null) || ! $this->isValidNumber($tier[1] ?? null)
                    || (float) $tier[0] >= $previousMinimum) {
                    throw new InvalidArgumentException("Les paliers de vitalité de {$key} doivent être des couples [minimum, points] décroissants.");
                }

                $previousMinimum = (float) $tier[0];
            }
        }
    }

    private function isValidNumber(mixed $value): bool
    {
        return (is_int($value) || is_float($value)) && is_finite((float) $value) && $value >= 0;
    }
}
