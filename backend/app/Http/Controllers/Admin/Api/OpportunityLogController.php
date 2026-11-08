<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
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
            ->with(['trackedMatch:id,home_team,away_team', 'matchSnapshot:id,minute,home_score,away_score', 'alert:id,opportunity_log_id,channel,status,expires_at,fallback_used'])
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

        return response()->json(['id' => $opportunityLog->id, 'outcome' => $opportunityLog->outcome]);
    }
}
