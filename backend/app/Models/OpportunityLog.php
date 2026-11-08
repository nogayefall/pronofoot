<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class OpportunityLog extends Model
{
    protected $fillable = [
        'tracked_match_id',
        'match_snapshot_id',
        'rule_profile_id',
        'event_type',
        'rule_id',
        'selection',
        'decision',
        'rule_results',
        'filter_results',
        'suggested_action',
        'reason',
        'outcome',
        'evaluated_at',
    ];

    protected function casts(): array
    {
        return [
            'rule_results' => 'array',
            'filter_results' => 'array',
            'evaluated_at' => 'datetime',
        ];
    }

    public function trackedMatch(): BelongsTo
    {
        return $this->belongsTo(TrackedMatch::class);
    }

    public function matchSnapshot(): BelongsTo
    {
        return $this->belongsTo(MatchSnapshot::class);
    }

    public function ruleProfile(): BelongsTo
    {
        return $this->belongsTo(RuleProfile::class);
    }

    public function alert(): HasOne
    {
        return $this->hasOne(Alert::class);
    }
}
