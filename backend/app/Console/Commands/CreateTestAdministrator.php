<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Security\TotpService;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class CreateTestAdministrator extends Command
{
    public const string EMAIL = 'admin-test@pronofoot.local';

    protected $signature = 'admin:create-test';

    protected $description = 'Créer un compte administrateur temporaire pour le développement local.';

    public function handle(TotpService $totpService): int
    {
        if (! app()->environment('local')) {
            $this->error('Cette commande est disponible uniquement avec APP_ENV=local.');

            return self::FAILURE;
        }

        if (User::query()->where('email', self::EMAIL)->exists()) {
            $this->error('Le compte de test existe déjà. Utilise php artisan admin:test-code pour afficher le code TOTP actuel.');

            return self::FAILURE;
        }

        $password = Str::password(40, true, true, true, false);
        $totpSecret = $totpService->generateSecret();

        User::query()->create([
            'name' => 'Administrateur de test',
            'email' => self::EMAIL,
            'password' => $password,
            'is_admin' => true,
            'totp_secret' => $totpSecret,
            'totp_confirmed_at' => now(),
        ]);

        $this->newLine();
        $this->info('Compte de test local créé. Ces identifiants sont réservés à ton environnement de développement.');
        $this->line('Adresse courriel : '.self::EMAIL);
        $this->line("Mot de passe temporaire : {$password}");
        $this->line('Code à 6 chiffres : '.$totpService->currentCode($totpSecret));
        $this->newLine();
        $this->warn('Le code change toutes les 30 secondes. Pour en afficher un nouveau : php artisan admin:test-code');
        $this->warn('Ne réutilise pas ces identifiants en production et supprime ce compte avant toute livraison.');

        return self::SUCCESS;
    }
}
