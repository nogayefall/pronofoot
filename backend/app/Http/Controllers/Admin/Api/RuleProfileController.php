<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\RuleProfile;
use App\Rules\RuleConfiguration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

/**
 * Module 3.6 du CDC V9.1 : profils de règles (sélection des méthodes, poids, seuil de validation).
 * Le constructeur de règles no-code est hors Phase 1. Aucun poids n’est fourni par défaut.
 */
final class RuleProfileController extends Controller
{
    private const AVAILABLE_RULES = RuleConfiguration::DEFINED_RULES;

    public function show(): JsonResponse
    {
        $profiles = RuleProfile::query()->orderBy('name')->get();
        $active = $profiles->firstWhere('is_active', true);

        return response()->json([
            'profile' => $active === null ? null : $this->serialize($active),
            'profiles' => $profiles->map(fn (RuleProfile $profile): array => $this->serialize($profile))->values(),
            'availableRules' => self::AVAILABLE_RULES,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120', Rule::unique('rule_profiles', 'name')],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        $profile = RuleProfile::query()->create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'is_active' => ! RuleProfile::query()->where('is_active', true)->exists(),
            'settings' => ['active_rules' => [], 'method_weights' => []],
        ]);

        return response()->json(['created' => $this->serialize($profile), ...$this->show()->getData(true)], 201);
    }

    /**
     * Met à jour le profil actif (compatibilité avec l’écran d’origine).
     */
    public function update(Request $request): JsonResponse
    {
        $profile = RuleProfile::query()->where('is_active', true)->first()
            ?? RuleProfile::query()->firstOrCreate(
                ['name' => 'Profil administrateur'],
                ['description' => 'Profil de règles configuré par l’administrateur.', 'settings' => []],
            );

        $this->save($request, $profile);
        $this->activateProfile($profile);

        return $this->show();
    }

    public function updateProfile(Request $request, RuleProfile $ruleProfile): JsonResponse
    {
        $this->save($request, $ruleProfile);

        return $this->show();
    }

    public function activate(RuleProfile $ruleProfile): JsonResponse
    {
        $this->activateProfile($ruleProfile);

        return $this->show();
    }

    private function save(Request $request, RuleProfile $profile): void
    {
        $validated = $request->validate([
            'active_rules' => ['present', 'array'],
            'active_rules.*' => ['required', 'string', 'distinct', Rule::in(self::AVAILABLE_RULES)],
            'method_weights' => ['present', 'array'],
            'validation_threshold' => ['nullable', 'numeric', 'between:0,100'],
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

        $profile->forceFill([
            'settings' => [
                'active_rules' => array_values($validated['active_rules']),
                'method_weights' => array_map('floatval', $validated['method_weights']),
                'validation_threshold' => isset($validated['validation_threshold'])
                    ? (float) $validated['validation_threshold']
                    : null,
            ],
        ])->save();
    }

    private function activateProfile(RuleProfile $profile): void
    {
        DB::transaction(function () use ($profile): void {
            RuleProfile::query()->whereKeyNot($profile->id)->update(['is_active' => false]);
            $profile->forceFill(['is_active' => true])->save();
        });
    }

    /**
     * @return array<string, mixed>
     */
    private function serialize(RuleProfile $profile): array
    {
        return [
            'id' => $profile->id,
            'name' => $profile->name,
            'description' => $profile->description,
            'isActive' => $profile->is_active,
            'activeRules' => $profile->settings['active_rules'] ?? [],
            'methodWeights' => (object) ($profile->settings['method_weights'] ?? []),
            'validationThreshold' => $profile->settings['validation_threshold'] ?? null,
        ];
    }
}
