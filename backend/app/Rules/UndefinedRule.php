<?php

namespace App\Rules;

final class UndefinedRule
{
    public function evaluate(string $ruleId): RuleResult
    {
        $reason = $ruleId === 'F121-E'
            ? 'F121-E est remplacée par F121-E1 (écart négatif) et F121-E2 (signal mi-temps).'
            : "La formule de {$ruleId} n’est pas définie dans les documents.";

        return new RuleResult(
            ruleId: $ruleId,
            verdict: RuleVerdict::NotDefined,
            reason: $reason,
        );
    }
}
