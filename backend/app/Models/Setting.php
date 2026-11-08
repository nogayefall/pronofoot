<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'type',
        'description',
        'needs_confirmation',
    ];

    protected function casts(): array
    {
        return [
            'needs_confirmation' => 'boolean',
        ];
    }
}
