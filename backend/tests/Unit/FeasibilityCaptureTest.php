<?php

namespace Tests\Unit;

use App\Providers\Data\FootballFeed;
use App\Providers\Data\OddsFeed;
use App\Services\FeasibilityCapture;
use Illuminate\Support\Str;
use Tests\TestCase;

class FeasibilityCaptureTest extends TestCase
{
    public function test_capture_preserves_raw_responses_and_redacts_credentials(): void
    {
        $directory = sys_get_temp_dir().DIRECTORY_SEPARATOR.'pronofoot-'.Str::uuid();
        config()->set('services.football_api.api_key', 'private-api-key');
        config()->set('services.odds_api.api_key', 'private-odds-key');

        try {
            $paths = (new FeasibilityCapture($directory))->save(
                new FootballFeed(
                    driver: 'real',
                    reachable: true,
                    statisticsAvailable: null,
                    statusMessage: 'NON VÉRIFIÉ',
                    rawResponse: '{"response":"private-api-key","api_key":"private-api-key","data":{"access_token":"private-odds-key"}}',
                ),
                new OddsFeed(
                    driver: 'fake',
                    reachable: true,
                    exactScoreMarketAvailable: true,
                    overUnderMarketAvailable: true,
                    statusMessage: 'Simulation',
                    rawResponse: '{"fixture":"raw odds"}',
                ),
            );

            $this->assertCount(2, $paths);
            $footballCapture = file_get_contents($paths[0]);
            $this->assertIsString($footballCapture);
            $this->assertStringContainsString('[REDACTED]', $footballCapture);
            $this->assertStringContainsString('response', $footballCapture);
            $this->assertStringContainsString('api_key', $footballCapture);
            $this->assertStringNotContainsString('private-odds-key', $footballCapture);
            $this->assertStringNotContainsString('private-api-key', $footballCapture);
            $this->assertStringContainsString('raw odds', (string) file_get_contents($paths[1]));
        } finally {
            foreach (glob($directory.DIRECTORY_SEPARATOR.'*.json') ?: [] as $path) {
                unlink($path);
            }

            if (is_dir($directory)) {
                rmdir($directory);
            }
        }
    }
}
