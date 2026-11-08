<?php

namespace App\Rules;

final readonly class EngineResult
{
    /**
     * @param  array<string, RuleResult>  $rules
     * @param  array<string, FilterResult>  $filters
     */
    public function __construct(
        public bool $shouldAlert,
        public ?float $convergenceScore,
        public array $rules,
        public array $filters,
        public string $reason,
    ) {}
}
