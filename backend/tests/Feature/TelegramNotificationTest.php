<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\AlertMessageFormatter;
use App\Notifications\NotificationDeliveryFailed;
use App\Notifications\NotificationDispatcher;
use App\Notifications\NotificationMessage;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Sleep;
use Tests\TestCase;

class TelegramNotificationTest extends TestCase
{
    use RefreshDatabase;

    private const TOKEN = '123456789:AAH-jeton-secret-de-test';

    private const CHAT_ID = '987654321';

    protected function setUp(): void
    {
        parent::setUp();
        Sleep::fake();
        Http::preventStrayRequests();
        config([
            'services.pronofoot.notifications.mode' => 'real',
            'services.pronofoot.notifications.channel' => 'telegram',
            'services.pronofoot.notifications.fallback' => 'none',
            'services.telegram.bot_token' => self::TOKEN,
            'services.telegram.chat_id' => self::CHAT_ID,
            'services.telegram.base_url' => 'https://api.telegram.org',
            'services.telegram.timeout' => 10,
            'services.telegram.retries' => 2,
            'services.telegram.retry_delay_ms' => 1000,
        ]);
    }

    public function test_a_message_is_sent_with_send_message(): void
    {
        Http::fake(['api.telegram.org/*' => Http::response(['ok' => true, 'result' => ['message_id' => 1]])]);

        $receipt = app(NotificationDispatcher::class)->send(new NotificationMessage('ALERTE CRITIQUE'));

        $this->assertSame('telegram', $receipt->channel);
        $this->assertFalse($receipt->simulation);
        $this->assertFalse($receipt->fallbackUsed);
        Http::assertSentCount(1);
        Http::assertSent(fn (Request $request): bool => $request->method() === 'POST'
            && $request->url() === 'https://api.telegram.org/bot'.self::TOKEN.'/sendMessage'
            && $request['chat_id'] === self::CHAT_ID
            && $request['text'] === 'ALERTE CRITIQUE'
            && $request['disable_web_page_preview'] === true);
    }

    public function test_an_invalid_token_fails_without_retry_and_without_revealing_secrets(): void
    {
        Http::fake(['api.telegram.org/*' => Http::response(['ok' => false, 'error_code' => 401, 'description' => 'Unauthorized'], 401)]);
        Log::spy();

        $message = $this->failureMessage();

        $this->assertStringContainsString('Jeton du robot Telegram invalide (401)', $message);
        $this->assertSecretsAbsent($message);
        Http::assertSentCount(1);
        Log::shouldHaveReceived('warning')->withArgs(fn (string $text, array $context): bool => ! str_contains($text.json_encode($context), self::TOKEN)
            && ! str_contains($text.json_encode($context), self::CHAT_ID));
    }

    public function test_an_unknown_conversation_is_explained(): void
    {
        Http::fake(['api.telegram.org/*' => Http::response(['ok' => false, 'error_code' => 400, 'description' => 'Bad Request: chat not found'], 400)]);

        $message = $this->failureMessage();

        $this->assertStringContainsString('Conversation Telegram introuvable', $message);
        $this->assertSecretsAbsent($message);
    }

    public function test_a_network_failure_is_retried_then_reported_without_the_url(): void
    {
        Http::fake(fn () => throw new ConnectionException('cURL error 28: Operation timed out for https://api.telegram.org/bot'.self::TOKEN.'/sendMessage'));

        $message = $this->failureMessage();

        $this->assertStringContainsString('Échec de connexion à Telegram', $message);
        $this->assertSecretsAbsent($message);
        Sleep::assertSleptTimes(2);
    }

    public function test_the_rate_limit_waits_for_retry_after_then_succeeds(): void
    {
        Http::fakeSequence()
            ->push(['ok' => false, 'error_code' => 429, 'description' => 'Too Many Requests: retry after 2', 'parameters' => ['retry_after' => 2]], 429)
            ->push(['ok' => true, 'result' => ['message_id' => 2]]);

        $receipt = app(NotificationDispatcher::class)->send(new NotificationMessage('Message'));

        $this->assertSame('telegram', $receipt->channel);
        Http::assertSentCount(2);
        Sleep::assertSequence([Sleep::for(2000)->milliseconds()]);
    }

    public function test_a_rate_limit_longer_than_the_cap_fails_immediately(): void
    {
        Http::fake(['api.telegram.org/*' => Http::response(['ok' => false, 'error_code' => 429, 'parameters' => ['retry_after' => 60]], 429)]);

        $this->assertStringContainsString('Limite d’envoi Telegram atteinte (429) : réessayez dans 60 s', $this->failureMessage());
        Http::assertSentCount(1);
    }

    public function test_missing_configuration_is_reported_before_any_call(): void
    {
        config(['services.telegram.bot_token' => '']);

        $this->assertStringContainsString('TELEGRAM_BOT_TOKEN et TELEGRAM_CHAT_ID', $this->failureMessage());
        Http::assertNothingSent();
    }

    public function test_a_telegram_failure_falls_back_to_the_log_channel(): void
    {
        config(['services.pronofoot.notifications.fallback' => 'log']);
        Http::fake(['api.telegram.org/*' => Http::response(['ok' => false, 'description' => 'Unauthorized'], 401)]);

        $receipt = app(NotificationDispatcher::class)->send(new NotificationMessage('Alerte'));

        $this->assertSame('log', $receipt->channel);
        $this->assertTrue($receipt->fallbackUsed);
    }

    public function test_the_settings_button_sends_a_real_test_message_and_reports_success_or_error(): void
    {
        $this->actingAs(User::factory()->create(['is_admin' => true]));
        Http::fakeSequence()
            ->push(['ok' => true, 'result' => ['message_id' => 3]])
            ->push(['ok' => false, 'description' => 'Unauthorized'], 401);

        $this->postJson(route('admin.notifications.test'))
            ->assertOk()
            ->assertJsonPath('ok', true)
            ->assertJsonPath('channel', 'telegram')
            ->assertJsonPath('message', 'Message de test envoyé sur Telegram. Vérifiez sa réception sur votre téléphone.');
        Http::assertSent(fn (Request $request): bool => str_contains((string) $request['text'], 'TEST PRONOFOOT'));

        $error = $this->postJson(route('admin.notifications.test'))->assertStatus(503)->assertJsonPath('ok', false);
        $this->assertStringContainsString('Jeton du robot Telegram invalide', $error->json('message'));
        $this->assertSecretsAbsent($error->getContent());
    }

    public function test_alert_message_follows_the_cdc_example_without_promising_gains(): void
    {
        $message = (new AlertMessageFormatter)->opportunity(
            homeTeam: 'Équipe A',
            awayTeam: 'Équipe B',
            homeScore: 0,
            awayScore: 0,
            minute: 34,
            level: 'Haute',
            rule: 'F121-C',
            target: 'Équipe A',
            bet: 'Prochain but',
            oddsLines: ['Cote suggérée (1-0)' => 8.6],
            gap: 0.4,
            vitality: 61.0,
            trend: 0.0,
            expiresAt: CarbonImmutable::parse('2026-11-15 21:15'),
        );

        $this->assertSame(implode("\n", [
            'ALERTE HAUTE · valable jusqu’à 21:15',
            'Équipe A - Équipe B  0-0  34\'',
            'Prochain but : Équipe A',
            'Cote suggérée (1-0) : 8.60 | Écart : +0.40',
            'Vitalité : 61/100 | Tendance : stable',
            'Règle : F121-C',
            AlertMessageFormatter::DISCLAIMER,
        ]), $message);
        $this->assertStringContainsString('sans garantie de gain', $message);
        $this->assertLessThan(400, mb_strlen($message), 'Message court, lisible sur téléphone.');

        $formatter = new AlertMessageFormatter;
        $this->assertStringStartsWith('PARI NEUTRE', $formatter->opportunity('A', 'B', 2, 3, 73, 'Neutre', 'F121-D', null, 'Over 4.5 buts', ['Cote 3-3' => 3.25, 'Cote 2-4' => 7.0], null, null, null, CarbonImmutable::now()));
        $this->assertStringStartsWith('SIGNAL MI-TEMPS', $formatter->opportunity('A', 'B', 1, 0, 45, 'Mi-temps', 'F121-E2', null, 'Over 0.5 buts en 2ème mi-temps', ['Cote Under 2.5' => 1.36], null, null, null, CarbonImmutable::now()));
        $this->assertStringContainsString('ABSTENTION', $formatter->abstention('A', 'B', 0, 0, 20, 'Match mort (vitalité 30/100).'));
        $this->assertStringContainsString('ALERTE EXPIRÉE', $formatter->expired('A', 'B', 'F121-E1', CarbonImmutable::now()));
        $this->assertStringContainsString('analyse relancée', $formatter->goalScored('A', 'B', 0, 2, 0, 3, 50));
        $this->assertStringContainsString('QUOTA API À 10 %', $formatter->quotaEconomy(750, 7500, 10));
    }

    private function failureMessage(): string
    {
        try {
            app(NotificationDispatcher::class)->send(new NotificationMessage('Message'));
        } catch (NotificationDeliveryFailed $exception) {
            return $exception->getMessage();
        }

        $this->fail('Un échec Telegram était attendu.');
    }

    private function assertSecretsAbsent(string $text): void
    {
        $this->assertStringNotContainsString(self::TOKEN, $text);
        $this->assertStringNotContainsString('jeton-secret', $text);
        $this->assertStringNotContainsString(self::CHAT_ID, $text);
    }
}
