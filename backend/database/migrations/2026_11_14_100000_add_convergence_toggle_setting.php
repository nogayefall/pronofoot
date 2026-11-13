<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Module 3.6 : la convergence (score de confiance) devient une étape facultative de l’ordre de décision,
 * désactivée par défaut. Les poids et scores des méthodes restent à fournir par le client.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::table('settings')->updateOrInsert(['key' => 'rules.convergence_enabled'], [
            'value' => '0',
            'type' => 'boolean',
            'description' => 'Ajoute l’étape « convergence » à la fin de l’ordre de décision : alerte seulement si le score de confiance dépasse le seuil du profil. Désactivée tant que les poids et scores des méthodes ne sont pas confirmés.',
            'needs_confirmation' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        DB::table('settings')->where('key', 'rules.convergence_enabled')->delete();
    }
};
