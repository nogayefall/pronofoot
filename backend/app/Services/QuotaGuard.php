<?php

namespace App\Services;

/**
 * États du quota API selon l’annexe Phase 1 corrigée : normal, économie (requêtes restantes ≤ pourcentage du quota
 * journalier) et épuisé (0 requête). Un quota ou une limite inconnus ne déclenchent aucun changement d’état.
 */
final class QuotaGuard
{
    public const NORMAL = 'normal';

    public const ECONOMY = 'economy';

    public const EXHAUSTED = 'exhausted';

    public const EXHAUSTED_MESSAGE = 'Quota épuisé. Le live est arrêté. Rechargez le quota.';

    /**
     * Arrêt des appels : quota nul, ou inférieur au seuil s’il est fourni.
     */
    public static function reached(?int $requestsRemaining, ?int $quotaAlertThreshold = null): bool
    {
        if ($requestsRemaining === null) {
            return false;
        }

        return $requestsRemaining <= 0
            || ($quotaAlertThreshold !== null && $requestsRemaining < $quotaAlertThreshold);
    }

    public static function message(?int $requestsRemaining, ?int $quotaAlertThreshold = null): string
    {
        return $quotaAlertThreshold === null
            ? self::EXHAUSTED_MESSAGE
            : "Quota API-Football sous le seuil ({$requestsRemaining} < {$quotaAlertThreshold}) : appels arrêtés.";
    }

    public static function mode(?int $requestsRemaining, ?int $requestsLimit, float $economyPercent): string
    {
        if ($requestsRemaining === null) {
            return self::NORMAL;
        }

        if ($requestsRemaining <= 0) {
            return self::EXHAUSTED;
        }

        if ($requestsLimit !== null && $requestsLimit > 0
            && $requestsRemaining <= $requestsLimit * $economyPercent / 100) {
            return self::ECONOMY;
        }

        return self::NORMAL;
    }

    public static function economyMessage(int $requestsRemaining, int $requestsLimit, float $economyPercent): string
    {
        $percent = rtrim(rtrim(number_format($economyPercent, 2, ',', ''), '0'), ',');

        return "Alerte quota API : {$requestsRemaining} requêtes restantes sur {$requestsLimit} ({$percent} % ou moins). Mode économie : seuls les matchs chauds sont scannés.";
    }
}
