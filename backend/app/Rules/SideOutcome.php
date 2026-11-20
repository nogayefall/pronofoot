<?php

namespace App\Rules;

/**
 * Résultat de l’ordre de décision pour une équipe (règle F121 à deux côtés) : prochain but à domicile (h+1-a)
 * ou à l’extérieur (h-a+1). Gravité : 2 = alerte critique, 1 = alerte haute, 0 = pas d’alerte.
 */
final readonly class SideOutcome
{
    public const HOME = 'home';

    public const AWAY = 'away';

    /**
     * @param  list<array{step: string, outcome: string, reason: string|null, side: string}>  $steps
     */
    public function __construct(
        public string $side,
        public ?string $scoreKey,
        public ?float $nextOdds,
        public ?float $currentOdds,
        public ?float $gap,
        public ?float $change,
        public bool $alert,
        public int $severity,
        public ?string $rule,
        public ?string $level,
        public string $reason,
        public array $steps = [],
        public ?string $postGoalPhase = null,
    ) {}

    public function label(): string
    {
        return $this->side === self::HOME ? 'Domicile' : 'Extérieur';
    }

    /**
     * Ligne de justification : « Domicile (2-0) : cote 3.20, écart +0.91, tendance +12 % → abstention (la cote monte) ».
     */
    public function summary(): string
    {
        $odds = $this->nextOdds === null ? 'n.c.' : number_format($this->nextOdds, 2, '.', '');
        $gap = $this->gap === null ? 'n.c.' : self::signed($this->gap, 2);
        $trend = $this->change === null ? 'n.c.' : self::signed($this->change, 1, true).' %';
        $trendLabel = $this->postGoalPhase === null ? 'tendance' : 'variation après le but';
        $verdict = $this->alert ? "alerte {$this->level}" : 'abstention';

        return "{$this->label()} (".($this->scoreKey ?? '?').") : cote {$odds}, écart {$gap}, {$trendLabel} {$trend} → {$verdict} ({$this->reason})";
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'side' => $this->side,
            'scoreKey' => $this->scoreKey,
            'nextOdds' => $this->nextOdds,
            'currentOdds' => $this->currentOdds,
            'gap' => $this->gap,
            'change' => $this->change,
            'postGoalPhase' => $this->postGoalPhase,
            'alert' => $this->alert,
            'level' => $this->level,
            'rule' => $this->rule,
            'reason' => $this->reason,
        ];
    }

    /**
     * Nombre signé avec le vrai signe moins (−) ; décimales finales inutiles retirées si demandé.
     */
    public static function signed(float $value, int $decimals, bool $trim = false): string
    {
        $formatted = number_format(abs($value), $decimals, '.', '');
        if ($trim && str_contains($formatted, '.')) {
            $formatted = rtrim(rtrim($formatted, '0'), '.');
        }

        if ((float) $formatted == 0.0) {
            return $trim ? '0' : number_format(0, $decimals, '.', '');
        }

        return ($value < 0 ? '−' : '+').$formatted;
    }
}
