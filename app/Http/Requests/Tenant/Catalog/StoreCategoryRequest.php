<?php

declare(strict_types=1);

namespace App\Http\Requests\Tenant\Catalog;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
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
            'parent_id' => 'nullable|exists:categories,id',
            'name' => 'required|string|max:100',
            'slug' => 'required|string|max:120|unique:categories,slug,'.($this->category ? $this->category->id : 'NULL').',id,tenant_id,'.tenant('id'),
            'sort_order' => 'integer|min:0',
            'is_active' => 'boolean',
        ];
    }
}
