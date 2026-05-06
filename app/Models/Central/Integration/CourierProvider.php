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
class CourierProvider extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'logo_path',
        'api_base_url',
        'supports_partial_delivery',
        'supports_exchange',
        'cod_charge_type',
        'cod_charge_value',
        'is_active',
        'config_schema',
    ];

    protected $casts = [
        'supports_partial_delivery' => 'boolean',
        'supports_exchange' => 'boolean',
        'cod_charge_value' => 'float',
        'is_active' => 'boolean',
        'config_schema' => 'json',
    ];

    /**
     * @return HasMany<\App\Models\Tenant\Shipping\TenantCourierAccount, $this>
     */
    public function tenantAccounts(): HasMany
    {
        return $this->hasMany(\App\Models\Tenant\Shipping\TenantCourierAccount::class);
    }
}
