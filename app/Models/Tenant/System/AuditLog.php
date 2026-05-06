<?php

declare(strict_types=1);

namespace App\Models\Tenant\System;

use App\Models\Tenant\Auth\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string|null $tenant_id
 * @property string|null $user_id
 */
class AuditLog extends Model
{
    protected $fillable = [
        'tenant_id',
        'user_id',
        'user_name',
        'action',
        'model_type',
        'model_id',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'old_values' => 'json',
        'new_values' => 'json',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
