<?php

namespace App\Console\Commands;

use App\Services\ApiFootballResponseCapture;
use Illuminate\Console\Command;
use RuntimeException;

final class CaptureApiFootballResponses extends Command
{
    protected $signature = 'api-football:capture
        {--fixture= : Match live à utiliser pour tester les statistiques}
        {--auto-covered : Chercher automatiquement un match d’une ligue couverte}';

    protected $description = 'Capturer les réponses live API-Football sans les mapper ni exposer la clé.';

    public function handle(ApiFootballResponseCapture $capture): int
    {
        if (config('services.pronofoot.football_driver') !== 'real') {
            $this->error('Capture annulée : configurez FOOTBALL_DRIVER=real avant tout appel API.');

            return self::FAILURE;
        }

        $apiKey = trim((string) config('services.football_api.api_key'));
        if ($apiKey === '') {
            $this->error('Capture annulée : API_FOOTBALL_API_KEY est requis dans .env.');

            return self::FAILURE;
        }

        $fixtureId = $this->option('fixture');
        $autoCovered = (bool) $this->option('auto-covered');
        if ($fixtureId !== null && $autoCovered) {
            $this->error('Choisissez soit --fixture, soit --auto-covered, pas les deux.');

            return self::FAILURE;
        }

        $calls = $autoCovered ? '4 maximum (live, ligues, statistiques, cotes bet 23)' : '3 maximum';
        $this->line("Appels API prévus : {$calls}.");
        $beforeRequest = function (string $endpoint, ?int $remaining): void {
            $quota = $remaining === null ? 'inconnu (aucun en-tête reçu)' : (string) $remaining;
            $this->line("Quota restant avant {$endpoint} : {$quota}.");
        };
        $reviewCandidates = function (array $candidateIds, array $fallbackIds, string $selectedId): bool {
            $this->line('ID candidats couverts : '.implode(', ', $candidateIds));
            if ($fallbackIds !== []) {
                $this->warn('Saison courante utilisée faute de correspondance : '.implode(', ', $fallbackIds));
            }
            $this->line("ID choisi automatiquement : {$selectedId}.");

            return $this->confirm("Appeler les statistiques pour {$selectedId} ?", false);
        };

        try {
            $result = $capture->capture(
                $apiKey,
                is_string($fixtureId) && $fixtureId !== '' ? $fixtureId : null,
                $autoCovered,
                $beforeRequest,
                $reviewCandidates,
            );
        } catch (RuntimeException $exception) {
            $this->error($exception->getMessage());

            return self::FAILURE;
        }

        $this->info('Matchs en direct : '.$result['live_matches']);
        $this->info('ID utilisé pour les statistiques : '.($result['fixture_id'] ?? 'aucun (aucun ID de match disponible)'));
        if ($result['candidate_fixture_ids'] !== []) {
            $this->info('ID candidats couverts : '.implode(', ', $result['candidate_fixture_ids']));
        }
        if ($result['fallback_fixture_ids'] !== []) {
            $this->warn('Saison courante utilisée faute de correspondance : '.implode(', ', $result['fallback_fixture_ids']));
        }
        if ($result['cancelled']) {
            $this->warn('Capture des statistiques annulée avant l’appel.');

            return self::SUCCESS;
        }
        $quota = $result['requests_remaining'] === null
            ? 'non communiqué'
            : $result['requests_remaining'].' requête(s) restante(s)';
        if ($result['requests_limit'] !== null) {
            $quota .= ' sur '.$result['requests_limit'];
        }
        $this->info('Quota (dernier en-tête reçu) : '.$quota);
        $this->info('Captures enregistrées : '.count($result['paths']).' fichier(s) dans storage/feasibility/api-football/.');
        if ($autoCovered && $result['live_matches'] > 0 && $result['fixture_id'] === null) {
            $this->error('Aucun match live n’a une couverture statistique confirmée ; statistiques non appelées.');

            return self::FAILURE;
        }
        if ($result['live_matches'] > 0 && $result['fixture_id'] === null) {
            $this->error('Réponse live capturée, mais aucun response[].fixture.id exploitable : statistiques non appelées.');

            return self::FAILURE;
        }

        return self::SUCCESS;
    }
}
