<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\SettingChange;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;
use JsonException;

final class SettingsController extends Controller
{
    private const DEFAULTS = [
        'scan.odds_interval_seconds' => '30',
        'scan.statistics_interval_seconds' => '60',
        'scan.goal_interval_seconds' => '15',
        'scan.goal_window_seconds' => '120',
        'alerts.expiration_minutes' => '15',
        'rules.maximum_directional_gap' => '1.50',
        'rules.zero_zero_odds_wait_threshold' => '2.50',
        'rules.zero_zero_gap_threshold' => '1.00',
        'rules.upcoming_score_odds_limit' => '7.00',
        'rules.minimum_vitality' => '40',
        'rules.minimum_convergence_score' => '75',
        'tendance_source' => null,
        'tendance_seuil_stable' => null,
        'ecart_negatif_comportement' => null,
        'rules.vitality_normalization_references' => null,
    ];

    public function index(): JsonResponse
    {
        return response()->json(['settings' => Setting::query()->orderBy('key')->get()->map(
            fn (Setting $setting): array => $this->serialize($setting),
        )]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate(['settings' => ['required', 'array', 'min:1']]);
        $settings = Setting::query()
            ->whereIn('key', array_keys($validated['settings']))
            ->get()
            ->keyBy('key');

        if ($settings->count() !== count($validated['settings'])) {
            throw ValidationException::withMessages(['settings' => 'Un ou plusieurs paramètres ne sont pas modifiables.']);
        }

        $values = [];
        foreach ($validated['settings'] as $key => $value) {
            try {
                $values[$key] = $this->normalize($settings[$key], $value);
            } catch (InvalidArgumentException $exception) {
                throw ValidationException::withMessages(["settings.{$key}" => $exception->getMessage()]);
            }
        }

        DB::transaction(function () use ($settings, $values): void {
            foreach ($values as $key => $value) {
                $setting = $settings[$key];
                $newValue = $this->encode($value, $setting->type);
                if ($setting->value === $newValue) {
                    continue;
                }

                SettingChange::query()->create([
                    'user_id' => auth()->id(),
                    'setting_key' => $key,
                    'old_value' => $setting->value,
                    'new_value' => $newValue,
                ]);
                $setting->forceFill(['value' => $newValue])->save();
            }
        });

        return $this->index();
    }

    public function reset(): JsonResponse
    {
        DB::transaction(function (): void {
            foreach (Setting::query()->get() as $setting) {
                if (! array_key_exists($setting->key, self::DEFAULTS)) {
                    continue;
                }

                $value = self::DEFAULTS[$setting->key];
                if ($setting->value === $value) {
                    continue;
                }

                SettingChange::query()->create([
                    'user_id' => auth()->id(),
                    'setting_key' => $setting->key,
                    'old_value' => $setting->value,
                    'new_value' => $value,
                ]);
                $setting->forceFill(['value' => $value])->save();
            }
        });

        return $this->index();
    }

    public function history(): JsonResponse
    {
        $changes = SettingChange::query()
            ->with('user:id,name')
            ->latest('changed_at')
            ->paginate(20);

        return response()->json([
            'data' => $changes->getCollection()->map(fn (SettingChange $change): array => [
                'id' => $change->id,
                'settingKey' => $change->setting_key,
                'oldValue' => $change->old_value,
                'newValue' => $change->new_value,
                'changedAt' => $change->changed_at?->toIso8601String(),
                'user' => $change->user?->name ?? 'Compte supprimé',
            ]),
            'pagination' => [
                'currentPage' => $changes->currentPage(),
                'lastPage' => $changes->lastPage(),
                'total' => $changes->total(),
            ],
        ]);
    }

    private function normalize(Setting $setting, mixed $value): int|float|bool|array|string|null
    {
        if ($value === '' || $value === null) {
            if ($setting->needs_confirmation) {
                return null;
            }

            throw new InvalidArgumentException('Ce paramètre est requis.');
        }

        return match ($setting->type) {
            'integer' => $this->integer($value),
            'decimal' => $this->decimal($setting, $value),
            'boolean' => $this->boolean($value),
            'string' => $this->string($setting, $value),
            'json' => $this->json($value),
            default => throw new InvalidArgumentException('Type de paramètre non pris en charge.'),
        };
    }

    private function integer(mixed $value): int
    {
        $parsed = filter_var($value, FILTER_VALIDATE_INT);
        if ($parsed === false || $parsed < 1) {
            throw new InvalidArgumentException('La valeur doit être un entier strictement positif.');
        }

        return $parsed;
    }

    private function decimal(Setting $setting, mixed $value): float
    {
        if (! is_numeric($value) || ! is_finite((float) $value) || (float) $value < 0) {
            throw new InvalidArgumentException('La valeur doit être un nombre fini positif ou nul.');
        }

        $number = (float) $value;
        if (in_array($setting->key, ['rules.minimum_vitality', 'rules.minimum_convergence_score'], true)
            && $number > 100) {
            throw new InvalidArgumentException('La valeur ne peut pas dépasser 100.');
        }

        return $number;
    }

    private function boolean(mixed $value): bool
    {
        if (! is_bool($value)) {
            throw new InvalidArgumentException('La valeur doit être booléenne.');
        }

        return $value;
    }

    private function string(Setting $setting, mixed $value): string
    {
        if (! is_string($value)
            || ($setting->key === 'tendance_source' && $value !== 'cote_suggeree')) {
            throw new InvalidArgumentException('La source autorisée est cote_suggeree.');
        }

        return $value;
    }

    /**
     * @return array<mixed>
     */
    private function json(mixed $value): array
    {
        if (! is_array($value)) {
            throw new InvalidArgumentException('La valeur JSON doit être un objet ou un tableau.');
        }

        return $value;
    }

    private function encode(int|float|bool|array|string|null $value, string $type): ?string
    {
        if ($value === null) {
            return null;
        }

        if ($type === 'json') {
            try {
                return json_encode($value, JSON_THROW_ON_ERROR);
            } catch (JsonException $exception) {
                throw new InvalidArgumentException('La valeur JSON n’a pas pu être encodée.', previous: $exception);
            }
        }

        return is_bool($value) ? ($value ? '1' : '0') : (string) $value;
    }

    private function serialize(Setting $setting): array
    {
        $value = match ($setting->type) {
            'integer' => $setting->value === null ? null : (int) $setting->value,
            'decimal' => $setting->value === null ? null : (float) $setting->value,
            'boolean' => $setting->value === null ? null : filter_var($setting->value, FILTER_VALIDATE_BOOLEAN),
            'json' => $setting->value === null ? null : json_decode($setting->value, true),
            default => $setting->value,
        };

        return [
            'key' => $setting->key,
            'value' => $value,
            'type' => $setting->type,
            'description' => $setting->description,
            'needsConfirmation' => $setting->needs_confirmation,
        ];
    }
}
