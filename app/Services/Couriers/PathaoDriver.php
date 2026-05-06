<?php

declare(strict_types=1);

namespace App\Services\Couriers;

use App\Models\Tenant\Order\Order;
use App\Services\Couriers\Contracts\CourierDriver;
use Illuminate\Support\Facades\Http;

class PathaoDriver implements CourierDriver
{
    protected string $baseUrl;

    protected string $accessToken;

    /**
     * @param array<string, mixed> $config
     */
    public function __construct(array $config)
    {
        $this->baseUrl = $config['api_base_url'] ?? 'https://api-hermes.pathao.com';
        $this->accessToken = $config['access_token'] ?? '';
    }

    /**
     * @param array<string, mixed> $params
     *
     * @return array<string, mixed>
     */
    public function createOrder(Order $order, array $params = []): array
    {
        // Pathao API implementation
        // $response = Http::withToken($this->accessToken)->post("{$this->baseUrl}/api/v1/orders", [...]);

        return [
            'tracking_number' => 'PTH-'.strtoupper(bin2hex(random_bytes(4))),
            'courier_order_id' => 'EXT-'.rand(100000, 999999),
        ];
    }

    public function cancelOrder(string $trackingNumber): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function getTrackDetails(string $trackingNumber): array
    {
        return [
            'status' => 'picked_up',
            'history' => [],
        ];
    }

    /**
     * @param array<string, mixed> $params
     */
    public function getPrice(array $params): int
    {
        return 6000; // 60 BDT
    }
}
