<?php

declare(strict_types=1);

namespace App\Models\Tenant\Shipping;

use App\Models\Central\Integration\CourierProvider;
use App\Models\Tenant\Order\Order;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 * @property string $tenant_id
 * @property string $order_id
 * @property string $tracking_number
 */
class Shipment extends Model
{
    use BelongsToTenant;
    use HasUlids;

    protected $fillable = [
        'tenant_id',
        'order_id',
        'courier_provider_id',
        'tracking_number',
        'courier_order_id',
        'status',
        'declared_value',
        'cod_amount',
        'courier_charge',
        'pickup_address',
        'delivery_address',
        'weight_gram',
        'dispatched_at',
        'picked_up_at',
        'delivered_at',
        'returned_at',
        'delivery_attempts',
        'raw_response',
    ];

    protected $casts = [
        'declared_value' => 'integer',
        'cod_amount' => 'integer',
        'courier_charge' => 'integer',
        'pickup_address' => 'json',
        'delivery_address' => 'json',
        'weight_gram' => 'integer',
        'dispatched_at' => 'datetime',
        'picked_up_at' => 'datetime',
        'delivered_at' => 'datetime',
        'returned_at' => 'datetime',
        'delivery_attempts' => 'integer',
        'raw_response' => 'json',
    ];

    /**
     * @return BelongsTo<Order, $this>
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * @return BelongsTo<CourierProvider, $this>
     */
    public function courierProvider(): BelongsTo
    {
        return $this->belongsTo(CourierProvider::class);
    }

    /**
     * @return HasMany<ShipmentEvent, $this>
     */
    public function events(): HasMany
    {
        return $this->hasMany(ShipmentEvent::class);
    }
}
