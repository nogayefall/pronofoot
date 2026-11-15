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
 * Message d’information à l’administrateur (alerte expirée, but marqué) par le canal configuré, avec repli.
 */
final class SendAdminNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public array $backoff = [10, 30];

    public function __construct(public readonly string $body) {}

    public function handle(NotificationDispatcher $dispatcher): void
    {
        $dispatcher->send(new NotificationMessage(body: $this->body));
    }

    public function failed(?Throwable $exception): void
    {
        Log::error('Échec de l’envoi d’un message d’information.', ['reason' => $exception?->getMessage()]);
    }
}
