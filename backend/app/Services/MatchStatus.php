<?php

namespace App\Services;

use App\Providers\Data\FootballMatch;

/**
 * Fin de match d’après le statut API-Football (code court), jamais d’après la minute : le temps additionnel (90'+)
 * et les prolongations ne terminent pas un match.
 *  - Terminé : FT, AET, PEN, PST, CANC, ABD, AWD, WO.
 *  - En jeu : 1H, HT, 2H, ET, BT, P, SUSP, INT, LIVE. La séance de tirs au but (P) n’est pas analysée.
 */
final class MatchStatus
{
    public const FINISHED = ['FT', 'AET', 'PEN', 'PST', 'CANC', 'ABD', 'AWD', 'WO'];

    public const IN_PLAY = ['1H', 'HT', '2H', 'ET', 'BT', 'P', 'SUSP', 'INT', 'LIVE'];

    public const PENALTIES = 'P';

    private const LABELS = [
        'FT' => 'terminé',
        'AET' => 'terminé après prolongation',
        'PEN' => 'terminé aux tirs au but',
        'PST' => 'reporté',
        'CANC' => 'annulé',
        'ABD' => 'abandonné',
        'AWD' => 'défaite technique',
        'WO' => 'forfait',
    ];

    public static function code(FootballMatch $match): ?string
    {
        $code = $match->statusShort === null ? null : strtoupper(trim($match->statusShort));

        return $code === '' ? null : $code;
    }

    public static function isFinished(?string $code): bool
    {
        return $code !== null && in_array($code, self::FINISHED, true);
    }

    public static function isPenaltyShootout(?string $code): bool
    {
        return $code === self::PENALTIES;
    }

    /**
     * Libellé français d’un statut de fin : « terminé (FT) », « reporté (PST) »…
     */
    public static function endLabel(string $code): string
    {
        return (self::LABELS[$code] ?? 'terminé')." ({$code})";
    }
}
