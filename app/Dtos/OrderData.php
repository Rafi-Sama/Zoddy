<?php

declare(strict_types=1);

namespace App\Dtos;

class OrderData
{
    /**
     * @param list<array<string, mixed>> $items
     */
    public function __construct(
        public readonly string $tenantId,
        public readonly string $customerId,
        public readonly array $items,
        public readonly string $shippingName,
        public readonly string $shippingPhone,
        public readonly string $shippingAddress,
        public readonly string $shippingDistrict,
        public readonly ?string $shippingUpazila = null,
        public readonly string $paymentMethod = 'cod',
        public readonly int $shippingCharge = 0,
        public readonly int $discountAmount = 0,
        public readonly ?string $notes = null,
        public readonly string $source = 'manual',
    ) {}

    /**
     * @param array<string, mixed> $data
     */
    public static function fromRequest(array $data, string $tenantId): self
    {
        return new self(
            tenantId: $tenantId,
            customerId: $data['customer_id'],
            items: $data['items'],
            shippingName: $data['shipping_name'],
            shippingPhone: $data['shipping_phone'],
            shippingAddress: $data['shipping_address'],
            shippingDistrict: $data['shipping_district'],
            shippingUpazila: $data['shipping_upazila'] ?? null,
            paymentMethod: $data['payment_method'] ?? 'cod',
            shippingCharge: $data['shipping_charge'] ?? 0,
            discountAmount: $data['discount_amount'] ?? 0,
            notes: $data['notes'] ?? null,
            source: $data['source'] ?? 'manual',
        );
    }
}
