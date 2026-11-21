<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Résultat des alertes par option : ciblée (prochain but d’une équipe), neutre (un but de plus), Over 4.5 (F121-D),
 * Over 0.5 en 2e mi-temps (F121-E2). Décision de l’administrateur, résultat et origine (automatique ou manuel).
 * Les alertes existantes reçoivent leur option principale, avec le résultat déjà noté (origine « manuel »).
 */
return new class extends Migration
{
    private const SETTINGS = [
        'results.bet_validity' => ['match', 'string', 'Validité du pari pour le résultat automatique : jusqu’à la fin du match (« match ») ou pendant la durée de l’alerte (« alert »).', true],
        'results.count_extra_time' => ['1', 'boolean', 'Les buts de la prolongation comptent dans le résultat automatique (sauf Over 0.5 en 2e mi-temps).', true],
    ];

    public function up(): void
    {
        Schema::create('alert_options', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('alert_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('position')->default(1);
            $table->string('type', 32);
            $table->string('label');
            $table->string('side', 8)->nullable();
            $table->string('score_key', 16)->nullable();
            $table->string('line', 32)->nullable();
            $table->decimal('odds', 8, 2)->nullable();
            $table->string('decision', 16)->default('unset');
            $table->string('outcome', 16)->default('pending');
            $table->string('outcome_source', 16)->nullable();
            $table->timestamp('settled_at')->nullable();
            $table->timestamps();
            $table->index(['alert_id', 'position']);
        });

        foreach (self::SETTINGS as $key => [$value, $type, $description, $needsConfirmation]) {
            DB::table('settings')->updateOrInsert(['key' => $key], [
                'value' => $value,
                'type' => $type,
                'description' => $description,
                'needs_confirmation' => $needsConfirmation,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->backfillExistingAlerts();
    }

    public function down(): void
    {
        DB::table('settings')->whereIn('key', array_keys(self::SETTINGS))->delete();
        Schema::dropIfExists('alert_options');
    }

    /**
     * Option principale de chaque alerte existante (résultat déjà noté repris, origine « manuel ») et, si le message
     * proposait une option neutre, celle-ci en attente.
     */
    private function backfillExistingAlerts(): void
    {
        $rows = DB::table('alerts')
            ->join('opportunity_logs', 'opportunity_logs.id', '=', 'alerts.opportunity_log_id')
            ->leftJoin('tracked_matches', 'tracked_matches.id', '=', 'opportunity_logs.tracked_match_id')
            ->select([
                'alerts.id as alert_id', 'alerts.message', 'alerts.created_at',
                'opportunity_logs.rule_id', 'opportunity_logs.selection', 'opportunity_logs.outcome',
                'tracked_matches.home_team', 'tracked_matches.away_team',
            ])
            ->get();

        foreach ($rows as $row) {
            $options = [];
            $selection = (string) $row->selection;
            if ($row->rule_id === 'F121-D') {
                $options[] = ['type' => 'over45', 'label' => 'Over 4.5 buts (F121-D)', 'line' => 'Over 4.5'];
            } elseif ($row->rule_id === 'F121-E2') {
                $options[] = ['type' => 'halftime_over05', 'label' => 'Over 0.5 but en 2e mi-temps (F121-E2)', 'line' => 'Over 0.5 2e MT'];
            } elseif (in_array($selection, ['home', 'away'], true)) {
                preg_match('/Cote suggérée \((\d+-\d+)\)/u', (string) $row->message, $score);
                $options[] = [
                    'type' => 'targeted',
                    'label' => 'Prochain but '.($selection === 'home' ? $row->home_team : $row->away_team),
                    'side' => $selection,
                    'score_key' => $score[1] ?? null,
                ];
            } elseif (preg_match('/^Over (\d+(?:\.\d+)?) buts$/', $selection, $line) === 1) {
                $options[] = ['type' => 'neutral', 'label' => 'Un but de plus dans le match', 'line' => "Over {$line[1]}"];
            } else {
                continue;
            }

            if (($options[0]['type'] ?? null) === 'targeted'
                && preg_match('/Option 2 \(neutre\) : un but de plus dans le match — (Over \d+(?:\.\d+)?)/u', (string) $row->message, $neutral) === 1) {
                $options[] = ['type' => 'neutral', 'label' => 'Un but de plus dans le match', 'line' => $neutral[1]];
            }

            foreach ($options as $index => $option) {
                $rated = $index === 0 && in_array($row->outcome, ['won', 'lost', 'cancelled'], true);
                DB::table('alert_options')->insert([
                    'alert_id' => $row->alert_id,
                    'position' => $index + 1,
                    'type' => $option['type'],
                    'label' => mb_substr((string) $option['label'], 0, 255),
                    'side' => $option['side'] ?? null,
                    'score_key' => $option['score_key'] ?? null,
                    'line' => $option['line'] ?? null,
                    'odds' => null,
                    'decision' => 'unset',
                    'outcome' => $rated ? $row->outcome : 'pending',
                    'outcome_source' => $rated ? 'manual' : null,
                    'settled_at' => $rated ? now() : null,
                    'created_at' => $row->created_at ?? now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
};
