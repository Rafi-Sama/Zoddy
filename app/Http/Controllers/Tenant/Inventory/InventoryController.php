<?php

declare(strict_types=1);

namespace App\Http\Controllers\Tenant\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Inventory\Inventory;
use App\Models\Tenant\Inventory\StockMovement;
use App\Services\InventoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function __construct(
        protected InventoryService $inventoryService,
    ) {}

    public function index(): \Inertia\Response
    {
        $inventory = Inventory::with(['product', 'variant', 'warehouse'])
            ->paginate(20);

        return Inertia::render('Tenant/Inventory/Index', [
            'inventory' => $inventory,
        ]);
    }

    public function logs(Inventory $inventory): \Inertia\Response
    {
        $logs = StockMovement::where('inventory_id', $inventory->id)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(30);

        return Inertia::render('Tenant/Inventory/Logs', [
            'inventory' => $inventory->load(['product', 'variant']),
            'logs' => $logs,
        ]);
    }

    public function adjust(Request $request, Inventory $inventory): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'quantity' => 'required|integer',
            'reason' => 'required|string',
            'note' => 'nullable|string',
        ]);

        $this->inventoryService->adjust(
            (string) $inventory->id,
            $request->integer('quantity'),
            (string) $request->string('reason'),
            (string) $request->string('note'),
        );

        return back()->with('success', 'Stock adjusted successfully.');
    }
}
