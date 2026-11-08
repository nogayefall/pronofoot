<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class ResetTestAdministratorPassword extends Command
{
    protected $signature = 'admin:test-password-reset';

    protected $description = 'Définir un nouveau mot de passe pour le compte administrateur de test local.';

    public function handle(): int
    {
        if (! app()->environment('local')) {
            $this->error('Cette commande est disponible uniquement avec APP_ENV=local.');

            return self::FAILURE;
        }

        $user = User::query()
            ->where('email', CreateTestAdministrator::EMAIL)
            ->where('is_admin', true)
            ->first();

        if ($user === null) {
            $this->error('Aucun compte de test n’existe. Lance php artisan admin:create-test.');

            return self::FAILURE;
        }

        $password = (string) $this->secret('Nouveau mot de passe (12 caractères minimum)');
        $passwordConfirmation = (string) $this->secret('Confirme le nouveau mot de passe');

        $errors = Validator::make(
            ['password' => $password, 'password_confirmation' => $passwordConfirmation],
            ['password' => ['required', 'confirmed', Password::min(12)]],
        )->errors();

        if ($errors->isNotEmpty()) {
            $this->error($errors->first());

            return self::FAILURE;
        }

        $user->password = Hash::make($password);
        $user->save();

        $this->info('Mot de passe du compte de test mis à jour. La valeur n’a pas été affichée.');

        return self::SUCCESS;
    }
}
