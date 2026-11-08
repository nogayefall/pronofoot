<?php

namespace App\Notifications;

final readonly class NotificationReceipt
{
    public function __construct(
        public string $channel,
        public bool $fallbackUsed = false,
        public bool $simulation = false,
    ) {}
}
