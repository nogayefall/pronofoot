<?php

namespace App\Http\Controllers\Auth;

use App\Console\Commands\CreateTestAdministrator;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Security\TotpService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\View\View;

class AuthenticatedSessionController extends Controller
{
    private const int MAX_LOGIN_ATTEMPTS = 5;

    private const int LOGIN_DECAY_SECONDS = 60;

    /**
     * Empreinte factice : un email inconnu coûte le même calcul qu’un email connu (pas d’indice par le temps de réponse).
     */
    private const string DUMMY_PASSWORD_HASH = '$2y$12$vLWouF7brwPZaSLj8pK3s.jKAoLsZx9P0wR3U3tryvvZ9J.yXWahm';

    public function create(): View|RedirectResponse
    {
        if (Auth::check()) {
            return redirect()->route('admin.dashboard');
        }

        return view('auth.login', [
            'testAdministratorEmail' => app()->environment('local')
                ? CreateTestAdministrator::EMAIL
                : null,
            'twoFactorEnabled' => self::twoFactorEnabled(),
        ]);
    }

    private static function twoFactorEnabled(): bool
    {
        return (bool) config('auth.two_factor_enabled', true);
    }

    public function store(Request $request, TotpService $totpService): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string', 'max:255'],
            'authenticator_code' => ['nullable', 'digits:6'],
        ]);

        $limiterKey = $this->limiterKey($request, $validated['email']);
        if (RateLimiter::tooManyAttempts($limiterKey, self::MAX_LOGIN_ATTEMPTS)) {
            return back()
                ->withErrors(['credentials' => 'Trop de tentatives. Réessaie dans une minute.'])
                ->onlyInput('email');
        }

        $user = User::query()
            ->where('email', Str::lower($validated['email']))
            ->where('is_admin', true)
            ->when(
                ! app()->environment('local'),
                fn ($query) => $query->where('email', '!=', CreateTestAdministrator::EMAIL),
            )
            ->first();

        $passwordMatches = Hash::check($validated['password'], $user?->password ?? self::DUMMY_PASSWORD_HASH);
        $passwordIsValid = $user !== null && $passwordMatches;
        $isLocalTestAdministrator = app()->environment('local')
            && $user?->email === CreateTestAdministrator::EMAIL;
        $totpCounter = $user !== null
            && $user->totp_secret !== null
            && $user->totp_confirmed_at !== null
            && isset($validated['authenticator_code'])
                ? $totpService->matchingCounter($user->totp_secret, $validated['authenticator_code'])
                : null;
        $codeAlreadyUsed = $totpCounter !== null
            && $user->totp_last_counter !== null
            && $totpCounter <= $user->totp_last_counter;
        $authenticatorIsValid = ! self::twoFactorEnabled()
            || $isLocalTestAdministrator
            || ($totpCounter !== null && ! $codeAlreadyUsed);

        if (! $passwordIsValid || ! $authenticatorIsValid) {
            RateLimiter::hit($limiterKey, self::LOGIN_DECAY_SECONDS);

            return back()
                ->withErrors(['credentials' => 'Identifiants ou code d’authentification invalides.'])
                ->onlyInput('email');
        }

        RateLimiter::clear($limiterKey);
        if ($totpCounter !== null && self::twoFactorEnabled()) {
            $user->forceFill(['totp_last_counter' => $totpCounter])->save();
        }
        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->intended(route('admin.dashboard'));
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }

    private function limiterKey(Request $request, string $email): string
    {
        return Str::transliterate(Str::lower($email).'|'.$request->ip());
    }
}
