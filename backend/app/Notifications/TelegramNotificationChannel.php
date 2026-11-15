<?php

namespace App\Notifications;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Sleep;
use Throwable;

/**
 * Envoi réel par l’API Bot de Telegram (méthode sendMessage), en texte brut.
 *
 * Délai maximal par requête, nouvelles tentatives sur coupure réseau, limite d’envoi (429) et erreur serveur (5xx).
 * Le jeton du robot et l’identifiant de conversation n’apparaissent jamais dans les messages d’erreur ni dans les
 * journaux : les exceptions du client HTTP (dont le message contient l’URL, donc le jeton) ne sont jamais propagées.
 */
final class TelegramNotificationChannel implements NotificationChannel
{
    /**
     * Attente maximale acceptée quand Telegram demande de patienter (retry_after), en secondes.
     */
    private const MAX_RETRY_AFTER_SECONDS = 5;

    public function send(NotificationMessage $message): NotificationReceipt
    {
        $token = trim((string) config('services.telegram.bot_token'));
        $chatId = trim((string) config('services.telegram.chat_id'));
        if ($token === '' || $chatId === '') {
            throw new NotificationDeliveryFailed('Telegram non configuré : renseignez TELEGRAM_BOT_TOKEN et TELEGRAM_CHAT_ID dans .env.');
        }

        $baseUrl = rtrim((string) config('services.telegram.base_url', 'https://api.telegram.org'), '/');
        if (parse_url($baseUrl, PHP_URL_SCHEME) !== 'https') {
            throw new NotificationDeliveryFailed('TELEGRAM_API_BASE_URL doit utiliser HTTPS.');
        }

        $attempts = 1 + max(0, (int) config('services.telegram.retries', 2));
        $delayMs = max(0, (int) config('services.telegram.retry_delay_ms', 1000));
        $failure = 'Échec de l’envoi Telegram.';

        for ($attempt = 1; $attempt <= $attempts; $attempt++) {
            try {
                $response = Http::acceptJson()
                    ->asJson()
                    ->timeout(max(1, (int) config('services.telegram.timeout', 10)))
                    ->connectTimeout(5)
                    ->post("{$baseUrl}/bot{$token}/sendMessage", [
                        'chat_id' => $chatId,
                        'text' => $message->body,
                        'disable_web_page_preview' => true,
                    ]);
            } catch (ConnectionException) {
                $failure = 'Échec de connexion à Telegram (réseau indisponible ou délai dépassé).';
                $this->pauseBeforeRetry($attempt, $attempts, $delayMs);

                continue;
            } catch (Throwable $exception) {
                throw new NotificationDeliveryFailed('Erreur inattendue pendant l’envoi Telegram ('.class_basename($exception).').');
            }

            if ($response->successful() && $response->json('ok') === true) {
                return new NotificationReceipt('telegram');
            }

            [$failure, $retryable, $waitSeconds] = $this->describe($response);
            if (! $retryable) {
                break;
            }

            if ($waitSeconds !== null && $waitSeconds > self::MAX_RETRY_AFTER_SECONDS) {
                break;
            }

            $this->pauseBeforeRetry($attempt, $attempts, $waitSeconds === null ? $delayMs : $waitSeconds * 1000);
        }

        Log::warning('Envoi Telegram impossible.', ['reason' => $failure, 'alert_id' => $message->alertId]);

        throw new NotificationDeliveryFailed($failure);
    }

    /**
     * Traduit la réponse d’erreur de Telegram sans reprendre le jeton ni l’identifiant de conversation.
     *
     * @return array{0: string, 1: bool, 2: int|null} Motif, nouvelle tentative utile, attente demandée (secondes).
     */
    private function describe(Response $response): array
    {
        $status = $response->status();
        $description = strtolower((string) $response->json('description', ''));

        return match (true) {
            $status === 401 => ['Jeton du robot Telegram invalide (401) : vérifiez TELEGRAM_BOT_TOKEN.', false, null],
            $status === 400 && str_contains($description, 'chat not found') => ['Conversation Telegram introuvable (400) : vérifiez TELEGRAM_CHAT_ID et envoyez d’abord un message au robot.', false, null],
            $status === 403 => ['Le robot ne peut pas écrire dans cette conversation (403) : il a été bloqué ou retiré.', false, null],
            $status === 429 => [
                'Limite d’envoi Telegram atteinte (429) : réessayez dans '.((int) $response->json('parameters.retry_after', 1)).' s.',
                true,
                max(1, (int) $response->json('parameters.retry_after', 1)),
            ],
            $status >= 500 => ["Telegram est temporairement indisponible ({$status}).", true, null],
            default => ["Telegram a refusé le message ({$status}).", false, null],
        };
    }

    private function pauseBeforeRetry(int $attempt, int $attempts, int $delayMs): void
    {
        if ($attempt < $attempts && $delayMs > 0) {
            Sleep::for($delayMs)->milliseconds();
        }
    }
}
