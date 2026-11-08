<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();
        $oldSetting = DB::table('settings')->where('key', 'rules.stable_odds_change_percent')->first();
        $newSetting = DB::table('settings')->where('key', 'tendance_seuil_stable')->first();

        if ($oldSetting !== null && $newSetting === null) {
            DB::table('settings')->where('id', $oldSetting->id)->update([
                'key' => 'tendance_seuil_stable',
                'updated_at' => $now,
            ]);
        } elseif ($oldSetting !== null) {
            if ($newSetting->value === null && $oldSetting->value !== null) {
                DB::table('settings')->where('id', $newSetting->id)->update([
                    'value' => $oldSetting->value,
                    'updated_at' => $now,
                ]);
            }

            DB::table('settings')->where('id', $oldSetting->id)->delete();
        } else {
            DB::table('settings')->insertOrIgnore([
                'key' => 'tendance_seuil_stable',
                'value' => null,
                'type' => 'decimal',
                'description' => 'Variation maximale définissant une tendance stable : à confirmer par le client.',
                'needs_confirmation' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        DB::table('settings')->insertOrIgnore([
            'key' => 'tendance_source',
            'value' => null,
            'type' => 'string',
            'description' => 'Source de la tendance : cote suggérée, hypothèse à confirmer par le client.',
            'needs_confirmation' => true,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    public function down(): void
    {
        $now = now();
        $oldSetting = DB::table('settings')->where('key', 'rules.stable_odds_change_percent')->first();
        $newSetting = DB::table('settings')->where('key', 'tendance_seuil_stable')->first();

        if ($oldSetting === null && $newSetting !== null) {
            DB::table('settings')->where('id', $newSetting->id)->update([
                'key' => 'rules.stable_odds_change_percent',
                'updated_at' => $now,
            ]);
        }

        DB::table('settings')->where('key', 'tendance_source')->delete();
    }
};
