<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TrackedMatch extends Model
{
    protected $fillable = [
        'provider',
        'provider_match_id',
        'home_team',
        'away_team',
        'competition',
        'kickoff_at',
        'status',
        'is_active',
        'tracking_mode',
        'last_goal_detected_at',
        'post_goal_reference_score',
        'post_goal_reference_odds',
        'last_scanned_at',
        'no_scan_since',
        'missing_readings',
        'ended_at',
        'ended_reason',
        'post_goal_references',
        'statistics_available',
        'plancher_scans',
    ];

    protected function casts(): array
    {
        return [
            'kickoff_at' => 'datetime',
            'is_active' => 'boolean',
            'last_goal_detected_at' => 'datetime',
            'post_goal_reference_odds' => 'float',
            'last_scanned_at' => 'datetime',
            'no_scan_since' => 'datetime',
            'missing_readings' => 'integer',
            'ended_at' => 'datetime',
            'post_goal_references' => 'array',
            'plancher_scans' => 'array',
            'statistics_available' => 'boolean',
        ];
    }

    public function snapshots(): HasMany
    {
        return $this->hasMany(MatchSnapshot::class);
    }

    public function opportunityLogs(): HasMany
    {
        return $this->hasMany(OpportunityLog::class);
    }
}
