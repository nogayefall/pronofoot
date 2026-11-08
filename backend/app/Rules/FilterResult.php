<?php

namespace App\Rules;

final readonly class FilterResult
{
    public function __construct(
        public bool $passed,
        public ?string $reason = null,
        public array $details = [],
    ) {}
}
