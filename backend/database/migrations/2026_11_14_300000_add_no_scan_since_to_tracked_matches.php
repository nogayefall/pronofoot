<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Mémorise depuis quand un match est en « pas de scan » (écart au-delà du seuil d’arrêt), pour n’écrire qu’une ligne
 * au Journal à l’entrée et une à la sortie de cet état.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tracked_matches', function (Blueprint $table): void {
            $table->timestamp('no_scan_since')->nullable()->after('last_scanned_at');
        });
    }

    public function down(): void
    {
        Schema::table('tracked_matches', function (Blueprint $table): void {
            $table->dropColumn('no_scan_since');
        });
    }
};
