<?php

declare(strict_types=1);

namespace App\Services\Couriers\Contracts;

use App\Models\Tenant\Order\Order;

interface CourierDriver
{
    /**
     * @param array<string, mixed> $params
     *
     * @return array<string, mixed>
     */
    public function createOrder(Order $order, array $params = []): array;

    public function cancelOrder(string $trackingNumber): bool;

    /**
     * @return array<string, mixed>
     */
    public function getTrackDetails(string $trackingNumber): array;

    /**
     * @param array<string, mixed> $params
     */
    public function getPrice(array $params): int;
}
