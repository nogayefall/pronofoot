<?php

namespace App\Notifications;

use Illuminate\Support\Facades\Log;

final class NotificationDispatcher
{
    public function __construct(private readonly NotificationChannelFactory $channels) {}

    public function send(NotificationMessage $message): NotificationReceipt
    {
        $primary = (string) config('services.pronofoot.notifications.channel', 'log');
        $fallback = (string) config('services.pronofoot.notifications.fallback', 'none');

        try {
            return $this->channels->make($primary)->send($message);
        } catch (NotificationDeliveryFailed $primaryFailure) {
            if ($fallback === 'none' || $fallback === '' || $fallback === $primary) {
                throw $primaryFailure;
            }

            Log::warning('Canal de notification principal indisponible ; tentative du canal de repli.', [
                'channel' => $primary,
                'reason' => $primaryFailure->getMessage(),
            ]);

            try {
                $receipt = $this->channels->make($fallback)->send($message);
            } catch (NotificationDeliveryFailed $fallbackFailure) {
                throw new NotificationDeliveryFailed(
                    "Échec du canal principal {$primary} et du canal de repli {$fallback}.",
                    previous: $fallbackFailure,
                );
            }

            return new NotificationReceipt($receipt->channel, fallbackUsed: true, simulation: $receipt->simulation);
        }
    }
}
