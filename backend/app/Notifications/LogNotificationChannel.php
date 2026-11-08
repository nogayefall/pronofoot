<?php

namespace App\Notifications;

use Illuminate\Support\Facades\Log;

final class LogNotificationChannel implements NotificationChannel
{
    public function send(NotificationMessage $message): NotificationReceipt
    {
        Log::channel('single')->info('PronoFoot notification (mode journal).', [
            'alert_id' => $message->alertId,
            'is_test' => $message->isTest,
            'message' => $message->body,
        ]);

        return new NotificationReceipt('log', simulation: true);
    }
}
