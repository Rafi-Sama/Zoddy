<?php

declare(strict_types=1);

namespace App\Models\Central\Integration;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 */
class PaymentGateway extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'logo_path',
        'is_active',
        'config_schema',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'config_schema' => 'json',
    ];

    /**
     * @return HasMany<\App\Models\Tenant\Accounting\TenantPaymentGateway, $this>
     */
    public function tenantGateways(): HasMany
    {
        return $this->hasMany(\App\Models\Tenant\Accounting\TenantPaymentGateway::class);
    }
}
