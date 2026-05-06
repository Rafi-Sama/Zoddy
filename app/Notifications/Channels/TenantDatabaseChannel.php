<?php

declare(strict_types=1);

namespace App\Notifications\Channels;

use App\Models\Tenant\System\Notification as TenantNotification;
use Illuminate\Notifications\Notification;

class TenantDatabaseChannel
{
    /**
     * Send the given notification.
     */
    public function send(object $notifiable, Notification $notification): void
    {
        if (! method_exists($notification, 'toTenantDatabase')) {
            return;
        }

        $data = $notification->toTenantDatabase($notifiable);

        TenantNotification::create([
            'tenant_id' => (string) (tenant('id') ?? $data['tenant_id'] ?? ''),
            'user_id' => property_exists($notifiable, 'id') ? (string) $notifiable->id : '',
            'type' => get_class($notification),
            'title' => $data['title'],
            'body' => $data['body'] ?? null,
            'action_url' => $data['action_url'] ?? null,
            'data' => $data['data'] ?? [],
        ]);
    }
}
