<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Notifications\AlertMessageFormatter;
use App\Notifications\NotificationDeliveryFailed;
use App\Notifications\NotificationDispatcher;
use App\Notifications\NotificationMessage;
use Illuminate\Http\JsonResponse;

/**
 * Bouton « Envoyer un message de test » : envoie un vrai message par le canal configuré (repli compris) et renvoie
 * un résultat lisible. Les messages d’erreur ne contiennent ni jeton ni identifiant de conversation.
 */
final class NotificationTestController extends Controller
{
    public function __invoke(NotificationDispatcher $dispatcher, AlertMessageFormatter $formatter): JsonResponse
    {
        $channel = (string) config('services.pronofoot.notifications.channel', 'log');
        $fallback = (string) config('services.pronofoot.notifications.fallback', 'none');

        try {
            $receipt = $dispatcher->send(new NotificationMessage(body: $formatter->test($channel), isTest: true));
        } catch (NotificationDeliveryFailed $exception) {
            return response()->json([
                'ok' => false,
                'message' => $exception->getMessage(),
                'channel' => $channel,
                'simulation' => config('services.pronofoot.notifications.mode') === 'fake',
            ], 503);
        }

        $message = match (true) {
            $receipt->fallbackUsed => "Le canal {$channel} a échoué ; le message a été traité par le canal de repli {$receipt->channel}. Consultez le journal Laravel pour le motif.",
            $receipt->simulation && $receipt->channel === 'log' => 'Message écrit dans le journal Laravel (canal « log ») : rien n’a été envoyé sur un téléphone.',
            $receipt->simulation => "Simulation (NOTIFICATION_MODE=fake) : aucun message réel n’a été envoyé sur {$receipt->channel}.",
            default => 'Message de test envoyé sur '.ucfirst($receipt->channel).'. Vérifiez sa réception sur votre téléphone.',
        };

        return response()->json([
            'ok' => true,
            'message' => $message,
            'channel' => $receipt->channel,
            'fallback' => $fallback,
            'fallbackUsed' => $receipt->fallbackUsed,
            'simulation' => $receipt->simulation,
        ]);
    }
}
