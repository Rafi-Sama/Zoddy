<?php

declare(strict_types=1);

namespace App\Models\Tenant\Crm;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property string $customer_id
 */
class CustomerAddress extends Model
{
    protected $fillable = [
        'customer_id',
        'label',
        'address_line1',
        'address_line2',
        'district',
        'upazila',
        'landmark',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    /**
     * @return BelongsTo<Customer, $this>
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
