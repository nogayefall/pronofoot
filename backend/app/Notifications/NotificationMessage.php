<?php

namespace App\Notifications;

final readonly class NotificationMessage
{
    public function __construct(
        public string $body,
        public bool $isTest = false,
        public ?int $alertId = null,
    ) {}
}
