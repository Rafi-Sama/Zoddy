<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Tenant\Order\Order;
use Illuminate\Support\Facades\Cache;

class OrderObserver
{
    /**
     * Handle the Order "created" event.
     */
    public function created(Order $order): void
    {
        $this->invalidateDashboardCache($order->tenant_id);
    }

    /**
     * Handle the Order "updated" event.
     */
    public function updated(Order $order): void
    {
        if ($order->isDirty('status') || $order->isDirty('total_amount')) {
            $this->invalidateDashboardCache($order->tenant_id);
        }
    }

    /**
     * Handle the Order "deleted" event.
     */
    public function deleted(Order $order): void
    {
        $this->invalidateDashboardCache($order->tenant_id);
    }

    protected function invalidateDashboardCache(string $tenantId): void
    {
        Cache::forget("tenant:{$tenantId}:dashboard");
    }
}
