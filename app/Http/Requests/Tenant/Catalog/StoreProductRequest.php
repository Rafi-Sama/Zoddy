<?php

declare(strict_types=1);

namespace App\Http\Requests\Tenant\Catalog;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'category_id' => 'nullable|exists:categories,id',
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:100|unique:products,sku,'.($this->product ? $this->product->id : 'NULL').',id,tenant_id,'.tenant('id'),
            'description' => 'nullable|string',
            'cost_price' => 'required|integer|min:0',
            'selling_price' => 'required|integer|min:0',
            'weight_gram' => 'nullable|integer|min:0',
            'images' => 'nullable|array',
            'has_variants' => 'boolean',
            'is_active' => 'boolean',
            'low_stock_alert' => 'integer|min:0',
        ];
    }
}
