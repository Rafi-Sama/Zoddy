<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\Tenant\Catalog\Product;
use App\Notifications\Channels\TenantDatabaseChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class LowStockAlert extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Product $product,
        public int $currentStock,
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return [TenantDatabaseChannel::class];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toTenantDatabase(object $notifiable): array
    {
        return [
            'title' => 'Low Stock Alert',
            'body' => "Product '{$this->product->name}' is running low on stock. Current stock: {$this->currentStock}.",
            'action_url' => "/products/{$this->product->id}",
            'data' => [
                'product_id' => $this->product->id,
                'current_stock' => $this->currentStock,
            ],
        ];
    }
}
