<?php

namespace App\Rules;

final readonly class RuleResult
{
    /**
     * @param  array<string, mixed>  $details
     */
    public function __construct(
        public string $ruleId,
        public RuleVerdict $verdict,
        public ?string $suggestedAction = null,
        public ?float $score = null,
        public ?string $reason = null,
        public array $details = [],
    ) {}
}
