<?php

declare(strict_types=1);

namespace App\Models\Tenant\System;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $tenant_id
 */
class WebhookLog extends Model
{
    protected $fillable = [
        'tenant_id',
        'platform',
        'event',
        'payload',
        'status_code',
        'processed_at',
        'error_message',
    ];

    protected $casts = [
        'payload' => 'json',
        'processed_at' => 'datetime',
    ];
}
