<?php

namespace App\Notifications;

final class UnverifiedNotificationChannel implements NotificationChannel
{
    public function __construct(private readonly string $channel) {}

    public function send(NotificationMessage $message): NotificationReceipt
    {
        throw new NotificationDeliveryFailed(
            "Le canal réel {$this->channel} est NON VÉRIFIÉ ; aucun appel ni format de message n’a été utilisé.",
        );
    }
}
