<?php

declare(strict_types=1);

namespace App\Enums;

enum ShipmentStatus: string
{
    case CREATED = 'created';
    case PICKUP_REQUESTED = 'pickup_requested';
    case PICKED_UP = 'picked_up';
    case IN_TRANSIT = 'in_transit';
    case OUT_FOR_DELIVERY = 'out_for_delivery';
    case DELIVERED = 'delivered';
    case DELIVERY_FAILED = 'delivery_failed';
    case RETURNED = 'returned';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::CREATED => 'Created',
            self::PICKUP_REQUESTED => 'Pickup Requested',
            self::PICKED_UP => 'Picked Up',
            self::IN_TRANSIT => 'In Transit',
            self::OUT_FOR_DELIVERY => 'Out for Delivery',
            self::DELIVERED => 'Delivered',
            self::DELIVERY_FAILED => 'Delivery Failed',
            self::RETURNED => 'Returned',
            self::CANCELLED => 'Cancelled',
        };
    }
}
