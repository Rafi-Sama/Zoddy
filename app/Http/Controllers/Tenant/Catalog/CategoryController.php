<?php

declare(strict_types=1);

namespace App\Http\Controllers\Tenant\Catalog;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\Catalog\StoreCategoryRequest;
use App\Models\Tenant\Catalog\Category;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index(): \Inertia\Response
    {
        $categories = Category::with('parent')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Tenant/Catalog/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function store(StoreCategoryRequest $request): \Illuminate\Http\RedirectResponse
    {
        Category::create([
            'tenant_id' => tenant('id'),
            ...$request->validated(),
        ]);

        return back()->with('success', 'Category created.');
    }

    public function update(StoreCategoryRequest $request, Category $category): \Illuminate\Http\RedirectResponse
    {
        $category->update($request->validated());

        return back()->with('success', 'Category updated.');
    }

    public function destroy(Category $category): \Illuminate\Http\RedirectResponse
    {
        $category->delete();

        return back()->with('success', 'Category deleted.');
    }
}
