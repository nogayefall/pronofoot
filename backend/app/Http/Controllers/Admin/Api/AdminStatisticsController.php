<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use App\Models\OpportunityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
        $alertLogs = OpportunityLog::query()->whereHas('alert')->tap($dateFilter)->get(['rule_id', 'outcome']);
        $outcomes = $alertLogs->countBy(fn (OpportunityLog $log): string => $log->outcome ?? 'unrated');
        $decided = ($outcomes['won'] ?? 0) + ($outcomes['lost'] ?? 0);
        $byRule = $alertLogs->groupBy(fn (OpportunityLog $log): string => $log->rule_id ?? 'non spécifiée')
            ->map(function ($logs): array {
                $won = $logs->where('outcome', 'won')->count();
                $lost = $logs->where('outcome', 'lost')->count();
                $decidedCount = $won + $lost;

                return [
                    'alerts' => $logs->count(),
                    'won' => $won,
                    'lost' => $lost,
                    'cancelled' => $logs->where('outcome', 'cancelled')->count(),
                    'successRatePercent' => $decidedCount === 0 ? null : round($won / $decidedCount * 100, 2),
                ];
            });

        $refusedLogs = OpportunityLog::query()
            ->where('decision', 'no_alert')
            ->tap($dateFilter)
            ->get(['filter_results']);
        $refusals = [];
        foreach ($refusedLogs as $log) {
            foreach ($log->filter_results ?? [] as $filter => $result) {
                if (is_array($result) && ($result['passed'] ?? true) === false) {
                    $refusals[$filter] = ($refusals[$filter] ?? 0) + 1;
                }
            }
        }

        return response()->json([
            'period' => [
                'from' => $validated['date_from'] ?? null,
                'to' => $validated['date_to'] ?? null,
            ],
            'alerts' => [
                'total' => $alertLogs->count(),
                'active' => Alert::query()->whereIn('status', ['queued', 'sent'])->count(),
                'won' => $outcomes['won'] ?? 0,
                'lost' => $outcomes['lost'] ?? 0,
                'cancelled' => $outcomes['cancelled'] ?? 0,
                'unrated' => $outcomes['unrated'] ?? 0,
                'successRatePercent' => $decided === 0 ? null : round(($outcomes['won'] ?? 0) / $decided * 100, 2),
            ],
            'byRule' => $byRule,
            'refusalsByFilter' => $refusals,
        ]);
    }
}
