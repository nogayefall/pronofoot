<?php

namespace App\Logging;

use Illuminate\Log\Logger;

/**
 * « tap » Laravel : ajoute le masquage des secrets à un canal de journalisation.
 */
final class RedactSecrets
{
    public function __invoke(Logger $logger): void
    {
        $logger->pushProcessor(SecretRedactor::fromEnvironment());
    }
}
