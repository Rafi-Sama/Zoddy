<?php

declare(strict_types=1);

namespace App\Models\Tenant\Order;

use App\Models\Tenant\Accounting\Transaction;
use App\Models\Tenant\Auth\User;
use App\Models\Tenant\Crm\Customer;
use App\Models\Tenant\Shipping\Shipment;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string $id
 * @property string $tenant_id
 * @property string $order_number
 * @property string $customer_id
 * @property int $subtotal
 * @property int $total_amount
 * @property int $cod_amount
 * @property string $shipping_name
 * @property string $shipping_phone
 * @property string $shipping_address
 * @property string $shipping_district
 * @property string $shipping_upazila
 * @property string $payment_method
 */
class Order extends Model
{
    use \App\Traits\HasAuditLog;
    use BelongsToTenant;
    use HasUlids;
    use \Laravel\Scout\Searchable;
    use SoftDeletes;

    protected $fillable = [
        'tenant_id',
        'order_number',
        'customer_id',
        'source',
        'source_ref',
        'subtotal',
        'discount_type',
        'discount_value',
        'discount_amount',
        'shipping_charge',
        'total_amount',
        'cod_amount',
        'payment_method',
        'payment_status',
        'shipping_name',
        'shipping_phone',
        'shipping_address',
        'shipping_district',
        'shipping_upazila',
        'status',
        'priority',
        'notes',
        'internal_notes',
        'assigned_to',
        'confirmed_at',
        'processing_at',
        'shipped_at',
        'delivered_at',
        'returned_at',
        'cancelled_at',
        'cancelled_reason',
    ];

    protected $casts = [
        'subtotal' => 'integer',
        'discount_value' => 'integer',
        'discount_amount' => 'integer',
        'shipping_charge' => 'integer',
        'total_amount' => 'integer',
        'cod_amount' => 'integer',
        'priority' => 'integer',
        'confirmed_at' => 'datetime',
        'processing_at' => 'datetime',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
        'returned_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    /**
     * @return BelongsTo<Customer, $this>
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * @return HasMany<OrderItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * @return HasMany<OrderStatusHistory, $this>
     */
    public function history(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * @return HasOne<Shipment, $this>
     */
    public function shipment(): HasOne
    {
        return $this->hasOne(Shipment::class);
    }

    /**
     * @return HasMany<Transaction, $this>
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
