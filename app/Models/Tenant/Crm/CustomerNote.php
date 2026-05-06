<?php

declare(strict_types=1);

namespace App\Models\Tenant\Crm;

use App\Models\Tenant\Auth\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property string $tenant_id
 * @property string $customer_id
 */
class CustomerNote extends Model
{
    protected $fillable = [
        'customer_id',
        'tenant_id',
        'note',
        'type',
        'created_by',
    ];

    /**
     * @return BelongsTo<Customer, $this>
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
