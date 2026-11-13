<?php

namespace App\Jobs;

use App\Notifications\NotificationDispatcher;
use App\Notifications\NotificationMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Alerte de quota envoyée par le canal de notification configuré (WhatsApp, Telegram en repli).
 * L’envoi par e-mail est hors périmètre tant que le client n’a pas donné d’adresse.
 */
final class SendQuotaNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public array $backoff = [10, 30];

    public function __construct(public readonly string $body) {}

    public function handle(NotificationDispatcher $dispatcher): void
    {
        $receipt = $dispatcher->send(new NotificationMessage(body: $this->body));

        Log::info('Alerte de quota envoyée.', ['channel' => $receipt->channel, 'fallback_used' => $receipt->fallbackUsed]);
    }

    public function failed(?Throwable $exception): void
    {
        Log::error('Échec de l’envoi de l’alerte de quota.', ['reason' => $exception?->getMessage()]);
    }
}
