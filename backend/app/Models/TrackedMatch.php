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
    ];

    protected function casts(): array
    {
        return [
            'kickoff_at' => 'datetime',
            'is_active' => 'boolean',
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
