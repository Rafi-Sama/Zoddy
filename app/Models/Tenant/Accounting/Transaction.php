<?php

declare(strict_types=1);

namespace App\Models\Tenant\Accounting;

use App\Models\Tenant\Auth\User;
use App\Models\Tenant\Order\Order;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $tenant_id
 * @property string|null $order_id
 * @property int $amount
 */
class Transaction extends Model
{
    use \App\Traits\HasAuditLog;
    use BelongsToTenant;
    use HasUlids;

    protected $fillable = [
        'tenant_id',
        'order_id',
        'type',
        'direction',
        'amount',
        'payment_method',
        'gateway_txn_id',
        'reference_type',
        'reference_id',
        'note',
        'transaction_date',
        'created_by',
    ];

    protected $casts = [
        'amount' => 'integer',
        'transaction_date' => 'date',
    ];

    /**
     * @return BelongsTo<Order, $this>
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
