<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MatchSnapshot extends Model
{
    protected $fillable = [
        'tracked_match_id',
        'minute',
        'home_score',
        'away_score',
        'exact_score_odds',
        'second_half_over_under_odds',
        'statistics',
        'vitality_score',
        'odds_change_percent',
        'odds_captured_at',
        'statistics_captured_at',
        'captured_at',
    ];

    protected function casts(): array
    {
        return [
            'exact_score_odds' => 'array',
            'second_half_over_under_odds' => 'array',
            'statistics' => 'array',
            'vitality_score' => 'float',
            'odds_change_percent' => 'float',
            'odds_captured_at' => 'datetime',
            'statistics_captured_at' => 'datetime',
            'captured_at' => 'datetime',
        ];
    }

    public function trackedMatch(): BelongsTo
    {
        return $this->belongsTo(TrackedMatch::class);
    }

    public function opportunityLogs(): HasMany
    {
        return $this->hasMany(OpportunityLog::class);
    }
}
