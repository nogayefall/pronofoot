<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Option d’une alerte et son résultat : ciblée (prochain but d’une équipe), neutre (un but de plus), Over 4.5
 * (F121-D) ou Over 0.5 en 2e mi-temps (F121-E2). Décision : played / ignored / unset. Résultat : won / lost /
 * cancelled / pending. Origine : auto (calculé à la fin du match) ou manual (corrigé par l’administrateur).
 */
class AlertOption extends Model
{
    public const TYPES = ['targeted', 'neutral', 'over45', 'halftime_over05'];

    public const DECISIONS = ['played', 'ignored', 'unset'];

    public const OUTCOMES = ['won', 'lost', 'cancelled', 'pending'];

    protected $fillable = [
        'alert_id',
        'position',
        'type',
        'label',
        'side',
        'score_key',
        'line',
        'odds',
        'decision',
        'outcome',
        'outcome_source',
        'settled_at',
    ];

    protected function casts(): array
    {
        return [
            'position' => 'integer',
            'odds' => 'float',
            'settled_at' => 'datetime',
        ];
    }

    public function alert(): BelongsTo
    {
        return $this->belongsTo(Alert::class);
    }
}
