<?php

namespace App\Services;

use App\Models\Setting;
use InvalidArgumentException;
use JsonException;

final class ScanSettings
{
    /**
     * @return array<string, int|float|bool|array|string|null>
     */
    public function all(): array
    {
        $values = [];
        foreach (Setting::query()->get() as $setting) {
            $values[$setting->key] = $this->cast($setting->value, $setting->type, $setting->key);
        }

        return $values;
    }

    /**
     * @param  array<string, int|float|bool|array|string|null>  $settings
     */
    public function integer(array $settings, string $key): int
    {
        $value = $settings[$key] ?? null;
        if (! is_int($value) || $value < 1) {
            throw new InvalidArgumentException("Le paramètre {$key} doit être un entier strictement positif.");
        }

        return $value;
    }

    /**
     * @param  array<string, int|float|bool|array|string|null>  $settings
     */
    public function nullableFloat(array $settings, string $key): ?float
    {
        $value = $settings[$key] ?? null;
        if ($value === null) {
            return null;
        }

        if ((! is_int($value) && ! is_float($value)) || ! is_finite((float) $value)) {
            throw new InvalidArgumentException("Le paramètre {$key} doit être un nombre fini ou rester à confirmer.");
        }

        return (float) $value;
    }

    /**
     * @param  array<string, int|float|bool|array|string|null>  $settings
     */
    public function nullableString(array $settings, string $key): ?string
    {
        $value = $settings[$key] ?? null;
        if ($value === null) {
            return null;
        }

        if (! is_string($value)) {
            throw new InvalidArgumentException("Le paramètre {$key} doit être une chaîne ou rester à confirmer.");
        }

        return $value;
    }

    /**
     * @param  array<string, int|float|bool|array|string|null>  $settings
     */
    public function decimal(array $settings, string $key): float
    {
        $value = $this->nullableFloat($settings, $key);
        if ($value === null) {
            throw new InvalidArgumentException("Le paramètre {$key} doit être renseigné.");
        }

        return $value;
    }

    private function cast(?string $value, string $type, string $key): int|float|bool|array|string|null
    {
        if ($value === null) {
            return null;
        }

        return match ($type) {
            'integer' => $this->castInteger($value, $key),
            'decimal' => $this->castDecimal($value, $key),
            'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE)
                ?? throw new InvalidArgumentException("La valeur du paramètre {$key} est un booléen invalide."),
            'json' => $this->castJson($value, $key),
            'string' => $value,
            default => throw new InvalidArgumentException("Le type du paramètre {$key} n’est pas reconnu."),
        };
    }

    private function castInteger(string $value, string $key): int
    {
        $integer = filter_var($value, FILTER_VALIDATE_INT);
        if ($integer === false) {
            throw new InvalidArgumentException("La valeur du paramètre {$key} n’est pas un entier.");
        }

        return $integer;
    }

    private function castDecimal(string $value, string $key): float
    {
        if (! is_numeric($value) || ! is_finite((float) $value)) {
            throw new InvalidArgumentException("La valeur du paramètre {$key} n’est pas un nombre fini.");
        }

        return (float) $value;
    }

    private function castJson(string $value, string $key): array
    {
        try {
            $decoded = json_decode($value, true, flags: JSON_THROW_ON_ERROR);
        } catch (JsonException $exception) {
            throw new InvalidArgumentException("Le JSON du paramètre {$key} est invalide.", previous: $exception);
        }

        if (! is_array($decoded)) {
            throw new InvalidArgumentException("Le JSON du paramètre {$key} doit être un objet ou un tableau.");
        }

        return $decoded;
    }
}
