<?php

declare(strict_types=1);

namespace App\Models\Tenant\Catalog;

use App\Models\Tenant\Inventory\Inventory;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 * @property string $product_id
 * @property string $tenant_id
 * @property string $sku
 * @property string $name
 * @property int $cost_price
 * @property int $selling_price
 */
class ProductVariant extends Model
{
    use BelongsToTenant;
    use HasUlids;

    protected $fillable = [
        'product_id',
        'tenant_id',
        'sku',
        'name',
        'attributes',
        'cost_price',
        'selling_price',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'attributes' => 'json',
        'cost_price' => 'integer',
        'selling_price' => 'integer',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * @return HasMany<Inventory, $this>
     */
    public function inventories(): HasMany
    {
        return $this->hasMany(Inventory::class, 'variant_id');
    }
}
