<?php

declare(strict_types=1);

namespace App\Http\Controllers\Tenant\Catalog;

use App\Http\Controllers\Controller;
use App\Http\Resources\Tenant\Catalog\ProductResource;
use App\Models\Tenant\Catalog\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request): \Inertia\Response
    {
        $products = Product::with(['category', 'inventories'])
            ->orderBy('name')
            ->paginate(20);

        return Inertia::render('Tenant/Products/Index', [
            'products' => ProductResource::collection($products),
        ]);
    }

    public function show(Product $product): \Inertia\Response
    {
        $product->load(['category', 'variants', 'inventories']);

        return Inertia::render('Tenant/Products/Show', [
            'product' => new ProductResource($product),
        ]);
    }
}
