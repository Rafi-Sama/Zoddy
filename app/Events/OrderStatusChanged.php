<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\Tenant\Order\Order;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderStatusChanged
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public function __construct(
        public Order $order,
        public string $fromStatus,
        public string $toStatus,
        public ?string $note = null,
    ) {}
}
