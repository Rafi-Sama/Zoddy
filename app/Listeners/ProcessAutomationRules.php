<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\OrderStatusChanged;
use App\Services\AutomationService;

class ProcessAutomationRules
{
    /**
     * Create the event listener.
     */
    public function __construct(
        protected AutomationService $automationService,
    ) {}

    /**
     * Handle the event.
     */
    public function handle(OrderStatusChanged $event): void
    {
        $payload = [
            'order_id' => $event->order->id,
            'order_number' => $event->order->order_number,
            'status' => $event->toStatus,
            'customer_id' => $event->order->customer_id,
            'total_amount' => $event->order->total_amount,
            'ref_type' => 'order',
            'ref_id' => $event->order->id,
        ];

        $this->automationService->evaluate(
            $event->order->tenant_id,
            'order.status_changed',
            $payload,
        );
    }
}
