<?php

namespace App\Console\Commands;

use App\Models\AlertOption;
use App\Models\TrackedMatch;
use App\Providers\Contracts\FootballProvider;
use App\Services\AlertSettlementService;
use App\Services\MatchStatus;
use Illuminate\Console\Command;

/**
 * Recalcul des résultats automatiques déjà notés (jamais les résultats manuels, en attente ou annulés), avec le score
 * final officiel des matchs. Simulation par défaut ; --apply écrit. Faire une sauvegarde de la base avant.
 */
final class RecalculateResults extends Command
{
    protected $signature = 'results:recalculate {--apply : Écrire les nouveaux résultats (sinon simulation)}';

    protected $description = 'Recalculer les résultats automatiques des options d’alerte des matchs terminés.';

    public function handle(FootballProvider $footballProvider, AlertSettlementService $settlement): int
    {
        $apply = (bool) $this->option('apply');
        $matches = TrackedMatch::query()
            ->where('is_active', false)
            ->whereNotNull('ended_at')
            ->whereIn('id', AlertOption::query()
                ->join('alerts', 'alerts.id', '=', 'alert_options.alert_id')
                ->join('opportunity_logs', 'opportunity_logs.id', '=', 'alerts.opportunity_log_id')
                ->where('alert_options.outcome_source', 'auto')
                ->whereIn('alert_options.outcome', ['won', 'lost'])
                ->select('opportunity_logs.tracked_match_id'))
            ->orderBy('id')
            ->get();
        $this->info(($apply ? 'ÉCRITURE' : 'SIMULATION (rien n’est écrit)')." : {$matches->count()} matchs terminés.");

        $official = [];
        foreach ($matches->pluck('provider_match_id')->chunk(20) as $chunk) {
            $official += $footballProvider->getFinalScores($chunk->values()->all());
        }

        $before = $this->rates();
        $after = $before;
        $changed = 0;
        foreach ($matches as $match) {
            $final = $official[$match->provider_match_id] ?? null;
            if ($final === null || ! MatchStatus::isFinished($final['status']) || $final['home'] === null || $final['away'] === null) {
                $this->warn("{$match->home_team} - {$match->away_team} : score final officiel indisponible, résultats inchangés.");

                continue;
            }

            foreach ($settlement->recalculateMatch($match, $final, $apply) as ['alert' => $alert, 'option' => $option, 'before' => $old, 'after' => $new]) {
                $changed++;
                $after[$option->type][$old]--;
                $after[$option->type][$new] = ($after[$option->type][$new] ?? 0) + 1;
                $log = $alert->opportunityLog;
                $base = $log->matchSnapshot;
                $this->line(sprintf(
                    'Option %d | %s | %s - %s | %s %s %s | alerte à %s-%s (%s\') | final %d-%d | %s → %s',
                    $option->id,
                    $log->evaluated_at->format('d/m H:i'),
                    $match->home_team,
                    $match->away_team,
                    $log->rule_id,
                    $option->type,
                    $option->line ?? $option->side,
                    $base->home_score,
                    $base->away_score,
                    $base->minute,
                    $final['home'],
                    $final['away'],
                    $old,
                    $new,
                ));
            }
        }

        $this->info("Options modifiées : {$changed}");
        ksort($before);
        $this->table(['Type (résultats automatiques)', 'Avant', 'Après'], array_map(
            fn (string $type): array => [$type, $this->rate($before[$type]), $this->rate($after[$type])],
            array_keys($before),
        ));

        return self::SUCCESS;
    }

    /**
     * @return array<string, array<string, int>>
     */
    private function rates(): array
    {
        $rates = [];
        foreach (AlertOption::query()->where('outcome_source', 'auto')->whereIn('outcome', ['won', 'lost'])->get(['type', 'outcome']) as $option) {
            $rates[$option->type][$option->outcome] = ($rates[$option->type][$option->outcome] ?? 0) + 1;
        }

        return $rates;
    }

    /**
     * @param  array<string, int>  $counts
     */
    private function rate(array $counts): string
    {
        $won = $counts['won'] ?? 0;
        $total = $won + ($counts['lost'] ?? 0);

        return $total === 0 ? '—' : sprintf('%d / %d = %s %%', $won, $total, number_format($won / $total * 100, 1, ',', ''));
    }
}
