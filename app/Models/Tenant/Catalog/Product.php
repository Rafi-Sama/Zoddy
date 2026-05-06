<?php

declare(strict_types=1);

namespace App\Models\Tenant\Catalog;

use App\Models\Tenant\Inventory\Inventory;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string $id
 * @property string $tenant_id
 * @property string $name
 * @property string $sku
 * @property int $cost_price
 * @property int $selling_price
 */
class Product extends Model
{
    use \App\Traits\HasAuditLog;
    use BelongsToTenant;
    use HasUlids;
    use \Laravel\Scout\Searchable;
    use SoftDeletes;

    protected $fillable = [
        'tenant_id',
        'category_id',
        'name',
        'sku',
        'description',
        'cost_price',
        'selling_price',
        'weight_gram',
        'images',
        'has_variants',
        'is_active',
        'low_stock_alert',
    ];

    protected $casts = [
        'cost_price' => 'integer',
        'selling_price' => 'integer',
        'weight_gram' => 'integer',
        'images' => 'json',
        'has_variants' => 'boolean',
        'is_active' => 'boolean',
        'low_stock_alert' => 'integer',
    ];

    /**
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return HasMany<ProductVariant, $this>
     */
    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    /**
     * @return HasMany<Inventory, $this>
     */
    public function inventories(): HasMany
    {
        return $this->hasMany(Inventory::class);
    }
}
