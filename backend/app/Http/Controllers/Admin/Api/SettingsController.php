<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\SettingChange;
use App\Rules\RuleConfiguration;
use App\Rules\VitalityCalculator;
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
        'rules.upcoming_score_odds_limit' => '8.00',
        'rules.minimum_vitality' => '41',
        'rules.minimum_convergence_score' => '75',
        'tendance_source' => 'cote_suggeree',
        'tendance_seuil_stable' => '5',
        'rules.vitality_normalization_references' => '{"shots":[[15,30],[8,20],[3,10]],"shots_on_target":[[6,30],[3,20],[1,10]],"possession":[[60,20],[50,10]],"corners":[[8,20],[4,10]]}',
        'rules.halftime_under25_min' => '1.15',
        'rules.halftime_under25_max' => '1.40',
        'rules.open_match_min_goals' => '4',
        'rules.abstention_gap_threshold' => '0.50',
        'rules.minutes_remaining_enabled' => '0',
        'rules.minutes_remaining_min' => '10',
        'alerts.level_negative_gap' => 'Critique',
        'alerts.level_positive_gap' => 'Haute',
        'rules.decision_pipeline' => '["F121-E2","F121-D","vitality","trend_drop","trend_rise","gap_negative","gap_too_high","gap_small"]',
        'scan.quota_economy_percent' => '10',
        'scan.hot_interval_seconds' => '30',
        'scan.calm_interval_seconds' => '120',
        'scan.hot_gap_threshold' => '1.50',
        'scan.no_scan_gap_threshold' => '2.00',
        'scan.auto_mode' => '1',
        'scan.auto_league_ids' => '[39,140,135,78,61,2,3]',
        'rules.convergence_enabled' => '0',
        'scan.missing_readings_before_end' => '4',
        'scan.max_match_duration_minutes' => '270',
        'scan.idle_interval_seconds' => '300',
        'scan.allow_tracking_without_statistics' => '1',
        'scan.paused' => '0',
        'rules.f121x_enabled' => '0',
        'rules.f121x_cross_gap_max' => '1.00',
        'rules.follow_leader_enabled' => '0',
        'results.bet_validity' => 'match',
        'results.count_extra_time' => '1',
        'rules.strong_drop_requires_gap' => '1',
        'plancher.scan_depart_enabled' => '1',
        'plancher.depart_minute_from' => '3',
        'plancher.depart_minute_to' => '11',
        'plancher.scan_pause_enabled' => '1',
        'plancher.scan_soixante_enabled' => '1',
        'plancher.soixante_minute_from' => '60',
        'plancher.soixante_minute_to' => '65',
        'plancher.notify_depart' => '1',
        'plancher.notify_pause' => '1',
        'plancher.notify_soixante' => '1',
        'plancher.score_odds_limit' => '8.00',
        'plancher.low_value_odds' => '1.25',
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
            'json' => $this->json($setting, $value),
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

        if ($setting->key === 'results.bet_validity' && ! in_array($value, ['match', 'alert'], true)) {
            throw new InvalidArgumentException('La validité du pari doit être « match » (fin du match) ou « alert » (durée de l’alerte).');
        }

        return $value;
    }

    /**
     * @return array<mixed>
     */
    private function json(Setting $setting, mixed $value): array
    {
        if (! is_array($value)) {
            throw new InvalidArgumentException('La valeur JSON doit être un objet ou un tableau.');
        }

        match ($setting->key) {
            'rules.vitality_normalization_references' => (new VitalityCalculator)->assertValidScale($value),
            'rules.decision_pipeline' => new RuleConfiguration(pipeline: array_values($value)),
            'scan.auto_league_ids' => $this->assertLeagueIds($value),
            default => null,
        };

        return $value;
    }

    /**
     * @param  array<mixed>  $value
     */
    private function assertLeagueIds(array $value): void
    {
        foreach ($value as $leagueId) {
            if (! is_int($leagueId) || $leagueId < 1) {
                throw new InvalidArgumentException('Chaque identifiant de ligue doit être un entier positif.');
            }
        }
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
