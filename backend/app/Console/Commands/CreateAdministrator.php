<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Security\TotpService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class CreateAdministrator extends Command
{
    protected $signature = 'admin:create';

    protected $description = 'Créer le compte administrateur initial avec une authentification TOTP.';

    public function handle(TotpService $totpService): int
    {
        if (User::query()->where('is_admin', true)->exists()) {
            $this->error('Un compte administrateur existe déjà.');

            return self::FAILURE;
        }

        $name = trim((string) $this->ask('Nom de l’administrateur'));
        $email = mb_strtolower(trim((string) $this->ask('Adresse courriel')));

        $identityErrors = Validator::make(
            ['name' => $name, 'email' => $email],
            ['name' => ['required', 'string', 'max:255'], 'email' => ['required', 'email', 'max:255']],
        )->errors();

        if ($identityErrors->isNotEmpty()) {
            $this->error($identityErrors->first());

            return self::FAILURE;
        }

        if (User::query()->where('email', $email)->exists()) {
            $this->error('Cette adresse courriel est déjà utilisée.');

            return self::FAILURE;
        }

        $password = (string) $this->secret('Mot de passe (12 caractères minimum)');
        $passwordConfirmation = (string) $this->secret('Confirme le mot de passe');

        $passwordErrors = Validator::make(
            ['password' => $password, 'password_confirmation' => $passwordConfirmation],
            ['password' => ['required', 'confirmed', Password::min(12)]],
        )->errors();

        if ($passwordErrors->isNotEmpty()) {
            $this->error($passwordErrors->first());

            return self::FAILURE;
        }

        $totpSecret = $totpService->generateSecret();
        $issuer = (string) config('app.name');
        $provisioningUri = $totpService->provisioningUri($totpSecret, $email, $issuer);

        $this->newLine();
        $this->info('Ajoute ce compte dans ton application d’authentification avant de continuer.');
        $this->line("Secret TOTP : {$totpSecret}");
        $this->line("URI de configuration : {$provisioningUri}");
        $this->warn('Ne partage pas ce secret. Il ne sera affiché qu’ici.');

        $firstCode = trim((string) $this->ask('Saisis le code à 6 chiffres affiché par ton application'));
        if (! $totpService->verify($totpSecret, $firstCode)) {
            $this->error('Code invalide. Aucun compte administrateur n’a été créé.');

            return self::FAILURE;
        }

        User::query()->create([
            'name' => $name,
            'email' => $email,
            'password' => $password,
            'is_admin' => true,
            'totp_secret' => $totpSecret,
            'totp_confirmed_at' => now(),
        ]);

        $this->info('Compte administrateur créé. Les connexions exigent le mot de passe et le code TOTP.');

        return self::SUCCESS;
    }
}
