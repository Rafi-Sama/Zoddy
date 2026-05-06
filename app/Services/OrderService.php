<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\OrderStatus;
use App\Events\OrderStatusChanged;
use App\Models\Tenant\Order\Order;
use App\Models\Tenant\Order\OrderStatusHistory;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function transition(Order $order, OrderStatus $newStatus, ?string $note = null): Order
    {
        $oldStatus = $order->status;

        if ($oldStatus === $newStatus->value) {
            return $order;
        }

        return DB::transaction(function () use ($order, $oldStatus, $newStatus, $note) {
            $updateData = ['status' => $newStatus->value];
            if ($timestampField = $this->getStatusTimestampField($newStatus)) {
                $updateData[$timestampField] = now();
            }
            $order->update($updateData);

            OrderStatusHistory::create([
                'order_id' => $order->id,
                'tenant_id' => $order->tenant_id,
                'from_status' => $oldStatus,
                'to_status' => $newStatus->value,
                'note' => $note,
                'changed_by' => auth()->id(),
                'changed_by_name' => auth()->check() ? auth()->user()->name : 'System',
            ]);

            // Inventory Logic
            if ($newStatus === OrderStatus::CONFIRMED) {
                $this->reserveInventory($order);
            } elseif ($newStatus === OrderStatus::CANCELLED && $oldStatus !== OrderStatus::PENDING->value) {
                $this->releaseInventory($order);
            } elseif ($newStatus === OrderStatus::SHIPPED) {
                $wasReserved = $oldStatus !== OrderStatus::PENDING->value;
                $this->deductInventory($order, $wasReserved);
            }

            event(new OrderStatusChanged($order, $oldStatus, $newStatus->value, $note));

            return $order;
        });
    }

    protected function reserveInventory(Order $order): void
    {
        $inventoryService = app(InventoryService::class);
        foreach ($order->items as $item) {
            // Find inventory for the product/variant in the default warehouse
            /** @var \App\Models\Tenant\Inventory\Inventory|null $inventory */
            $inventory = \App\Models\Tenant\Inventory\Inventory::where('product_id', $item->product_id)
                ->where('variant_id', $item->variant_id)
                ->first(); // Should use default warehouse logic here

            if ($inventory) {
                $inventoryService->reserve($inventory->id, $item->quantity, 'order', $order->id);
            }
        }
    }

    protected function releaseInventory(Order $order): void
    {
        $inventoryService = app(InventoryService::class);
        foreach ($order->items as $item) {
            /** @var \App\Models\Tenant\Inventory\Inventory|null $inventory */
            $inventory = \App\Models\Tenant\Inventory\Inventory::where('product_id', $item->product_id)
                ->where('variant_id', $item->variant_id)
                ->first();

            if ($inventory) {
                $inventoryService->release($inventory->id, $item->quantity, 'order', $order->id);
            }
        }
    }

    protected function deductInventory(Order $order, bool $wasReserved = true): void
    {
        $inventoryService = app(InventoryService::class);
        foreach ($order->items as $item) {
            /** @var \App\Models\Tenant\Inventory\Inventory|null $inventory */
            $inventory = \App\Models\Tenant\Inventory\Inventory::where('product_id', $item->product_id)
                ->where('variant_id', $item->variant_id)
                ->first();

            if ($inventory) {
                $inventoryService->deduct($inventory->id, $item->quantity, 'order', $order->id, $wasReserved);
            }
        }
    }

    public function createOrder(\App\Dtos\OrderData $data): Order
    {
        return DB::transaction(function () use ($data) {
            $orderNumber = $this->generateOrderNumber($data->tenantId);

            $order = Order::create([
                'tenant_id' => $data->tenantId,
                'order_number' => $orderNumber,
                'customer_id' => $data->customerId,
                'source' => $data->source,
                'subtotal' => 0, // Will update after items
                'shipping_charge' => $data->shippingCharge,
                'discount_amount' => $data->discountAmount,
                'total_amount' => 0,
                'payment_method' => $data->paymentMethod,
                'shipping_name' => $data->shippingName,
                'shipping_phone' => $data->shippingPhone,
                'shipping_address' => $data->shippingAddress,
                'shipping_district' => $data->shippingDistrict,
                'shipping_upazila' => $data->shippingUpazila,
                'status' => OrderStatus::PENDING->value,
                'notes' => $data->notes,
            ]);

            $subtotal = 0;
            foreach ($data->items as $itemData) {
                /** @var \App\Models\Tenant\Catalog\Product $product */
                $product = \App\Models\Tenant\Catalog\Product::findOrFail($itemData['product_id']);
                /** @var \App\Models\Tenant\Catalog\ProductVariant|null $variant */
                $variant = isset($itemData['variant_id']) ? \App\Models\Tenant\Catalog\ProductVariant::find($itemData['variant_id']) : null;

                $price = $variant ? ($variant->selling_price ?? $product->selling_price) : $product->selling_price;

                $orderItem = $order->items()->create([
                    'tenant_id' => $order->tenant_id,
                    'product_id' => $product->id,
                    'variant_id' => $variant?->id,
                    'product_name' => $product->name,
                    'variant_name' => $variant?->name,
                    'sku' => $variant ? $variant->sku : $product->sku,
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $price,
                    'total_price' => $price * $itemData['quantity'],
                ]);

                $subtotal += $orderItem->total_price;
            }

            $order->update([
                'subtotal' => $subtotal,
                'total_amount' => $subtotal + $order->shipping_charge - $order->discount_amount,
                'cod_amount' => ($order->payment_method === 'cod') ? ($subtotal + $order->shipping_charge - $order->discount_amount) : 0,
            ]);

            return $order;
        });
    }

    protected function getStatusTimestampField(OrderStatus $status): ?string
    {
        return match ($status) {
            OrderStatus::CONFIRMED => 'confirmed_at',
            OrderStatus::PROCESSING => 'processing_at',
            OrderStatus::SHIPPED => 'shipped_at',
            OrderStatus::DELIVERED => 'delivered_at',
            OrderStatus::RETURNED => 'returned_at',
            OrderStatus::CANCELLED => 'cancelled_at',
            default => null,
        };
    }

    public function generateOrderNumber(string $tenantId): string
    {
        return DB::transaction(function () use ($tenantId) {
            $seq = DB::table('tenant_sequences')
                ->where('tenant_id', $tenantId)
                ->lockForUpdate()
                ->first();

            if (! $seq) {
                DB::table('tenant_sequences')->insert([
                    'tenant_id' => $tenantId,
                    'order_sequence' => 1,
                ]);
                $orderSequence = 1;
            } else {
                $orderSequence = $seq->order_sequence + 1;
                DB::table('tenant_sequences')
                    ->where('tenant_id', $tenantId)
                    ->update(['order_sequence' => $orderSequence]);
            }

            return 'ORD-'.date('Y').'-'.str_pad((string) $orderSequence, 6, '0', STR_PAD_LEFT);
        });
    }
}
