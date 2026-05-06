<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\TransactionType;
use App\Models\Tenant\Accounting\Transaction;
use App\Models\Tenant\Order\Order;
use Illuminate\Support\Facades\DB;

class AccountingService
{
    public function recordSale(Order $order): Transaction
    {
        return $this->createTransaction([
            'tenant_id' => $order->tenant_id,
            'order_id' => $order->id,
            'type' => TransactionType::SALE->value,
            'direction' => 'in',
            'amount' => $order->total_amount,
            'payment_method' => $order->payment_method,
            'transaction_date' => now()->toDateString(),
            'note' => "Sale from order #{$order->order_number}",
        ]);
    }

    public function recordCodCollection(Order $order, int $amount, ?string $txnId = null): Transaction
    {
        return $this->createTransaction([
            'tenant_id' => $order->tenant_id,
            'order_id' => $order->id,
            'type' => TransactionType::COD_COLLECTION->value,
            'direction' => 'in',
            'amount' => $amount,
            'payment_method' => 'cash',
            'gateway_txn_id' => $txnId,
            'transaction_date' => now()->toDateString(),
            'note' => "COD collection for order #{$order->order_number}",
        ]);
    }

    /**
     * @param array<string, mixed> $data
     */
    public function createTransaction(array $data): Transaction
    {
        return DB::transaction(function () use ($data) {
            return Transaction::create([
                'tenant_id' => $data['tenant_id'] ?? (tenancy()->initialized ? tenant('id') : null),
                'order_id' => $data['order_id'] ?? null,
                'type' => $data['type'],
                'direction' => $data['direction'],
                'amount' => $data['amount'],
                'payment_method' => $data['payment_method'] ?? null,
                'gateway_txn_id' => $data['gateway_txn_id'] ?? null,
                'reference_type' => $data['reference_type'] ?? null,
                'reference_id' => $data['reference_id'] ?? null,
                'note' => $data['note'] ?? null,
                'transaction_date' => $data['transaction_date'] ?? now()->toDateString(),
                'created_by' => auth()->id(),
            ]);
        });
    }
}
