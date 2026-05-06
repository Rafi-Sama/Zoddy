<?php

declare(strict_types=1);

namespace App\Dtos;

class CustomerData
{
    public function __construct(
        public readonly string $tenantId,
        public readonly string $name,
        public readonly string $phone,
        public readonly ?string $email = null,
        public readonly string $source = 'manual',
        public readonly ?string $fbPsid = null,
        public readonly ?string $instagramId = null,
    ) {}

    /**
     * @param array<string, mixed> $data
     */
    public static function fromArray(array $data, string $tenantId): self
    {
        return new self(
            tenantId: $tenantId,
            name: $data['name'] ?? 'New Customer',
            phone: $data['phone'],
            email: $data['email'] ?? null,
            source: $data['source'] ?? 'manual',
            fbPsid: $data['fb_psid'] ?? null,
            instagramId: $data['instagram_id'] ?? null,
        );
    }
}
