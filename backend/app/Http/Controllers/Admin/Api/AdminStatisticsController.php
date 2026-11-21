<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use App\Models\OpportunityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Statistiques des alertes : taux de réussite = gagnées ÷ (gagnées + perdues) ; les annulées et en attente ne comptent
 * pas. Par alerte (option principale), par règle, et par règle et type d’option (ciblée, neutre, Over 4.5, Over 0.5
 * 2e mi-temps), sur toutes les options (résultat automatique) et sur les seules options marquées « jouées ».
 */
final class AdminStatisticsController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
        ]);
        $dateFilter = fn ($query) => $query
            ->when(isset($validated['date_from']), fn ($query) => $query->whereDate('evaluated_at', '>=', $validated['date_from']))
            ->when(isset($validated['date_to']), fn ($query) => $query->whereDate('evaluated_at', '<=', $validated['date_to']));
        $alertLogs = OpportunityLog::query()->whereHas('alert')->tap($dateFilter)->with('alert.options')->get(['id', 'rule_id', 'selection', 'outcome']);

        $options = collect();
        foreach ($alertLogs as $log) {
            $rule = $log->rule_id ?? 'non spécifiée';
            $alertOptions = $log->alert?->options ?? collect();
            if ($alertOptions->isEmpty()) {
                // Alerte sans option enregistrée (antérieure ou saisie à la main) : son résultat vaut pour son option principale.
                $options->push(['rule' => $rule, 'type' => $this->inferType($log), 'position' => 1, 'decision' => 'unset', 'outcome' => $log->outcome ?? 'pending']);

                continue;
            }

            foreach ($alertOptions as $option) {
                $options->push(['rule' => $rule, 'type' => $option->type, 'position' => $option->position, 'decision' => $option->decision, 'outcome' => $option->outcome]);
            }
        }

        $primary = $options->where('position', 1);
        $refusals = $this->refusals($dateFilter);

        return response()->json([
            'period' => [
                'from' => $validated['date_from'] ?? null,
                'to' => $validated['date_to'] ?? null,
            ],
            'alerts' => [
                'total' => $alertLogs->count(),
                'active' => Alert::query()->whereIn('status', ['queued', 'sent'])->count(),
                'won' => $primary->where('outcome', 'won')->count(),
                'lost' => $primary->where('outcome', 'lost')->count(),
                'cancelled' => $primary->where('outcome', 'cancelled')->count(),
                'unrated' => $primary->where('outcome', 'pending')->count(),
                'successRatePercent' => $this->rate($primary),
            ],
            'byRule' => $options->groupBy('rule')->map(function ($ruleOptions): array {
                $rulePrimary = $ruleOptions->where('position', 1);

                return [
                    'alerts' => $rulePrimary->count(),
                    'won' => $rulePrimary->where('outcome', 'won')->count(),
                    'lost' => $rulePrimary->where('outcome', 'lost')->count(),
                    'cancelled' => $rulePrimary->where('outcome', 'cancelled')->count(),
                    'successRatePercent' => $this->rate($rulePrimary),
                    'byType' => $ruleOptions->groupBy('type')->map(fn ($typeOptions): array => $this->block($typeOptions)),
                ];
            }),
            'byType' => $options->groupBy('type')->map(fn ($typeOptions): array => $this->block($typeOptions)),
            'refusalsByFilter' => $refusals,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function block($options): array
    {
        $played = $options->where('decision', 'played');

        return [
            'options' => $options->count(),
            'won' => $options->where('outcome', 'won')->count(),
            'lost' => $options->where('outcome', 'lost')->count(),
            'cancelled' => $options->where('outcome', 'cancelled')->count(),
            'pending' => $options->where('outcome', 'pending')->count(),
            'successRatePercent' => $this->rate($options),
            'played' => [
                'options' => $played->count(),
                'won' => $played->where('outcome', 'won')->count(),
                'lost' => $played->where('outcome', 'lost')->count(),
                'successRatePercent' => $this->rate($played),
            ],
        ];
    }

    private function rate($options): ?float
    {
        $won = $options->where('outcome', 'won')->count();
        $decided = $won + $options->where('outcome', 'lost')->count();

        return $decided === 0 ? null : round($won / $decided * 100, 2);
    }

    private function inferType(OpportunityLog $log): string
    {
        return match (true) {
            $log->rule_id === 'F121-D' => 'over45',
            $log->rule_id === 'F121-E2' => 'halftime_over05',
            in_array($log->selection, ['home', 'away'], true) => 'targeted',
            default => 'neutral',
        };
    }

    /**
     * @return array<string, int>
     */
    private function refusals(\Closure $dateFilter): array
    {
        $refusals = [];
        foreach (OpportunityLog::query()->where('decision', 'no_alert')->tap($dateFilter)->get(['filter_results']) as $log) {
            foreach ($log->filter_results ?? [] as $filter => $result) {
                if (is_array($result) && ($result['passed'] ?? true) === false) {
                    $refusals[$filter] = ($refusals[$filter] ?? 0) + 1;
                }
            }
        }

        return $refusals;
    }
}
