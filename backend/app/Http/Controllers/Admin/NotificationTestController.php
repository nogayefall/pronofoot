<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Notifications\NotificationDeliveryFailed;
use App\Notifications\NotificationDispatcher;
use App\Notifications\NotificationMessage;
use Illuminate\Http\JsonResponse;

final class NotificationTestController extends Controller
{
    public function __invoke(NotificationDispatcher $dispatcher): JsonResponse
    {
        try {
            $receipt = $dispatcher->send(new NotificationMessage(
                body: 'Test PronoFoot : le canal de notification est configuré. Aucun pari n’est placé.',
                isTest: true,
            ));
        } catch (NotificationDeliveryFailed $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
                'simulation' => config('services.pronofoot.notifications.mode') === 'fake',
            ], 503);
        }

        return response()->json([
            'message' => 'Message de test traité.',
            'channel' => $receipt->channel,
            'fallbackUsed' => $receipt->fallbackUsed,
            'simulation' => $receipt->simulation,
        ]);
    }
}
