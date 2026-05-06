<?php

declare(strict_types=1);

namespace App\Models\Tenant\Shipping;

use App\Models\Central\Integration\CourierProvider;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $tenant_id
 */
class TenantCourierAccount extends Model
{
    use BelongsToTenant;
    use HasUlids;

    protected $fillable = [
        'tenant_id',
        'courier_provider_id',
        'api_key',
        'api_secret',
        'store_id',
        'merchant_id',
        'default_pickup',
        'is_active',
        'is_default',
    ];

    protected $casts = [
        'api_key' => 'encrypted',
        'api_secret' => 'encrypted',
        'default_pickup' => 'json',
        'is_active' => 'boolean',
        'is_default' => 'boolean',
    ];

    /**
     * @return BelongsTo<CourierProvider, $this>
     */
    public function courierProvider(): BelongsTo
    {
        return $this->belongsTo(CourierProvider::class);
    }
}
