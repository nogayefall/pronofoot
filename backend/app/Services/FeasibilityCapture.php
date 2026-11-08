<?php

namespace App\Services;

use App\Providers\Data\FootballFeed;
use App\Providers\Data\OddsFeed;
use Illuminate\Support\Str;
use JsonException;
use RuntimeException;

final class FeasibilityCapture
{
    public function __construct(private readonly ?string $directory = null) {}

    /**
     * @return list<string>
     */
    public function save(FootballFeed $football, OddsFeed $odds): array
    {
        $directory = $this->directory ?? storage_path('feasibility');
        if (! is_dir($directory) && ! mkdir($directory, 0700, true) && ! is_dir($directory)) {
            throw new RuntimeException('Impossible de créer le dossier de capture de faisabilité.');
        }

        $paths = [];
        foreach ([
            'football' => $football,
            'odds' => $odds,
        ] as $provider => $feed) {
            $payload = $feed->rawResponse;
            if ($payload !== null) {
                $payload = $this->redact($payload);
            }

            try {
                $contents = json_encode([
                    'captured_at' => now()->toIso8601String(),
                    'provider' => $provider,
                    'driver' => $feed->driver,
                    'status' => $feed->statusMessage,
                    'raw_response' => $payload,
                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
            } catch (JsonException $exception) {
                throw new RuntimeException('Impossible d’encoder une capture de faisabilité.', previous: $exception);
            }

            $path = $directory.DIRECTORY_SEPARATOR.$provider.'-'.now()->format('Ymd-His').'-'.Str::lower(Str::random(8)).'.json';
            if (file_put_contents($path, $contents, LOCK_EX) === false) {
                throw new RuntimeException("Impossible d’enregistrer la capture de faisabilité du fournisseur {$provider}.");
            }
            $paths[] = $path;
        }

        return $paths;
    }

    private function redact(string $payload): string
    {
        $secrets = array_filter([
            (string) config('services.football_api.api_key'),
            (string) config('services.odds_api.api_key'),
        ]);
        foreach ($secrets as $secret) {
            $payload = str_replace($secret, '[REDACTED]', $payload);
        }

        $decoded = json_decode($payload, true);
        if (! is_array($decoded)) {
            return $payload;
        }

        $redacted = $this->redactSensitiveFields($decoded);

        try {
            return json_encode($redacted, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
        } catch (JsonException $exception) {
            throw new RuntimeException('Impossible de masquer les champs sensibles de la capture.', previous: $exception);
        }
    }

    private function redactSensitiveFields(array $data): array
    {
        foreach ($data as $key => $value) {
            if (is_string($key) && preg_match('/key|token|secret|credential|authorization/i', $key) === 1) {
                $data[$key] = '[REDACTED]';
            } elseif (is_array($value)) {
                $data[$key] = $this->redactSensitiveFields($value);
            }
        }

        return $data;
    }
}
