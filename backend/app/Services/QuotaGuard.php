<?php

namespace App\Services;

final class QuotaGuard
{
    /**
     * Le quota est atteint lorsqu’il est nul, ou strictement inférieur au seuil d’alerte s’il est configuré.
     * Un quota inconnu n’arrête pas le scan ; un seuil absent (à confirmer par le client) n’ajoute aucune limite.
     */
    public static function reached(?int $requestsRemaining, ?int $quotaAlertThreshold): bool
    {
        if ($requestsRemaining === null) {
            return false;
        }

        return $requestsRemaining <= 0
            || ($quotaAlertThreshold !== null && $requestsRemaining < $quotaAlertThreshold);
    }

    public static function message(?int $requestsRemaining, ?int $quotaAlertThreshold): string
    {
        return $quotaAlertThreshold === null
            ? "Quota API-Football épuisé ({$requestsRemaining} requête restante) : scan arrêté."
            : "Quota API-Football sous le seuil d’alerte ({$requestsRemaining} < {$quotaAlertThreshold}) : scan arrêté.";
    }
}
