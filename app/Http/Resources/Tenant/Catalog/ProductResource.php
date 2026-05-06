<?php

declare(strict_types=1);

namespace App\Http\Resources\Tenant\Catalog;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Tenant\Catalog\Product
 */
class ProductResource extends JsonResource
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
            'name' => $this->name,
            'sku' => $this->sku,
            'selling_price' => $this->selling_price,
            'cost_price' => $this->cost_price,
            'has_variants' => $this->has_variants,
            'is_active' => $this->is_active,
            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category->id,
                'name' => $this->category->name,
            ]),
            'variants' => ProductVariantResource::collection($this->whenLoaded('variants')),
            'stock_available' => $this->inventories->sum('quantity_available'),
        ];
    }
}
