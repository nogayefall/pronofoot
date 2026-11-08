<?php

namespace App\Jobs;

use App\Models\Alert;
use App\Notifications\NotificationDeliveryFailed;
use App\Notifications\NotificationDispatcher;
use App\Notifications\NotificationMessage;
use Carbon\CarbonImmutable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Throwable;

final class SendAlertNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public array $backoff = [10, 30];

    public function __construct(public readonly int $alertId) {}

    public function handle(NotificationDispatcher $dispatcher): void
    {
        $alert = Alert::query()->findOrFail($this->alertId);
        if ($alert->status !== 'queued') {
            return;
        }

        if ($alert->expires_at !== null && CarbonImmutable::instance($alert->expires_at)->lessThanOrEqualTo(CarbonImmutable::now())) {
            $alert->forceFill(['status' => 'expired'])->save();

            return;
        }

        $receipt = $dispatcher->send(new NotificationMessage(
            body: $alert->message,
            alertId: $alert->id,
        ));

        $alert->forceFill([
            'channel' => $receipt->channel,
            'status' => 'sent',
            'sent_at' => CarbonImmutable::now(),
            'fallback_used' => $receipt->fallbackUsed,
            'failure_reason' => null,
        ])->save();
    }

    public function failed(?Throwable $exception): void
    {
        $alert = Alert::query()->find($this->alertId);
        if ($alert === null || $alert->status !== 'queued') {
            return;
        }

        $alert->forceFill([
            'status' => 'failed',
            'failure_reason' => $exception instanceof NotificationDeliveryFailed
                ? $exception->getMessage()
                : 'L’envoi de la notification a échoué après plusieurs tentatives.',
        ])->save();
    }
}
