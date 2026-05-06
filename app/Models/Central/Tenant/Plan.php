<?php

declare(strict_types=1);

namespace App\Models\Central\Tenant;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $name
 */
class Plan extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'price_monthly',
        'price_yearly',
        'order_limit',
        'user_limit',
        'social_accounts_limit',
        'features',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'features' => 'json',
        'is_active' => 'boolean',
        'price_monthly' => 'integer',
        'price_yearly' => 'integer',
        'order_limit' => 'integer',
        'user_limit' => 'integer',
        'social_accounts_limit' => 'integer',
        'sort_order' => 'integer',
    ];

    /**
     * @return HasMany<Tenant, $this>
     */
    public function tenants(): HasMany
    {
        return $this->hasMany(Tenant::class);
    }
}
