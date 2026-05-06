<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Tenant\Inventory\Inventory;
use App\Models\Tenant\Inventory\StockMovement;
use Exception;
use Illuminate\Support\Facades\DB;

class InventoryService
{
    public function reserve(int|string $inventoryId, int $quantity, string $referenceType, string $referenceId, ?string $note = null): void
    {
        DB::transaction(function () use ($inventoryId, $quantity, $referenceType, $referenceId, $note) {
            $inventory = Inventory::where('id', $inventoryId)->lockForUpdate()->firstOrFail();

            if ($inventory->quantity_available < $quantity) {
                throw new Exception('Insufficient stock available.');
            }

            $before = $inventory->quantity_on_hand;
            $inventory->increment('quantity_reserved', $quantity);
            $inventory->refresh();
            $after = $inventory->quantity_on_hand; // quantity_on_hand doesn't change on reserve, only reserved

            $this->logMovement($inventory, 'reserved', $quantity, $before, $after, $referenceType, $referenceId, $note);
        });
    }

    public function release(int|string $inventoryId, int $quantity, string $referenceType, string $referenceId, ?string $note = null): void
    {
        DB::transaction(function () use ($inventoryId, $quantity, $referenceType, $referenceId, $note) {
            $inventory = Inventory::where('id', $inventoryId)->lockForUpdate()->firstOrFail();

            $before = $inventory->quantity_on_hand;
            $inventory->decrement('quantity_reserved', $quantity);
            $inventory->refresh();
            $after = $inventory->quantity_on_hand;

            $this->logMovement($inventory, 'released', -$quantity, $before, $after, $referenceType, $referenceId, $note);
        });
    }

    public function deduct(int|string $inventoryId, int $quantity, string $referenceType, string $referenceId, bool $wasReserved = true, ?string $note = null): void
    {
        DB::transaction(function () use ($inventoryId, $quantity, $referenceType, $referenceId, $wasReserved, $note) {
            $inventory = Inventory::where('id', $inventoryId)->lockForUpdate()->firstOrFail();

            $before = $inventory->quantity_on_hand;
            $inventory->decrement('quantity_on_hand', $quantity);
            if ($wasReserved) {
                $inventory->decrement('quantity_reserved', $quantity);
            }
            $inventory->refresh();
            $after = $inventory->quantity_on_hand;

            $this->logMovement($inventory, 'stock_out', -$quantity, $before, $after, $referenceType, $referenceId, $note);
        });
    }

    public function adjust(int|string $inventoryId, int $newQuantity, string $reason, ?string $note = null): void
    {
        DB::transaction(function () use ($inventoryId, $newQuantity, $reason, $note) {
            $inventory = Inventory::where('id', $inventoryId)->lockForUpdate()->firstOrFail();

            $before = $inventory->quantity_on_hand;
            $diff = $newQuantity - $before;

            $inventory->update(['quantity_on_hand' => $newQuantity]);
            $inventory->refresh();
            $after = $inventory->quantity_on_hand;

            $this->logMovement($inventory, 'adjusted', $diff, $before, $after, 'adjustment', $reason, $note);
        });
    }

    protected function logMovement(Inventory $inventory, string $type, int $quantity, int $before, int $after, string $refType, string $refId, ?string $note): void
    {
        StockMovement::create([
            'tenant_id' => $inventory->tenant_id,
            'inventory_id' => $inventory->id,
            'type' => $type,
            'quantity' => $quantity,
            'quantity_before' => $before,
            'quantity_after' => $after,
            'reference_type' => $refType,
            'reference_id' => $refId,
            'note' => $note,
            'created_by' => auth()->id(),
        ]);
    }
}
