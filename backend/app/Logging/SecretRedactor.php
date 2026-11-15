<?php

namespace App\Logging;

use Monolog\LogRecord;
use Monolog\Processor\ProcessorInterface;

/**
 * Masque dans les journaux les clés, jetons et mots de passe connus de l’application (variables d’environnement
 * dont le nom contient KEY, TOKEN, SECRET ou PASSWORD, et clé d’application), dans le message comme dans le contexte.
 */
final class SecretRedactor implements ProcessorInterface
{
    public const MASK = '[masqué]';

    /**
     * @param  list<string>  $secrets
     */
    public function __construct(private readonly array $secrets) {}

    public static function fromEnvironment(): self
    {
        $candidates = [config('app.key')];
        foreach ([$_ENV, $_SERVER, getenv()] as $variables) {
            foreach ($variables as $name => $value) {
                if (is_string($name) && is_string($value) && preg_match('/(KEY|TOKEN|SECRET|PASSWORD)/i', $name) === 1) {
                    $candidates[] = $value;
                }
            }
        }
        foreach (['services.football_api.api_key', 'services.odds_api.api_key', 'services.telegram.bot_token'] as $path) {
            $candidates[] = config($path);
        }

        $secrets = array_filter(
            $candidates,
            fn (mixed $value): bool => is_string($value) && strlen(trim($value)) >= 8,
        );
        $chatId = config('services.telegram.chat_id');
        if (is_scalar($chatId) && strlen(trim((string) $chatId)) >= 5) {
            $secrets[] = trim((string) $chatId);
        }
        $secrets = array_values(array_unique($secrets));
        usort($secrets, fn (string $a, string $b): int => strlen($b) <=> strlen($a));

        return new self($secrets);
    }

    public function __invoke(LogRecord $record): LogRecord
    {
        return $record->with(
            message: $this->redact($record->message),
            context: $this->redactArray($record->context),
            extra: $this->redactArray($record->extra),
        );
    }

    public function redact(string $text): string
    {
        return $this->secrets === [] ? $text : str_replace($this->secrets, self::MASK, $text);
    }

    /**
     * @param  array<mixed>  $values
     * @return array<mixed>
     */
    private function redactArray(array $values): array
    {
        foreach ($values as $key => $value) {
            $values[$key] = match (true) {
                is_string($value) => $this->redact($value),
                is_array($value) => $this->redactArray($value),
                $value instanceof \Throwable => $this->redact($value::class.': '.$value->getMessage()),
                default => $value,
            };
        }

        return $values;
    }
}
