<?php

namespace App\Notifications;

use InvalidArgumentException;

final class NotificationChannelFactory
{
    public function make(string $channel): NotificationChannel
    {
        if ($channel === 'log') {
            return new LogNotificationChannel;
        }

        if (! in_array($channel, ['whatsapp', 'telegram'], true)) {
            throw new InvalidArgumentException('Le canal de notification doit être log, whatsapp ou telegram.');
        }

        return match (config('services.pronofoot.notifications.mode', 'fake')) {
            'fake' => new FakeNotificationChannel($channel),
            'real' => new UnverifiedNotificationChannel($channel),
            default => throw new InvalidArgumentException('NOTIFICATION_MODE doit être « fake » ou « real ».'),
        };
    }
}
