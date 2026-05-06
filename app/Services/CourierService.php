<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Tenant\Order\Order;
use App\Models\Tenant\Shipping\Shipment;
use App\Services\Couriers\Contracts\CourierDriver;
use Exception;
use Illuminate\Support\Facades\App;

class CourierService
{
    /**
     * @param array<string, mixed> $params
     */
    public function dispatch(Order $order, string $providerSlug, array $params = []): Shipment
    {
        $driver = $this->getDriver($providerSlug);
        $response = $driver->createOrder($order, $params);

        /** @var Shipment $shipment */
        $shipment = Shipment::create([
            'tenant_id' => $order->tenant_id,
            'order_id' => $order->id,
            'courier_provider_id' => $params['provider_id'],
            'tracking_number' => $response['tracking_number'],
            'courier_order_id' => $response['courier_order_id'],
            'status' => 'created',
            'declared_value' => $order->total_amount,
            'cod_amount' => $order->cod_amount,
            'pickup_address' => $params['pickup_address'],
            'delivery_address' => [
                'name' => $order->shipping_name,
                'phone' => $order->shipping_phone,
                'address' => $order->shipping_address,
                'district' => $order->shipping_district,
                'upazila' => $order->shipping_upazila,
            ],
            'raw_response' => $response,
        ]);

        return $shipment;
    }

    protected function getDriver(string $slug): CourierDriver
    {
        $className = 'App\\Services\\Couriers\\'.ucfirst($slug).'Driver';

        if (! class_exists($className)) {
            throw new Exception("Courier driver for {$slug} not found.");
        }

        return App::make($className);
    }
}
