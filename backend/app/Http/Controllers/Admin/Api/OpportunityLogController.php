<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\AlertOption;
use App\Models\OpportunityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class OpportunityLogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
            'match_id' => ['nullable', 'integer', 'exists:tracked_matches,id'],
            'rule_id' => ['nullable', 'string', 'max:32'],
            'status' => ['nullable', 'string', 'max:32'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);
        $query = OpportunityLog::query()
            ->with(['trackedMatch:id,home_team,away_team', 'matchSnapshot:id,minute,home_score,away_score', 'alert:id,opportunity_log_id,channel,status,expires_at,fallback_used', 'alert.options'])
            ->when(isset($validated['date_from']), fn ($query) => $query->whereDate('evaluated_at', '>=', $validated['date_from']))
            ->when(isset($validated['date_to']), fn ($query) => $query->whereDate('evaluated_at', '<=', $validated['date_to']))
            ->when(isset($validated['match_id']), fn ($query) => $query->where('tracked_match_id', $validated['match_id']))
            ->when(isset($validated['rule_id']), fn ($query) => $query->where('rule_id', $validated['rule_id']))
            ->when(isset($validated['status']), function ($query) use ($validated): void {
                if ($validated['status'] === 'sans_alerte') {
                    $query->whereDoesntHave('alert');
                } else {
                    $query->whereHas('alert', fn ($alerts) => $alerts->where('status', $validated['status']));
                }
            })
            ->latest('evaluated_at');
        $page = $query->paginate(20);

        return response()->json([
            'data' => $page->getCollection()->map(fn (OpportunityLog $log): array => [
                'id' => $log->id,
                'eventType' => $log->event_type,
                'ruleId' => $log->rule_id,
                'selection' => $log->selection,
                'decision' => $log->decision,
                'reason' => $log->reason,
                'ruleResults' => $log->rule_results ?? [],
                'filterResults' => $log->filter_results ?? [],
                'suggestedAction' => $log->suggested_action,
                'outcome' => $log->outcome,
                'evaluatedAt' => $log->evaluated_at?->toIso8601String(),
                'firstEvaluatedAt' => $log->first_evaluated_at?->toIso8601String(),
                'repeatCount' => (int) ($log->repeat_count ?? 1),
                'match' => $log->trackedMatch?->home_team.' - '.$log->trackedMatch?->away_team,
                'minute' => $log->matchSnapshot?->minute,
                'score' => $log->matchSnapshot === null
                    ? null
                    : $log->matchSnapshot->home_score.'-'.$log->matchSnapshot->away_score,
                'alert' => $log->alert === null ? null : [
                    'status' => $log->alert->status,
                    'channel' => $log->alert->channel,
                    'expiresAt' => $log->alert->expires_at?->toIso8601String(),
                    'fallbackUsed' => $log->alert->fallback_used,
                    'options' => $log->alert->options->map(fn (AlertOption $option): array => $this->serializeOption($option))->values(),
                ],
            ]),
            'pagination' => [
                'currentPage' => $page->currentPage(),
                'lastPage' => $page->lastPage(),
                'total' => $page->total(),
            ],
        ]);
    }

    public function updateOutcome(Request $request, OpportunityLog $opportunityLog): JsonResponse
    {
        $validated = $request->validate([
            'outcome' => ['nullable', 'in:won,lost,cancelled'],
        ]);

        if (! $opportunityLog->alert()->exists()) {
            return response()->json(['message' => 'Un résultat ne peut être saisi que pour une alerte.'], 422);
        }

        $opportunityLog->forceFill(['outcome' => $validated['outcome'] ?? null])->save();
        // Compatibilité : le résultat d’une alerte est celui de son option principale.
        $opportunityLog->alert->options()->where('position', 1)->first()?->forceFill([
            'outcome' => $validated['outcome'] ?? 'pending',
            'outcome_source' => isset($validated['outcome']) ? 'manual' : null,
            'settled_at' => isset($validated['outcome']) ? now() : null,
        ])->save();

        return response()->json(['id' => $opportunityLog->id, 'outcome' => $opportunityLog->outcome]);
    }

    /**
     * Décision (jouée / ignorée / non renseignée) et résultat d’une option, corrigés par l’administrateur : l’origine du
     * résultat passe à « manuel » et le calcul automatique ne le remplace plus.
     */
    public function updateOption(Request $request, AlertOption $alertOption): JsonResponse
    {
        $validated = $request->validate([
            'decision' => ['nullable', 'in:'.implode(',', AlertOption::DECISIONS)],
            'outcome' => ['nullable', 'in:'.implode(',', AlertOption::OUTCOMES)],
        ]);
        if (! array_key_exists('decision', $validated) && ! array_key_exists('outcome', $validated)) {
            return response()->json(['message' => 'Indiquez une décision ou un résultat.'], 422);
        }

        if (isset($validated['decision'])) {
            $alertOption->decision = $validated['decision'];
        }
        if (isset($validated['outcome'])) {
            $pending = $validated['outcome'] === 'pending';
            $alertOption->forceFill([
                'outcome' => $validated['outcome'],
                'outcome_source' => $pending ? null : 'manual',
                'settled_at' => $pending ? null : now(),
            ]);
        }
        $alertOption->save();

        if ($alertOption->position === 1 && isset($validated['outcome'])) {
            $alertOption->alert?->opportunityLog?->forceFill(['outcome' => $validated['outcome'] === 'pending' ? null : $validated['outcome']])->save();
        }

        return response()->json(['option' => $this->serializeOption($alertOption)]);
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeOption(AlertOption $option): array
    {
        return [
            'id' => $option->id,
            'position' => $option->position,
            'type' => $option->type,
            'label' => $option->label,
            'side' => $option->side,
            'scoreKey' => $option->score_key,
            'line' => $option->line,
            'odds' => $option->odds,
            'decision' => $option->decision,
            'outcome' => $option->outcome,
            'outcomeSource' => $option->outcome_source,
            'settledAt' => $option->settled_at?->toIso8601String(),
        ];
    }
}
