<?php

declare(strict_types=1);

namespace App\Models\Tenant\Inventory;

use App\Models\Tenant\Auth\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property string $tenant_id
 * @property int $inventory_id
 */
class StockMovement extends Model
{
    // No BelongsToTenant trait here because the plan says it's immutable and denormalized
    // "tenant_id ULID NOT NULL -- denormalized, no FK (immutable)"
    // We can still use it for scoping if we want, but let's follow the plan strictly.
    // Actually, BelongsToTenant applies global scope, which is useful.

    protected $fillable = [
        'tenant_id',
        'inventory_id',
        'type',
        'quantity',
        'quantity_before',
        'quantity_after',
        'reference_type',
        'reference_id',
        'note',
        'created_by',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'quantity_before' => 'integer',
        'quantity_after' => 'integer',
    ];

    /**
     * @return BelongsTo<Inventory, $this>
     */
    public function inventory(): BelongsTo
    {
        return $this->belongsTo(Inventory::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->creator();
    }
}
