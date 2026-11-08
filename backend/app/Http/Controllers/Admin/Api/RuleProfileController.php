<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\RuleProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

final class RuleProfileController extends Controller
{
    private const AVAILABLE_RULES = ['F121-C', 'F121-C.2', 'F121-D'];

    public function show(): JsonResponse
    {
        $profile = RuleProfile::query()->where('is_active', true)->first();

        return response()->json([
            'profile' => $profile === null ? null : [
                'id' => $profile->id,
                'name' => $profile->name,
                'activeRules' => $profile->settings['active_rules'] ?? [],
                'methodWeights' => $profile->settings['method_weights'] ?? [],
            ],
            'availableRules' => self::AVAILABLE_RULES,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'active_rules' => ['required', 'array'],
            'active_rules.*' => ['required', 'string', 'distinct', 'in:'.implode(',', self::AVAILABLE_RULES)],
            'method_weights' => ['required', 'array'],
        ]);

        foreach ($validated['method_weights'] as $rule => $weight) {
            if (! in_array($rule, self::AVAILABLE_RULES, true)
                || ! is_numeric($weight)
                || ! is_finite((float) $weight)
                || (float) $weight < 0) {
                throw ValidationException::withMessages([
                    'method_weights' => 'Les poids doivent utiliser une règle disponible et une valeur numérique positive ou nulle.',
                ]);
            }
        }

        DB::transaction(function () use ($validated): void {
            $profile = RuleProfile::query()->where('is_active', true)->first()
                ?? RuleProfile::query()->firstOrCreate(
                    ['name' => 'Profil administrateur'],
                    ['description' => 'Profil de règles configuré par l’administrateur.', 'settings' => []],
                );

            RuleProfile::query()->where('id', '<>', $profile->id)->update(['is_active' => false]);
            $profile->forceFill([
                'is_active' => true,
                'settings' => [
                    'active_rules' => $validated['active_rules'],
                    'method_weights' => array_map('floatval', $validated['method_weights']),
                ],
            ])->save();
        });

        return $this->show();
    }
}
