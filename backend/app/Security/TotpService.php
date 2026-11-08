<?php

namespace App\Security;

use InvalidArgumentException;

final class TotpService
{
    private const int SECRET_BYTES = 20;

    private const int PERIOD_SECONDS = 30;

    private const int CODE_DIGITS = 6;

    public function generateSecret(): string
    {
        return $this->encodeBase32(random_bytes(self::SECRET_BYTES));
    }

    public function verify(string $secret, string $code, ?int $timestamp = null): bool
    {
        if (! preg_match('/^\d{6}$/', $code)) {
            return false;
        }

        $key = $this->decodeBase32($secret);
        $timestamp ??= time();
        $currentCounter = intdiv($timestamp, self::PERIOD_SECONDS);

        foreach ([-1, 0, 1] as $windowOffset) {
            $counter = $currentCounter + $windowOffset;
            if ($counter < 0) {
                continue;
            }

            $expectedCode = $this->codeForCounter($key, $counter);
            if (hash_equals($expectedCode, $code)) {
                return true;
            }
        }

        return false;
    }

    public function currentCode(string $secret, ?int $timestamp = null): string
    {
        $key = $this->decodeBase32($secret);
        $counter = intdiv($timestamp ?? time(), self::PERIOD_SECONDS);

        return $this->codeForCounter($key, $counter);
    }

    public function provisioningUri(string $secret, string $accountName, string $issuer): string
    {
        $label = rawurlencode($issuer.':'.$accountName);
        $query = http_build_query([
            'secret' => $secret,
            'issuer' => $issuer,
            'algorithm' => 'SHA1',
            'digits' => self::CODE_DIGITS,
            'period' => self::PERIOD_SECONDS,
        ]);

        return "otpauth://totp/{$label}?{$query}";
    }

    private function codeForCounter(string $key, int $counter): string
    {
        $counterBytes = hex2bin(str_pad(dechex($counter), 16, '0', STR_PAD_LEFT));
        if ($counterBytes === false) {
            throw new InvalidArgumentException('Le compteur TOTP est invalide.');
        }

        $hash = hash_hmac('sha1', $counterBytes, $key, true);
        $offset = ord($hash[strlen($hash) - 1]) & 0x0F;
        $binaryCode = (
            ((ord($hash[$offset]) & 0x7F) << 24)
            | ((ord($hash[$offset + 1]) & 0xFF) << 16)
            | ((ord($hash[$offset + 2]) & 0xFF) << 8)
            | (ord($hash[$offset + 3]) & 0xFF)
        );

        return str_pad((string) ($binaryCode % (10 ** self::CODE_DIGITS)), self::CODE_DIGITS, '0', STR_PAD_LEFT);
    }

    private function encodeBase32(string $binary): string
    {
        $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        $bits = '';

        foreach (str_split($binary) as $byte) {
            $bits .= str_pad(decbin(ord($byte)), 8, '0', STR_PAD_LEFT);
        }

        $encoded = '';
        foreach (str_split($bits, 5) as $chunk) {
            if (strlen($chunk) < 5) {
                $chunk = str_pad($chunk, 5, '0', STR_PAD_RIGHT);
            }

            $encoded .= $alphabet[bindec($chunk)];
        }

        return $encoded;
    }

    private function decodeBase32(string $encoded): string
    {
        $encoded = strtoupper(rtrim($encoded, '='));
        if ($encoded === '' || preg_match('/[^A-Z2-7]/', $encoded)) {
            throw new InvalidArgumentException('Le secret TOTP Base32 est invalide.');
        }

        $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        $bits = '';
        foreach (str_split($encoded) as $character) {
            $value = strpos($alphabet, $character);
            if ($value === false) {
                throw new InvalidArgumentException('Le secret TOTP Base32 est invalide.');
            }

            $bits .= str_pad(decbin($value), 5, '0', STR_PAD_LEFT);
        }

        $binary = '';
        foreach (str_split($bits, 8) as $byte) {
            if (strlen($byte) === 8) {
                $binary .= chr(bindec($byte));
            }
        }

        if ($binary === '') {
            throw new InvalidArgumentException('Le secret TOTP Base32 est invalide.');
        }

        return $binary;
    }
}
