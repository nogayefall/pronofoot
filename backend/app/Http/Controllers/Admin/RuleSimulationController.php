<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Rules\EngineResult;
use App\Rules\RuleConfiguration;
use App\Rules\RuleEngine;
use App\Rules\RuleInput;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RuleSimulationController extends Controller
{
    public function __invoke(Request $request, RuleEngine $ruleEngine): JsonResponse
    {
        $validated = $request->validate([
            'home_score' => ['required', 'integer', 'min:0'],
            'away_score' => ['required', 'integer', 'min:0'],
            'exact_score_odds' => ['required', 'array', 'min:1', 'max:200'],
            'exact_score_odds.*' => ['required', 'numeric', 'gt:0'],
            'vitality_score' => ['required', 'numeric', 'between:0,100'],
            'odds_change_percent' => ['required', 'numeric'],
            'tendance_source' => ['nullable', 'in:cote_suggeree'],
            'tendance_seuil_stable' => ['nullable', 'numeric', 'min:0'],
        ]);

        $input = new RuleInput(
            homeScore: (int) $validated['home_score'],
            awayScore: (int) $validated['away_score'],
            exactScoreOdds: array_map('floatval', $validated['exact_score_odds']),
            vitalityScore: (float) $validated['vitality_score'],
            oddsChangePercent: (float) $validated['odds_change_percent'],
        );

        $result = $ruleEngine->evaluate(
            $input,
            new RuleConfiguration(
                activeRules: ['F121-C', 'F121-C.2', 'F121-D'],
                trendSource: $validated['tendance_source'] ?? null,
                stableOddsChangePercent: isset($validated['tendance_seuil_stable'])
                    ? (float) $validated['tendance_seuil_stable']
                    : null,
            ),
        );

        return response()->json([
            'rules' => $this->serializeRules($result),
            'filters' => $this->serializeFilters($result),
            'decision' => [
                'shouldAlert' => $result->shouldAlert,
                'convergenceScore' => $result->convergenceScore,
                'reason' => $result->reason,
            ],
            'simulationOnly' => true,
        ]);
    }

    private function serializeRules(EngineResult $result): array
    {
        $rules = [];
        foreach ($result->rules as $ruleId => $rule) {
            $rules[$ruleId] = [
                'ruleId' => $rule->ruleId,
                'verdict' => $rule->verdict->value,
                'suggestedAction' => $rule->suggestedAction,
                'score' => $rule->score,
                'reason' => $rule->reason,
                'details' => $rule->details,
            ];
        }

        return $rules;
    }

    private function serializeFilters(EngineResult $result): array
    {
        $labels = [
            'gap' => 'Écart directionnel',
            'trend' => 'Tendance sur 2 minutes',
            'vitality' => 'Vitalité',
        ];
        $filters = [];
        foreach ($result->filters as $filterId => $filter) {
            $filters[$filterId] = [
                'label' => $labels[$filterId],
                'passed' => $filter->passed,
                'reason' => $filter->reason,
                'details' => $filter->details,
            ];
        }

        return $filters;
    }
}
