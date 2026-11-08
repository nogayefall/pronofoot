<?php

namespace App\Rules;

final class UndefinedRule
{
    public function evaluate(string $ruleId): RuleResult
    {
        $reason = $ruleId === 'F121-E'
            ? 'F121-E a deux définitions contradictoires dans les documents et attend un arbitrage client.'
            : "La formule de {$ruleId} n’est pas définie dans les documents.";

        return new RuleResult(
            ruleId: $ruleId,
            verdict: RuleVerdict::NotDefined,
            reason: $reason,
        );
    }
}
