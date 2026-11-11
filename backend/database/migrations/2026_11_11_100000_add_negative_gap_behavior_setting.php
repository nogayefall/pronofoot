<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('settings')->updateOrInsert(
            ['key' => 'ecart_negatif_comportement'],
            [
                'value' => null,
                'type' => 'string',
                'description' => 'Comportement à appliquer lorsqu’une cote du score suivant est inférieure à la cote actuelle.',
                'needs_confirmation' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        );
    }

    public function down(): void
    {
        DB::table('settings')->where('key', 'ecart_negatif_comportement')->delete();
    }
};
