<?php

declare(strict_types=1);

namespace App\Http\Resources\Tenant\Catalog;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Tenant\Catalog\ProductVariant
 */
class ProductVariantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'sku' => $this->sku,
            'name' => $this->name,
            'attributes' => $this->attributes,
            'selling_price' => $this->selling_price,
            'cost_price' => $this->cost_price,
            'is_active' => $this->is_active,
            'stock_available' => $this->inventories->sum('quantity_available'),
        ];
    }
}
