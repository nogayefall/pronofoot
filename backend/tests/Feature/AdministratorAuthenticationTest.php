<?php

namespace Tests\Feature;

use App\Console\Commands\CreateTestAdministrator;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AdministratorAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    private const string TEST_TOTP_SECRET = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';

    public function test_public_pages_redirect_to_the_login_and_admin_pages_require_authentication(): void
    {
        $this->get('/')->assertRedirect(route('login'));
        $this->get('/admin')->assertRedirect(route('login'));
        $this->get('/login')
            ->assertOk()
            ->assertSee('Code d’authentification');
    }

    public function test_local_test_administrator_can_sign_in_with_only_email_and_password(): void
    {
        $this->useLocalEnvironment();
        $user = $this->createAdministrator([
            'email' => CreateTestAdministrator::EMAIL,
        ]);

        $this->get('/login')
            ->assertOk()
            ->assertSee('Le compte de test local utilise uniquement son adresse courriel et son mot de passe.');

        $this->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'Correct-Horse-Battery-42',
        ])->assertRedirect(route('admin.dashboard'));

        $this->assertAuthenticatedAs($user);
    }

    public function test_other_administrators_still_require_totp_in_local_environment(): void
    {
        $this->useLocalEnvironment();
        $user = $this->createAdministrator();

        $this->from('/login')->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'Correct-Horse-Battery-42',
        ])->assertRedirect('/login')->assertSessionHasErrors('credentials');

        $this->assertGuest();
    }

    public function test_administrator_must_provide_password_and_valid_totp_to_sign_in(): void
    {
        $user = $this->createAdministrator();
        $code = $this->totpCode(self::TEST_TOTP_SECRET, time());

        $response = $this->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'Correct-Horse-Battery-42',
            'authenticator_code' => $code,
        ]);

        $response->assertRedirect(route('admin.dashboard'));
        $this->assertAuthenticatedAs($user);
        $this->get('/admin')
            ->assertOk()
            ->assertSee('data-admin-name="Administrateur de test"', false)
            ->assertSee('admin-assets/app.css', false)
            ->assertSee('admin-assets/app.js', false)
            ->assertDontSee('localhost:8000/admin-assets', false)
            ->assertSee('Chargement de l’interface PronoFoot');
    }

    public function test_dashboard_loads_vite_client_url_when_development_server_is_running(): void
    {
        $this->app->detectEnvironment(fn () => 'local');
        $user = $this->createAdministrator();
        $hotFile = public_path('admin-assets/hot');
        $originalHotFile = is_file($hotFile) ? file_get_contents($hotFile) : null;

        if (! is_dir(dirname($hotFile))) {
            mkdir(dirname($hotFile), 0777, true);
        }

        file_put_contents($hotFile, "http://127.0.0.1:5173\n");

        try {
            $this->actingAs($user)
                ->get('/admin')
                ->assertOk()
                ->assertSee('src="http://127.0.0.1:5173/@vite/client"', false)
                ->assertSee('injectIntoGlobalHook(window)', false)
                ->assertSee('http://127.0.0.1:5173/@react-refresh', false)
                ->assertSee('src="http://127.0.0.1:5173/src/main.jsx"', false);
        } finally {
            if ($originalHotFile === null) {
                unlink($hotFile);
            } else {
                file_put_contents($hotFile, $originalHotFile);
            }
        }
    }

    public function test_invalid_password_or_authenticator_code_does_not_authenticate(): void
    {
        $user = $this->createAdministrator();

        $this->from('/login')->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'incorrect-password',
            'authenticator_code' => '000000',
        ])->assertRedirect('/login')->assertSessionHasErrors('credentials');

        $this->assertGuest();
    }

    public function test_non_administrator_accounts_cannot_open_admin_pages(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($user)
            ->get('/admin')
            ->assertForbidden();
    }

    public function test_failed_login_attempts_are_limited(): void
    {
        $user = $this->createAdministrator();

        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->from('/login')->post(route('login.store'), [
                'email' => $user->email,
                'password' => 'incorrect-password',
                'authenticator_code' => '000000',
            ])->assertRedirect('/login');
        }

        $this->from('/login')->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'incorrect-password',
            'authenticator_code' => '000000',
        ])->assertRedirect('/login')->assertSessionHasErrors('credentials');

        $this->assertGuest();
    }

    public function test_logout_invalidates_the_authenticated_session(): void
    {
        $user = $this->createAdministrator();

        $this->actingAs($user)
            ->post(route('logout'))
            ->assertRedirect(route('login'));

        $this->assertGuest();
        $this->get('/admin')->assertRedirect(route('login'));
    }

    public function test_totp_secret_is_encrypted_in_storage_and_hidden_from_serialized_user_data(): void
    {
        $user = $this->createAdministrator();
        $storedSecret = $user->getRawOriginal('totp_secret');

        $this->assertNotSame(self::TEST_TOTP_SECRET, $storedSecret);
        $this->assertSame(self::TEST_TOTP_SECRET, $user->fresh()->totp_secret);
        $this->assertArrayNotHasKey('totp_secret', $user->toArray());
    }

    public function test_manual_rule_simulation_uses_the_rule_engine_without_sending_an_alert(): void
    {
        $this->actingAs($this->createAdministrator())
            ->postJson(route('admin.rule-test'), [
                'home_score' => 0,
                'away_score' => 0,
                'exact_score_odds' => ['0-0' => 7.5, '1-0' => 8.6, '0-1' => 9.8],
                'vitality_score' => 61,
                'odds_change_percent' => -1,
                'tendance_source' => 'cote_suggeree',
                'tendance_seuil_stable' => 3,
            ])
            ->assertOk()
            ->assertJsonPath('rules.F121-C.verdict', 'candidate')
            ->assertJsonPath('rules.F121-C.details.selectedTeam', 'home')
            ->assertJsonPath('filters.gap.passed', true)
            ->assertJsonPath('filters.trend.passed', true)
            ->assertJsonPath('filters.vitality.passed', true)
            ->assertJsonPath('decision.shouldAlert', false)
            ->assertJsonPath('decision.convergenceScore', null)
            ->assertJsonPath('simulationOnly', true);
    }

    public function test_manual_rule_simulation_rejects_vitality_outside_the_documented_range(): void
    {
        $this->actingAs($this->createAdministrator())
            ->postJson(route('admin.rule-test'), [
                'home_score' => 0,
                'away_score' => 0,
                'exact_score_odds' => ['0-0' => 7.5, '1-0' => 8.6, '0-1' => 9.8],
                'vitality_score' => 101,
                'odds_change_percent' => -1,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('vitality_score');
    }

    public function test_manual_rule_simulation_is_protected_by_admin_authentication(): void
    {
        $this->post('/admin/rule-test', [
            'home_score' => 0,
            'away_score' => 0,
            'exact_score_odds' => ['0-0' => 7.5, '1-0' => 8.6, '0-1' => 9.8],
            'vitality_score' => 61,
            'odds_change_percent' => -1,
        ])->assertRedirect(route('login'));
    }

    public function test_notification_test_route_uses_the_configured_fake_fallback(): void
    {
        config([
            'services.pronofoot.notifications.mode' => 'fake',
            'services.pronofoot.notifications.channel' => 'whatsapp',
            'services.pronofoot.notifications.fallback' => 'telegram',
            'services.pronofoot.notifications.fake_fail_channels' => ['whatsapp'],
        ]);

        $this->actingAs($this->createAdministrator())
            ->postJson(route('admin.notifications.test'))
            ->assertOk()
            ->assertJsonPath('channel', 'telegram')
            ->assertJsonPath('fallbackUsed', true)
            ->assertJsonPath('simulation', true);
    }

    public function test_unverified_real_notification_channel_is_refused_without_network_calls(): void
    {
        Http::fake();
        config([
            'services.pronofoot.notifications.mode' => 'real',
            'services.pronofoot.notifications.channel' => 'whatsapp',
            'services.pronofoot.notifications.fallback' => 'none',
        ]);

        $this->actingAs($this->createAdministrator())
            ->postJson(route('admin.notifications.test'))
            ->assertStatus(503)
            ->assertJsonPath('simulation', false)
            ->assertJsonPath('message', 'Le canal réel whatsapp est NON VÉRIFIÉ ; aucun appel ni format de message n’a été utilisé.');

        Http::assertNothingSent();
    }

    public function test_local_test_administrator_cannot_authenticate_outside_local_environment(): void
    {
        $user = $this->createAdministrator([
            'email' => CreateTestAdministrator::EMAIL,
        ]);

        $this->from('/login')->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'Correct-Horse-Battery-42',
            'authenticator_code' => $this->totpCode(self::TEST_TOTP_SECRET, time()),
        ])->assertRedirect('/login')->assertSessionHasErrors('credentials');

        $this->assertGuest();
    }

    public function test_test_administrator_commands_are_rejected_outside_local_environment(): void
    {
        $this->artisan('admin:create-test')
            ->expectsOutput('Cette commande est disponible uniquement avec APP_ENV=local.')
            ->assertExitCode(1);

        $this->artisan('admin:test-code')
            ->expectsOutput('Cette commande est disponible uniquement avec APP_ENV=local.')
            ->assertExitCode(1);

        $this->assertDatabaseMissing('users', ['email' => CreateTestAdministrator::EMAIL]);
    }

    public function test_local_test_administrator_can_be_created_without_an_authenticator_app(): void
    {
        $this->app->detectEnvironment(fn () => 'local');

        $this->artisan('admin:create-test')
            ->expectsOutputToContain(CreateTestAdministrator::EMAIL)
            ->expectsOutputToContain('Mot de passe temporaire :')
            ->expectsOutputToContain('Code à 6 chiffres :')
            ->assertSuccessful();

        $this->assertDatabaseHas('users', [
            'email' => CreateTestAdministrator::EMAIL,
            'is_admin' => true,
        ]);

        $user = User::query()->where('email', CreateTestAdministrator::EMAIL)->firstOrFail();
        $this->assertNotNull($user->totp_secret);
        $this->assertNotNull($user->totp_confirmed_at);

        $this->artisan('admin:test-code')
            ->expectsOutputToContain('Code à 6 chiffres :')
            ->assertSuccessful();
    }

    public function test_local_test_administrator_password_can_be_reset_without_displaying_it(): void
    {
        $this->app->detectEnvironment(fn () => 'local');

        $user = $this->createAdministrator([
            'email' => CreateTestAdministrator::EMAIL,
        ]);

        $this->artisan('admin:test-password-reset')
            ->expectsQuestion('Nouveau mot de passe (12 caractères minimum)', 'New-Private-Password-42')
            ->expectsQuestion('Confirme le nouveau mot de passe', 'New-Private-Password-42')
            ->expectsOutput('Mot de passe du compte de test mis à jour. La valeur n’a pas été affichée.')
            ->assertSuccessful();

        $user->refresh();

        $this->assertTrue(Hash::check('New-Private-Password-42', $user->password));
        $this->assertFalse(Hash::check('Correct-Horse-Battery-42', $user->password));
    }

    public function test_local_test_administrator_password_reset_is_rejected_outside_local_environment(): void
    {
        $this->app->detectEnvironment(fn () => 'testing');

        $this->artisan('admin:test-password-reset')
            ->expectsOutput('Cette commande est disponible uniquement avec APP_ENV=local.')
            ->assertExitCode(1);
    }

    private function createAdministrator(array $attributes = []): User
    {
        return User::query()->create([
            'name' => 'Administrateur de test',
            'email' => 'admin@example.com',
            'password' => Hash::make('Correct-Horse-Battery-42'),
            'is_admin' => true,
            'totp_secret' => self::TEST_TOTP_SECRET,
            'totp_confirmed_at' => now(),
            ...$attributes,
        ]);
    }

    private function useLocalEnvironment(): void
    {
        $this->app->detectEnvironment(fn () => 'local');
        $this->withoutMiddleware(PreventRequestForgery::class);
    }

    private function totpCode(string $secret, int $timestamp): string
    {
        $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        $bits = '';
        foreach (str_split($secret) as $character) {
            $bits .= str_pad(decbin(strpos($alphabet, $character)), 5, '0', STR_PAD_LEFT);
        }

        $key = '';
        foreach (str_split($bits, 8) as $byte) {
            if (strlen($byte) === 8) {
                $key .= chr(bindec($byte));
            }
        }

        $counter = intdiv($timestamp, 30);
        $hash = hash_hmac('sha1', pack('N2', 0, $counter), $key, true);
        $offset = ord($hash[19]) & 0x0F;
        $binaryCode = (
            ((ord($hash[$offset]) & 0x7F) << 24)
            | ((ord($hash[$offset + 1]) & 0xFF) << 16)
            | ((ord($hash[$offset + 2]) & 0xFF) << 8)
            | (ord($hash[$offset + 3]) & 0xFF)
        );

        return str_pad((string) ($binaryCode % 1_000_000), 6, '0', STR_PAD_LEFT);
    }
}
