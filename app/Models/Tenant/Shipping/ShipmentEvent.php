<?php

declare(strict_types=1);

namespace App\Models\Tenant\Shipping;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property string $shipment_id
 */
class ShipmentEvent extends Model
{
    protected $fillable = [
        'shipment_id',
        'status',
        'location',
        'description',
        'event_at',
        'raw_data',
    ];

    protected $casts = [
        'event_at' => 'datetime',
        'raw_data' => 'json',
    ];

    /**
     * @return BelongsTo<Shipment, $this>
     */
    public function shipment(): BelongsTo
    {
        return $this->belongsTo(Shipment::class);
    }
}
