<?php

namespace App\Services;

use App\Jobs\SendAlertNotification;
use App\Models\AlertOption;
use App\Models\MatchSnapshot;
use App\Models\OpportunityLog;
use App\Models\RuleProfile;
use App\Models\TrackedMatch;
use App\Notifications\AlertMessageFormatter;
use App\Providers\Data\FootballMatch;
use App\Providers\Data\OddsMatch;
use App\Rules\GoalFloor;
use App\Rules\RuleConfiguration;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Scans du mode Plancher (annexe « Quoi coder v2 ») pendant le scan réel : départ, pause (scan E2) et soixante, une
 * seule fois chacun par match, jamais au relevé d’un but. Réutilise les relevés du passage (scores exacts, lignes
 * Over/Under du total du match). Chaque scan écrit une ligne au Journal ; s’il propose des paris, une alerte « Plancher »
 * avec une option par pari (central, prudent), notée à la fin du match, et un message Telegram si le scan l’autorise.
 */
final class GoalFloorScanService
{
    public const RULE_ID = 'Plancher';

    public const EVENT_TYPE = 'plancher_scan';

    /** Options dont la ligne Over sur le total du match compte comme « déjà posée ». */
    private const POSTED_TYPES = ['neutral', 'over45', 'plancher_central', 'plancher_prudent'];

    public function __construct(private readonly AlertMessageFormatter $formatter = new AlertMessageFormatter) {}

    /**
     * Période du match : « 1H », « HT » ou « 2H » (code court API-Football, sinon statut long ou minute du pilote fictif).
     */
    public static function phase(FootballMatch $match): ?string
    {
        $code = MatchStatus::code($match);
        if (in_array($code, ['1H', 'HT', '2H'], true)) {
            return $code;
        }

        return match (true) {
            strcasecmp($match->status, 'Halftime') === 0 => 'HT',
            strcasecmp($match->status, 'First Half') === 0 => '1H',
            strcasecmp($match->status, 'Second Half') === 0 => '2H',
            ($code === 'LIVE' || $match->status === 'live') && $match->minute !== null => $match->minute <= 45 ? '1H' : '2H',
            default => null,
        };
    }

    /**
     * Scan Plancher dû pour ce match à ce relevé, d’après les fenêtres et les scans activés dans Paramètres. Le scan de
     * la pause est le scan E2 : actif seulement si F121-E2 est cochée dans le profil actif.
     *
     * @param  array<string, int|float|bool|array|string|null>  $settings
     */
    public function dueScan(TrackedMatch $trackedMatch, FootballMatch $footballMatch, array $settings, bool $e2Active): ?string
    {
        $enabled = array_values(array_filter([
            $this->enabled($settings, 'plancher.scan_depart_enabled') ? 'depart' : null,
            $this->enabled($settings, 'plancher.scan_pause_enabled') && $e2Active ? 'pause' : null,
            $this->enabled($settings, 'plancher.scan_soixante_enabled') ? 'soixante' : null,
        ]));
        if ($enabled === []) {
            return null;
        }

        return GoalFloor::scanMoment(
            self::phase($footballMatch),
            $footballMatch->minute,
            array_keys(is_array($trackedMatch->plancher_scans) ? $trackedMatch->plancher_scans : []),
            [
                'depart' => [$this->minute($settings, 'plancher.depart_minute_from', 3), $this->minute($settings, 'plancher.depart_minute_to', 11)],
                'soixante' => [$this->minute($settings, 'plancher.soixante_minute_from', 60), $this->minute($settings, 'plancher.soixante_minute_to', 65)],
            ],
            $enabled,
        );
    }

    /**
     * Exécute le scan, l’inscrit au Journal et marque le scan comme fait pour ce match.
     *
     * @param  array<string, int|float|bool|array|string|null>  $settings
     * @return array{log: OpportunityLog, alert: bool}
     */
    public function scan(
        TrackedMatch $trackedMatch,
        MatchSnapshot $snapshot,
        FootballMatch $footballMatch,
        OddsMatch $oddsMatch,
        string $scan,
        array $settings,
        ?RuleProfile $profile,
        ?RuleConfiguration $configuration,
        CarbonImmutable $now,
    ): array {
        $floor = new GoalFloor(
            $this->decimal($settings, 'plancher.score_odds_limit', 8.00),
            $this->decimal($settings, 'plancher.low_value_odds', 1.25),
        );
        $home = (int) $footballMatch->homeScore;
        $away = (int) $footballMatch->awayScore;
        $posted = $this->postedLines($trackedMatch);
        $summary = $floor->summary($home, $away, $oddsMatch->exactScoreOdds);
        $result = $floor->propose($home, $away, $oddsMatch->exactScoreOdds, $oddsMatch->overLineOdds, $posted);
        $proposals = $result['proposals'] ?? [];
        $notify = $proposals !== [] && $this->enabled($settings, 'plancher.notify_'.$scan);

        $under25 = $oddsMatch->underLineOdds['2.5'] ?? $oddsMatch->under25Odds;
        $aboveLine = $summary === null ? null : GoalFloor::line($summary['totalMax'] + 0.5);
        $details = [
            'mode' => 'Plancher',
            'scan' => $scan,
            'minute' => $footballMatch->minute,
            'score' => "{$home}-{$away}",
            'scoreOddsLimit' => $floor->scoreOddsLimit,
            'lowValueOdds' => $floor->lowValueOdds,
            'list' => $summary['list'] ?? [],
            'totalMax' => $summary['totalMax'] ?? null,
            'floor' => $summary['floor'] ?? null,
            'proposals' => $proposals,
            'skipped' => $result['skipped'] ?? [],
            'alreadyPosted' => $posted,
            'under25' => is_numeric($under25) ? (float) $under25 : null,
            'underAboveTotalMax' => $aboveLine === null ? null : ['line' => $aboveLine, 'odds' => $oddsMatch->underLineOdds[$aboveLine] ?? null],
            'e2Signal' => $scan === 'pause' ? $this->e2Signal($under25, $configuration) : null,
            'notified' => $notify,
        ];

        return DB::transaction(function () use ($trackedMatch, $snapshot, $profile, $scan, $details, $proposals, $notify, $now, $footballMatch, $floor, $summary): array {
            TrackedMatch::query()->whereKey($trackedMatch->id)->lockForUpdate()->firstOrFail();
            $log = OpportunityLog::query()->create([
                'tracked_match_id' => $trackedMatch->id,
                'match_snapshot_id' => $snapshot->id,
                'rule_profile_id' => $profile?->id,
                'event_type' => self::EVENT_TYPE,
                'rule_id' => self::RULE_ID,
                'decision' => $proposals === [] ? 'no_alert' : 'alert',
                'suggested_action' => $proposals === [] ? null : implode(' · ', array_column($proposals, 'bet')),
                'plancher' => $details,
                'reason' => $this->reason($details),
                'evaluated_at' => $now,
                'first_evaluated_at' => $now,
                'repeat_count' => 1,
            ]);

            $scans = is_array($trackedMatch->plancher_scans) ? $trackedMatch->plancher_scans : [];
            $scans[$scan] = $now->toIso8601String();
            $trackedMatch->forceFill(['plancher_scans' => $scans])->save();

            if ($proposals === []) {
                return ['log' => $log, 'alert' => false];
            }

            $alert = $log->alert()->create([
                'channel' => $notify ? 'pending' : 'none',
                'status' => $notify ? 'queued' : 'silent',
                'message' => $this->formatter->goalFloor(
                    $trackedMatch->home_team,
                    $trackedMatch->away_team,
                    (int) $footballMatch->homeScore,
                    (int) $footballMatch->awayScore,
                    $footballMatch->minute,
                    $scan,
                    $floor->scoreOddsLimit,
                    $summary['list'] ?? [],
                    (int) ($summary['totalMax'] ?? 0),
                    (int) ($summary['floor'] ?? 0),
                    $proposals,
                ),
                // Pari sur le total du match : valable jusqu’à la fin du match, pas d’expiration à 15 minutes.
                'expires_at' => null,
            ]);
            foreach ($proposals as $index => $proposal) {
                $alert->options()->create([
                    'position' => $index + 1,
                    'type' => 'plancher_'.$proposal['type'],
                    'label' => $proposal['type'] === 'central' ? 'Plancher central' : 'Plancher prudent',
                    'line' => $proposal['bet'],
                    'odds' => $proposal['odds'],
                    'decision' => 'unset',
                    'outcome' => 'pending',
                ]);
            }
            if ($notify) {
                DB::afterCommit(fn () => SendAlertNotification::dispatch($alert->id));
            }

            return ['log' => $log, 'alert' => true];
        });
    }

    /**
     * Lignes Over déjà posées sur ce match : paris Plancher précédents et options neutres (et Over 4.5) des alertes.
     *
     * @return list<float>
     */
    public function postedLines(TrackedMatch $trackedMatch): array
    {
        /** @var Collection<int, AlertOption> $options */
        $options = AlertOption::query()
            ->whereIn('type', self::POSTED_TYPES)
            ->whereHas('alert.opportunityLog', fn ($query) => $query->where('tracked_match_id', $trackedMatch->id))
            ->get(['line']);
        $lines = [];
        foreach ($options as $option) {
            if (is_string($option->line) && preg_match('/Over\s+(\d+(?:\.\d+)?)/i', $option->line, $match)) {
                $lines[] = (float) $match[1];
            }
        }

        return array_values(array_unique($lines, SORT_REGULAR));
    }

    /**
     * Signal E2 d’origine (Under 2.5 dans la plage de F121-E2), journalisé pour comparer, sans décider.
     *
     * @return array{under25: float|null, minimum: float, maximum: float, inBand: bool}
     */
    private function e2Signal(mixed $under25, ?RuleConfiguration $configuration): array
    {
        $configuration ??= new RuleConfiguration;
        $odds = is_numeric($under25) ? (float) $under25 : null;

        return [
            'under25' => $odds,
            'minimum' => $configuration->halftimeUnderMinimum,
            'maximum' => $configuration->halftimeUnderMaximum,
            'inBand' => $odds !== null && $odds >= $configuration->halftimeUnderMinimum && $odds <= $configuration->halftimeUnderMaximum,
        ];
    }

    /**
     * @param  array<string, mixed>  $details
     */
    private function reason(array $details): string
    {
        $scan = GoalFloor::SCAN_LABELS[$details['scan']] ?? $details['scan'];
        $prefix = "Plancher, scan {$scan}".($details['scan'] === 'pause' ? ' (E2)' : '').' : ';
        if ($details['list'] === []) {
            return $prefix.'aucun score atteignable de cote ≤ '.number_format($details['scoreOddsLimit'], 2, '.', '').', aucun pari.';
        }

        $text = $prefix.'liste '.implode(', ', array_column($details['list'], 'score'))
            ." ; total_max {$details['totalMax']} ; plancher ".($details['floor'] > 0 ? '+' : '').$details['floor'];
        if ($details['floor'] < 1) {
            return $text.' : aucun pari.';
        }

        $bets = array_map(
            fn (array $proposal): string => $proposal['bet'].' @'.AlertMessageFormatter::odds($proposal['odds']).($proposal['lowValue'] ? ' (valeur faible)' : ''),
            $details['proposals'],
        );
        $skipped = array_map(fn (array $item): string => "{$item['bet']} ({$item['reason']})", $details['skipped']);

        return $text.' ; '.($bets === [] ? 'aucun pari' : 'paris '.implode(', ', $bets))
            .($skipped === [] ? '' : ' ; écartés : '.implode(', ', $skipped)).'.';
    }

    /**
     * @param  array<string, int|float|bool|array|string|null>  $settings
     */
    private function enabled(array $settings, string $key): bool
    {
        return ($settings[$key] ?? true) !== false;
    }

    /**
     * @param  array<string, int|float|bool|array|string|null>  $settings
     */
    private function minute(array $settings, string $key, int $default): int
    {
        return is_int($settings[$key] ?? null) ? $settings[$key] : $default;
    }

    /**
     * @param  array<string, int|float|bool|array|string|null>  $settings
     */
    private function decimal(array $settings, string $key, float $default): float
    {
        $value = $settings[$key] ?? null;

        return is_int($value) || is_float($value) ? (float) $value : $default;
    }
}
