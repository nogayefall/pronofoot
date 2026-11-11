<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class FeasibilityCommandTest extends TestCase
{
    public function test_feasibility_command_reports_fake_mode_and_quota_estimates_from_explicit_frequencies(): void
    {
        config()->set('services.pronofoot.odds_driver', 'fake');
        config()->set('services.pronofoot.football_driver', 'fake');
        config()->set('services.pronofoot.fake_scenario', 'baseline');

        $exitCode = Artisan::call('feasibility:test', [
            '--matches' => 30,
            '--odds-interval' => 30,
            '--stats-interval' => 60,
        ]);
        $output = Artisan::output();

        $this->assertSame(0, $exitCode);
        $this->assertStringContainsString('MODE SIMULATION : données fictives', $output);
        $this->assertStringContainsString('Marché des scores exacts en direct : oui', $output);
        $this->assertStringContainsString('Statistiques lues sur un match : oui', $output);
        $this->assertStringContainsString('Odds : environ 3600 appel(s)/heure', $output);
        $this->assertStringContainsString('Football/statistiques : environ 1800 appel(s)/heure', $output);
        $this->assertStringContainsString('aucun appel réseau', $output);
    }

    public function test_feasibility_command_reports_real_driver_limitations_without_calling_odds_api(): void
    {
        Http::preventStrayRequests();
        config()->set('services.pronofoot.odds_driver', 'real');
        config()->set('services.pronofoot.football_driver', 'real');
        config()->set('services.football_api.probe_url', null);
        config()->set('services.football_api.api_key', null);
        config()->set('services.football_api.api_key_header', null);

        $exitCode = Artisan::call('feasibility:test');
        $output = Artisan::output();

        $this->assertSame(1, $exitCode);
        $this->assertStringContainsString('Marché des scores exacts non disponible', $output);
        $this->assertStringContainsString('NON VÉRIFIÉ', $output);
        $this->assertStringContainsString('non calculable ; fréquence non confirmée', $output);
    }

    public function test_feasibility_command_reports_live_odds_statistics_and_quota_for_api_football(): void
    {
        config()->set('services.pronofoot.odds_driver', 'api_football');
        config()->set('services.pronofoot.football_driver', 'real');
        config()->set('services.football_api.base_url', 'https://api.example.test');
        config()->set('services.football_api.api_key', 'test-api-key');

        $liveResponse = file_get_contents(database_path('fixtures/api-football/fixtures-live.json'));
        $statisticsResponse = file_get_contents(database_path('fixtures/api-football/fixtures-statistics.json'));
        $oddsResponse = file_get_contents(database_path('fixtures/api-football/odds-live-bet-23.json'));
        $this->assertNotFalse($liveResponse);
        $this->assertNotFalse($statisticsResponse);
        $this->assertNotFalse($oddsResponse);

        Http::fake([
            'https://api.example.test/odds/live*' => Http::response(
                $oddsResponse,
                200,
                [
                    'x-ratelimit-requests-remaining' => '81',
                    'x-ratelimit-requests-limit' => '100',
                ],
            ),
            'https://api.example.test/fixtures?live=all' => Http::response(
                $liveResponse,
                200,
                [
                    'x-ratelimit-requests-remaining' => '83',
                    'x-ratelimit-requests-limit' => '100',
                ],
            ),
            'https://api.example.test/fixtures/statistics*' => Http::response(
                $statisticsResponse,
                200,
                [
                    'x-ratelimit-requests-remaining' => '82',
                    'x-ratelimit-requests-limit' => '100',
                ],
            ),
        ]);

        $exitCode = Artisan::call('feasibility:test', [
            '--matches' => 30,
            '--odds-interval' => 30,
            '--stats-interval' => 60,
        ]);
        $output = Artisan::output();

        $this->assertSame(1, $exitCode);
        $this->assertStringContainsString('Matchs live côté Odds : 3', $output);
        $this->assertStringContainsString('Matchs ayant le marché 23 : 13', $output);
        $this->assertStringContainsString('Matchs live Football : 27', $output);
        $this->assertStringContainsString('Match échantillon statistiques : 1635776', $output);
        $this->assertStringContainsString('Statistiques lues sur un match : non', $output);
        $this->assertStringContainsString('82 restant(s) sur 100', $output);
        $this->assertStringContainsString('Odds/live bet 23 : environ 120 appel(s)/heure', $output);
        $this->assertStringContainsString('Football/statistiques (couverture de 30 matchs) : environ 1800 appel(s)/heure', $output);
        Http::assertSentCount(3);
    }

    public function test_fake_api_outage_makes_feasibility_command_fail_explicitly(): void
    {
        config()->set('services.pronofoot.odds_driver', 'fake');
        config()->set('services.pronofoot.football_driver', 'fake');
        config()->set('services.pronofoot.fake_scenario', 'api_outage');

        $exitCode = Artisan::call('feasibility:test');
        $output = Artisan::output();

        $this->assertSame(1, $exitCode);
        $this->assertStringContainsString('Panne d’API fictive demandée', $output);
    }

    public function test_feasibility_command_rejects_an_invalid_estimate_interval(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('--stats-interval doit être un nombre entier strictement positif.');

        Artisan::call('feasibility:test', ['--stats-interval' => '0']);
    }
}
