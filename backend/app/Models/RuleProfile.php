<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RuleProfile extends Model
{
    protected $fillable = [
        'name',
        'description',
        'is_active',
        'settings',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'settings' => 'array',
        ];
    }

    public function opportunityLogs(): HasMany
    {
        return $this->hasMany(OpportunityLog::class);
    }
}
