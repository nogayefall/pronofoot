<?php

namespace App\Notifications;

use Carbon\CarbonInterface;

/**
 * Messages envoyés à l’administrateur, d’après l’exemple de la section 5 du CDC Phase 1 : courts, en français,
 * lisibles sur téléphone, en texte brut. Aucun message ne promet de gain.
 */
final class AlertMessageFormatter
{
    public const DISCLAIMER = 'Signal de détection, sans garantie de gain. Aucun pari n’est placé.';

    /**
     * @param  string  $level  Critique, Haute, Mi-temps, Neutre (ou un libellé configuré).
     * @param  string|null  $target  Équipe ciblée (prochain but), null pour un pari sur le total de buts.
     * @param  string|null  $bet  Pari suggéré quand il ne porte pas sur une équipe (Over 4.5, Over 0.5 2e MT).
     * @param  array<string, float>  $oddsLines  Cotes à afficher, par libellé (ex. « Cote suggérée (0-3) » => 3.75).
     * @param  list<array<string, mixed>>  $options  Options proposées : ciblée (prochain but d’une équipe) et neutre (un but de plus).
     * @param  bool  $vitalityUnavailable  Match suivi sans statistiques : vitalité non disponible.
     */
    public function opportunity(
        string $homeTeam,
        string $awayTeam,
        ?int $homeScore,
        ?int $awayScore,
        ?int $minute,
        string $level,
        string $rule,
        ?string $target,
        ?string $bet,
        array $oddsLines,
        ?float $gap,
        ?float $vitality,
        ?float $trend,
        CarbonInterface $expiresAt,
        ?float $confidence = null,
        array $options = [],
        bool $vitalityUnavailable = false,
    ): string {
        $lines = [
            $this->levelTitle($level).' · valable jusqu’à '.$expiresAt->format('H:i'),
            $this->matchLine($homeTeam, $awayTeam, $homeScore, $awayScore, $minute),
            $target !== null ? "Prochain but : {$target}" : 'Pari : '.($bet ?? 'non précisé'),
        ];

        $odds = [];
        foreach ($oddsLines as $label => $value) {
            $odds[] = "{$label} : ".$this->decimal($value);
        }
        if ($target !== null) {
            $odds[] = 'Écart : '.($gap === null ? 'n.c.' : $this->signed($gap, 2));
        }
        if ($odds !== []) {
            $lines[] = implode(' | ', $odds);
        }

        array_push($lines, ...$this->optionLines($options, $homeTeam, $awayTeam));

        if ($target !== null || $vitality !== null || $vitalityUnavailable) {
            $lines[] = 'Vitalité : '.($vitalityUnavailable ? 'non disponible (statistiques non couvertes)' : ($vitality === null ? 'n.c.' : number_format($vitality, 0).'/100'))
                .' | Tendance : '.$this->trend($trend);
        }

        $lines[] = "Règle : {$rule}".($confidence === null ? '' : ' | Confiance : '.number_format($confidence, 0).' %');
        $lines[] = self::DISCLAIMER;

        return implode("\n", $lines);
    }

    public function abstention(string $homeTeam, string $awayTeam, ?int $homeScore, ?int $awayScore, ?int $minute, string $reason): string
    {
        return implode("\n", [
            'ABSTENTION',
            $this->matchLine($homeTeam, $awayTeam, $homeScore, $awayScore, $minute),
            "Motif : {$reason}",
            'Aucune alerte pour ce match à ce stade.',
        ]);
    }

    public function expired(string $homeTeam, string $awayTeam, string $rule, CarbonInterface $expiredAt): string
    {
        return implode("\n", [
            'ALERTE EXPIRÉE',
            "{$homeTeam} - {$awayTeam}",
            "L’alerte {$rule} n’est plus valable depuis ".$expiredAt->format('H:i').' : aucun but pendant sa durée de validité.',
        ]);
    }

    public function goalScored(string $homeTeam, string $awayTeam, int $previousHome, int $previousAway, int $homeScore, int $awayScore, ?int $minute): string
    {
        return implode("\n", [
            'BUT MARQUÉ · analyse relancée',
            "{$homeTeam} - {$awayTeam}  {$previousHome}-{$previousAway} → {$homeScore}-{$awayScore}".($minute === null ? '' : "  {$minute}'"),
            'L’alerte en cours sur ce match est annulée. Le match est réanalysé.',
        ]);
    }

    public function quotaEconomy(int $remaining, int $limit, float $percent): string
    {
        $percentLabel = rtrim(rtrim(number_format($percent, 2, ',', ''), '0'), ',');

        return implode("\n", [
            "QUOTA API À {$percentLabel} %",
            "{$remaining} requêtes restantes sur {$limit} aujourd’hui.",
            'Mode économie : seuls les matchs chauds sont scannés.',
        ]);
    }

    public function test(string $channel): string
    {
        return implode("\n", [
            'TEST PRONOFOOT',
            'Le canal '.ucfirst($channel).' fonctionne : les alertes arriveront ici.',
            'Aucun pari n’est placé.',
        ]);
    }

    /**
     * Lignes des options : deux options (ciblée puis neutre) si une seule équipe est en signal, option neutre seule
     * si les deux équipes le sont. Aucune option n’est jouée automatiquement.
     *
     * @param  list<array<string, mixed>>  $options
     * @return list<string>
     */
    private function optionLines(array $options, string $homeTeam, string $awayTeam): array
    {
        if ($options === []) {
            return [];
        }

        $odds = fn (array $option): string => is_numeric($option['odds'] ?? null) ? 'cote '.$this->decimal((float) $option['odds']) : 'cote non disponible';
        $text = function (array $option) use ($odds, $homeTeam, $awayTeam): string {
            if (($option['type'] ?? null) === 'neutral') {
                return 'un but de plus dans le match — '.$option['line'].', '.$odds($option);
            }

            $team = ($option['side'] ?? null) === 'home' ? $homeTeam : $awayTeam;
            $gap = is_numeric($option['gap'] ?? null) ? ', écart '.$this->signed((float) $option['gap'], 2) : '';

            return "prochain but {$team} — score {$option['scoreKey']}, ".$odds($option).$gap;
        };

        if (count($options) === 1 && ($options[0]['type'] ?? null) === 'neutral') {
            return array_values(array_filter([
                'Option neutre seule : '.$text($options[0]),
                ($options[0]['origin'] ?? null) === 'both_sides' ? 'Les deux équipes donnent un signal : pas d’équipe désignée.' : null,
                'Aucune option n’est jouée automatiquement.',
            ]));
        }

        $lines = [];
        foreach ($options as $index => $option) {
            $lines[] = 'Option '.($index + 1).' ('.(($option['type'] ?? null) === 'neutral' ? 'neutre' : 'ciblée').') : '.$text($option);
        }
        $lines[] = 'Aucune option n’est jouée automatiquement.';

        return $lines;
    }

    private function levelTitle(string $level): string
    {
        return match ($level) {
            'Critique' => 'ALERTE CRITIQUE',
            'Haute' => 'ALERTE HAUTE',
            'Mi-temps' => 'SIGNAL MI-TEMPS',
            'Neutre' => 'PARI NEUTRE',
            default => 'ALERTE '.mb_strtoupper($level),
        };
    }

    private function matchLine(string $homeTeam, string $awayTeam, ?int $homeScore, ?int $awayScore, ?int $minute): string
    {
        $score = $homeScore === null || $awayScore === null ? '?-?' : "{$homeScore}-{$awayScore}";

        return "{$homeTeam} - {$awayTeam}  {$score}".($minute === null ? '' : "  {$minute}'");
    }

    private function decimal(float $value): string
    {
        return number_format($value, 2, '.', '');
    }

    private function signed(float $value, int $decimals): string
    {
        return ($value > 0 ? '+' : '').number_format($value, $decimals, '.', '');
    }

    private function trend(?float $trend): string
    {
        return match (true) {
            $trend === null => 'n.c.',
            abs($trend) < 0.05 => 'stable',
            default => $this->signed($trend, 1).' %',
        };
    }
}
