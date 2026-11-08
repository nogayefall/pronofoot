<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Alert extends Model
{
    protected $fillable = [
        'opportunity_log_id',
        'channel',
        'status',
        'message',
        'sent_at',
        'fallback_used',
        'failure_reason',
        'expires_at',
        'goal_detected_at',
    ];

    protected function casts(): array
    {
        return [
            'sent_at' => 'datetime',
            'fallback_used' => 'boolean',
            'expires_at' => 'datetime',
            'goal_detected_at' => 'datetime',
        ];
    }

    public function opportunityLog(): BelongsTo
    {
        return $this->belongsTo(OpportunityLog::class);
    }

    public function isActive(): bool
    {
        return in_array($this->status, ['queued', 'sent'], true)
            && ($this->expires_at === null || $this->expires_at->isFuture());
    }
}
