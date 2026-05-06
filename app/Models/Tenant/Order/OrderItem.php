<?php

declare(strict_types=1);

namespace App\Models\Tenant\Order;

use App\Models\Tenant\Catalog\Product;
use App\Models\Tenant\Catalog\ProductVariant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $order_id
 * @property string $tenant_id
 * @property string $product_id
 * @property string|null $variant_id
 * @property string $product_name
 * @property string|null $variant_name
 * @property string|null $sku
 * @property int $quantity
 * @property int $unit_price
 * @property int $total_price
 */
class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'tenant_id',
        'product_id',
        'variant_id',
        'product_name',
        'variant_name',
        'sku',
        'quantity',
        'unit_price',
        'cost_price',
        'discount_amount',
        'total_price',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'integer',
        'cost_price' => 'integer',
        'discount_amount' => 'integer',
        'total_price' => 'integer',
    ];

    /**
     * @return BelongsTo<Order, $this>
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * @return BelongsTo<ProductVariant, $this>
     */
    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class);
    }
}
