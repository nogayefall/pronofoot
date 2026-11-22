<?php

namespace App\Rules;

final readonly class EngineResult
{
    /**
     * @param  array<string, RuleResult>  $rules
     * @param  array<string, FilterResult>  $filters
     * @param  list<array{step: string, outcome: string, reason: string|null}>  $steps  Trace de l’ordre de décision.
     * @param  string|null  $decisiveRule  Règle qui produit la décision.
     * @param  string|null  $level  Niveau d’alerte (Critique, Haute, Mi-temps, Neutre).
     * @param  string|null  $selection  home, away, ou null pour un pari sur le total de buts.
     * @param  list<array<string, mixed>>  $sides  Détail de la règle F121 pour chaque équipe (écart, tendance, décision).
     * @param  list<array<string, mixed>>  $options  Options proposées : ciblée (prochain but d’une équipe) puis neutre (un but de plus).
     * @param  array<string, mixed>  $confidence  Score de confiance automatique (V12) : total, seuil, détail par règle.
     */
    public function __construct(
        public bool $shouldAlert,
        public ?float $convergenceScore,
        public array $rules,
        public array $filters,
        public string $reason,
        public array $steps = [],
        public ?string $decisiveRule = null,
        public ?string $level = null,
        public ?string $selection = null,
        public ?string $suggestedAction = null,
        public array $sides = [],
        public array $options = [],
        public array $confidence = [],
    ) {}
}
