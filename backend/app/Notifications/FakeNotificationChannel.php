<?php

namespace App\Notifications;

use Illuminate\Support\Facades\Log;

final class FakeNotificationChannel implements NotificationChannel
{
    public function __construct(private readonly string $channel) {}

    public function send(NotificationMessage $message): NotificationReceipt
    {
        $failChannels = config('services.pronofoot.notifications.fake_fail_channels', []);
        if (is_array($failChannels) && in_array($this->channel, $failChannels, true)) {
            throw new NotificationDeliveryFailed("Échec simulé du canal {$this->channel}.");
        }

        Log::channel('single')->info('PronoFoot notification (simulation).', [
            'alert_id' => $message->alertId,
            'channel' => $this->channel,
            'is_test' => $message->isTest,
            'message' => $message->body,
        ]);

        return new NotificationReceipt($this->channel, simulation: true);
    }
}
