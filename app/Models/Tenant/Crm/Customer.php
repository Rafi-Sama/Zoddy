<?php

declare(strict_types=1);

namespace App\Models\Tenant\Crm;

use App\Models\Tenant\Order\Order;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string $id
 * @property string $tenant_id
 * @property string $name
 * @property string $phone
 * @property int $total_orders
 * @property int $total_spent
 * @property int $cod_attempted
 * @property int $cod_success
 */
class Customer extends Model
{
    use \App\Traits\HasAuditLog;
    use BelongsToTenant;
    use HasUlids;
    use \Laravel\Scout\Searchable;
    use SoftDeletes;

    protected $fillable = [
        'tenant_id',
        'name',
        'phone',
        'phone_alt',
        'email',
        'fb_psid',
        'instagram_id',
        'district',
        'upazila',
        'default_address',
        'total_orders',
        'total_spent',
        'cod_attempted',
        'cod_success',
        'cod_refused',
        'risk_score',
        'tags',
        'notes',
        'is_blacklisted',
        'blacklist_reason',
        'blacklisted_at',
        'blacklisted_by',
        'source',
    ];

    protected $casts = [
        'default_address' => 'json',
        'total_orders' => 'integer',
        'total_spent' => 'integer',
        'cod_attempted' => 'integer',
        'cod_success' => 'integer',
        'cod_refused' => 'integer',
        'risk_score' => 'integer',
        'tags' => 'json',
        'is_blacklisted' => 'boolean',
        'blacklisted_at' => 'datetime',
    ];

    /**
     * @return HasMany<CustomerAddress, $this>
     */
    public function addresses(): HasMany
    {
        return $this->hasMany(CustomerAddress::class);
    }

    /**
     * @return HasMany<Order, $this>
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * @return HasMany<CustomerNote, $this>
     */
    public function noteLogs(): HasMany
    {
        return $this->hasMany(CustomerNote::class);
    }

    /**
     * Get COD success rate.
     */
    public function getCodSuccessRateAttribute(): float
    {
        if ($this->cod_attempted === 0) {
            return 0;
        }

        return ($this->cod_success / $this->cod_attempted) * 100;
    }
}
