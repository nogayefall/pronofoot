<?php

namespace App\Notifications;

interface NotificationChannel
{
    public function send(NotificationMessage $message): NotificationReceipt;
}
