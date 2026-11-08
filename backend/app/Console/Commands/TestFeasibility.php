<?php

namespace App\Console\Commands;

use App\Providers\Contracts\FootballProvider;
use App\Providers\Contracts\OddsProvider;
use App\Providers\Data\FootballFeed;
use App\Providers\Data\OddsFeed;
use App\Providers\Data\ProviderUnavailable;
use App\Services\FeasibilityCapture;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;

class TestFeasibility extends Command
{
    protected $signature = 'feasibility:test
        {--matches=30 : Nombre de matchs à inclure dans l’estimation}
        {--odds-interval= : Fréquence Odds confirmée, en secondes}
        {--stats-interval= : Fréquence statistiques confirmée, en secondes}
        {--capture : Enregistrer les réponses brutes sans secrets dans storage/feasibility/}';

    protected $description = 'Vérifier la faisabilité des fournisseurs configurés sans placer de pari.';

    public function handle(
        OddsProvider $oddsProvider,
        FootballProvider $footballProvider,
        FeasibilityCapture $capture,
    ): int {
        $trackedMatches = filter_var($this->option('matches'), FILTER_VALIDATE_INT);
        if ($trackedMatches === false || $trackedMatches < 1) {
            throw new InvalidArgumentException('--matches doit être un entier strictement positif.');
        }

        $oddsInterval = $this->positiveInterval($this->option('odds-interval'), '--odds-interval');
        $statsInterval = $this->positiveInterval($this->option('stats-interval'), '--stats-interval');
        $odds = $this->loadOdds($oddsProvider);
        $football = $this->loadFootball($footballProvider);
        $simulation = $odds->driver === 'fake' || $football->driver === 'fake';

        if ($simulation) {
            $this->warn('MODE SIMULATION : données fictives — aucun appel API réel, aucune mise.');
        }

        $this->newLine();
        $this->line('Odds : '.$this->availability($odds->reachable).' — '.$odds->statusMessage);
        $this->line('Matchs live côté Odds : '.count($odds->matches));
        $this->line('Marché des scores exacts en direct : '.($odds->exactScoreMarketAvailable ? 'oui' : 'non'));
        $this->line('Marché Over/Under : '.$this->availability($odds->overUnderMarketAvailable));
        $this->line('Quota Odds : '.$this->quota($odds->requestsUsed, $odds->requestsRemaining, $odds->driver));
        $this->newLine();
        $this->line('Football : '.$this->availability($football->reachable).' — '.$football->statusMessage);
        $this->line('Matchs live Football : '.count($football->matches));
        $this->line('Statistiques tirs / tirs cadrés / possession / corners : '.$this->availability($football->statisticsAvailable));
        $this->line('Quota Football : '.$this->quota($football->requestsUsed, $football->requestsRemaining, $football->driver));
        $this->newLine();

        $this->displayEstimate(
            (int) $trackedMatches,
            $odds->driver,
            $oddsInterval,
            $statsInterval,
        );

        if ($this->option('capture')) {
            $paths = $capture->save($football, $odds);
            foreach ($paths as $path) {
                $this->info("Capture enregistrée : {$path}");
            }
        }

        $successful = $odds->reachable === true
            && $odds->exactScoreMarketAvailable
            && $football->reachable === true
            && $football->statisticsAvailable === true;

        return $successful ? self::SUCCESS : self::FAILURE;
    }

    private function loadOdds(OddsProvider $provider): OddsFeed
    {
        try {
            return $provider->getLiveOdds();
        } catch (ProviderUnavailable $exception) {
            Log::warning('Fournisseur Odds indisponible.', ['reason' => $exception->getMessage()]);

            return new OddsFeed(
                driver: 'fake',
                reachable: false,
                exactScoreMarketAvailable: false,
                overUnderMarketAvailable: null,
                statusMessage: $exception->getMessage(),
            );
        }
    }

    private function loadFootball(FootballProvider $provider): FootballFeed
    {
        try {
            return $provider->getLiveMatches();
        } catch (ProviderUnavailable $exception) {
            Log::warning('Fournisseur Football indisponible.', ['reason' => $exception->getMessage()]);

            return new FootballFeed(
                driver: 'fake',
                reachable: false,
                statisticsAvailable: false,
                statusMessage: $exception->getMessage(),
            );
        }
    }

    private function availability(?bool $available): string
    {
        return match ($available) {
            true => 'oui',
            false => 'non',
            null => 'non vérifié',
        };
    }

    private function quota(?int $used, ?int $remaining, string $driver): string
    {
        if ($driver === 'fake') {
            return '0 (simulation, aucun appel réseau)';
        }

        if ($used === null && $remaining === null) {
            return 'non mesuré';
        }

        return sprintf('%s consommé(s), %s restant(s)', $used ?? 'inconnu', $remaining ?? 'inconnu');
    }

    private function displayEstimate(
        int $matches,
        string $oddsDriver,
        ?int $oddsInterval,
        ?int $statsInterval,
    ): void {
        $this->line("Estimation pour {$matches} matchs suivis (1 requête par match et par cycle, regroupement non déduit) :");

        if ($oddsDriver === 'real' && $oddsInterval !== null) {
            $this->line('  Odds : non applicable tant que le marché de score exact n’est pas disponible.');
        } elseif ($oddsInterval !== null) {
            $calls = (int) ceil($matches * 3600 / $oddsInterval);
            $this->line("  Odds : environ {$calls} appel(s)/heure, sur la fréquence explicitement fournie.");
        } else {
            $this->line('  Odds : non calculable ; fréquence non confirmée (option --odds-interval).');
        }

        if ($statsInterval !== null) {
            $calls = (int) ceil($matches * 3600 / $statsInterval);
            $this->line("  Football/statistiques : environ {$calls} appel(s)/heure, sur la fréquence explicitement fournie.");
        } else {
            $this->line('  Football/statistiques : non calculable ; fréquence non confirmée (option --stats-interval).');
        }

        $this->comment('Estimation indicative : le regroupement des matchs et le coût réel par marché restent à confirmer auprès des fournisseurs.');
    }

    private function positiveInterval(mixed $value, string $option): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        $interval = filter_var($value, FILTER_VALIDATE_INT);

        if ($interval === false || $interval < 1) {
            throw new InvalidArgumentException("{$option} doit être un nombre entier strictement positif.");
        }

        return $interval;
    }
}
