<?php

namespace App\Providers\Fake;

use App\Providers\Data\ProviderUnavailable;
use JsonException;
use RuntimeException;

final class FakeFixtureLoader
{
    /**
     * @return array{failure_modes: array<string, string>, matches: list<array<string, mixed>>}
     */
    public function load(): array
    {
        $contents = $this->raw();

        try {
            $fixtures = json_decode($contents, true, flags: JSON_THROW_ON_ERROR);
        } catch (JsonException $exception) {
            throw new RuntimeException('Le fichier de scénarios fictifs contient un JSON invalide.', previous: $exception);
        }

        if (! is_array($fixtures)
            || ! is_array($fixtures['matches'] ?? null)
            || ! is_array($fixtures['failure_modes'] ?? null)) {
            throw new RuntimeException('Le fichier de scénarios fictifs a une structure invalide.');
        }

        $scenario = (string) config('services.pronofoot.fake_scenario', 'baseline');
        if ($scenario !== 'baseline') {
            $failure = $fixtures['failure_modes'][$scenario] ?? null;
            if (is_string($failure)) {
                throw new ProviderUnavailable($failure);
            }

            throw new RuntimeException("Le scénario fictif « {$scenario} » n’existe pas.");
        }

        return $fixtures;
    }

    public function raw(): string
    {
        $path = database_path('fixtures/football.json');
        $contents = file_get_contents($path);

        if ($contents === false) {
            throw new RuntimeException("Le fichier de scénarios fictifs est illisible : {$path}");
        }

        return $contents;
    }
}
