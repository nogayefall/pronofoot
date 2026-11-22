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
        'confidence',
        'suggested_action',
        'reason',
        'outcome',
        'evaluated_at',
        'repeat_count',
        'first_evaluated_at',
    ];

    protected function casts(): array
    {
        return [
            'rule_results' => 'array',
            'filter_results' => 'array',
            'confidence' => 'array',
            'evaluated_at' => 'datetime',
            'repeat_count' => 'integer',
            'first_evaluated_at' => 'datetime',
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
