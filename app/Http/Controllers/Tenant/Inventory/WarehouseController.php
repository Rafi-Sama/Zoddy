<?php

declare(strict_types=1);

namespace App\Http\Controllers\Tenant\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Inventory\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WarehouseController extends Controller
{
    public function index(): \Inertia\Response
    {
        $warehouses = Warehouse::all();

        return Inertia::render('Tenant/Inventory/Warehouses/Index', [
            'warehouses' => $warehouses,
        ]);
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'location' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        Warehouse::create([
            'tenant_id' => tenant('id'),
            ...$validated,
        ]);

        return back()->with('success', 'Warehouse added.');
    }
}
