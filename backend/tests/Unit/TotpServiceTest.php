<?php

namespace Tests\Unit;

use App\Security\TotpService;
use InvalidArgumentException;
use PHPUnit\Framework\TestCase;

class TotpServiceTest extends TestCase
{
    public function test_it_verifies_the_rfc_6238_sha1_test_vectors(): void
    {
        $service = new TotpService;
        $secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';

        $this->assertTrue($service->verify($secret, '287082', 59));
        $this->assertTrue($service->verify($secret, '081804', 1_111_111_109));
        $this->assertFalse($service->verify($secret, '287083', 59));
    }

    public function test_it_can_display_a_current_totp_code_for_local_development(): void
    {
        $service = new TotpService;
        $code = $service->currentCode('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ', 59);

        $this->assertSame('287082', $code);
        $this->assertTrue($service->verify('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ', $code, 59));
    }

    public function test_it_rejects_malformed_authenticator_codes(): void
    {
        $service = new TotpService;

        $this->assertFalse($service->verify('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ', '12345', 59));
        $this->assertFalse($service->verify('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ', 'abcdef', 59));
    }

    public function test_it_rejects_invalid_base32_secrets(): void
    {
        $this->expectException(InvalidArgumentException::class);

        (new TotpService)->verify('INVALID0', '123456', 59);
    }

    public function test_it_generates_a_valid_base32_secret_and_provisioning_uri(): void
    {
        $service = new TotpService;
        $secret = $service->generateSecret();
        $uri = $service->provisioningUri($secret, 'admin@example.com', 'PronoFoot');

        $this->assertMatchesRegularExpression('/^[A-Z2-7]{32}$/', $secret);
        $this->assertStringStartsWith('otpauth://totp/PronoFoot%3Aadmin%40example.com?', $uri);
        $this->assertStringContainsString("secret={$secret}", $uri);
        $this->assertStringContainsString('digits=6', $uri);
        $this->assertStringContainsString('period=30', $uri);
    }
}
