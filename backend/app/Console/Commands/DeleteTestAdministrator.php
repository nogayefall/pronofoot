<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Supprime le compte de test local (admin-test@pronofoot.local) et ses sessions : étape obligatoire avant livraison.
 */
class DeleteTestAdministrator extends Command
{
    protected $signature = 'admin:delete-test';

    protected $description = 'Supprimer le compte administrateur de test et ses sessions avant une livraison.';

    public function handle(): int
    {
        $user = User::query()->where('email', CreateTestAdministrator::EMAIL)->first();
        if ($user === null) {
            $this->info('Aucun compte de test à supprimer.');

            return self::SUCCESS;
        }

        DB::table('sessions')->where('user_id', $user->id)->delete();
        $user->delete();
        $this->info('Compte de test supprimé, ainsi que ses sessions.');

        return self::SUCCESS;
    }
}
