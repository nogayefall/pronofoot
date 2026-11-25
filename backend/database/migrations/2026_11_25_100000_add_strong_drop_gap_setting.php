<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Décision du 25 novembre 2026 : une baisse de cote seule (F162-Bis) ne déclenche plus d’alerte Critique quand une seule
 * équipe est en signal et que son écart dépasse le seuil F121-G. Deux équipes en signal et fenêtre après un but : inchangées.
 */
return new class extends Migration
{
    private const KEY = 'rules.strong_drop_requires_gap';

    public function up(): void
    {
        DB::table('settings')->updateOrInsert(['key' => self::KEY], [
            'value' => '1',
            'type' => 'boolean',
            'description' => 'F162-Bis exige un écart <= seuil F121-G : quand une seule équipe est en signal, une baisse de cote seule ne déclenche pas d’alerte si l’écart dépasse le seuil. Sans effet si les deux équipes sont en signal, ni dans les 2 minutes après un but.',
            'needs_confirmation' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        DB::table('settings')->where('key', self::KEY)->delete();
    }
};
