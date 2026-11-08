<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Security\TotpService;
use Illuminate\Console\Command;

class ShowTestAdministratorCode extends Command
{
    protected $signature = 'admin:test-code';

    protected $description = 'Afficher le code TOTP actuel du compte de test local.';

    public function handle(TotpService $totpService): int
    {
        if (! app()->environment('local')) {
            $this->error('Cette commande est disponible uniquement avec APP_ENV=local.');

            return self::FAILURE;
        }

        $user = User::query()
            ->where('email', CreateTestAdministrator::EMAIL)
            ->where('is_admin', true)
            ->whereNotNull('totp_confirmed_at')
            ->first();

        if ($user === null || $user->totp_secret === null) {
            $this->error('Aucun compte de test n’existe. Lance php artisan admin:create-test.');

            return self::FAILURE;
        }

        $this->line('Code à 6 chiffres : '.$totpService->currentCode($user->totp_secret));
        $this->warn('Ce code expire au prochain intervalle de 30 secondes.');

        return self::SUCCESS;
    }
}
