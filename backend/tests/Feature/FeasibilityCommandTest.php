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
        $this->assertStringContainsString('Statistiques tirs / tirs cadrés / possession / corners : oui', $output);
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
