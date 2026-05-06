<?php

declare(strict_types=1);

namespace App\Models\Tenant\Social;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 * @property string $tenant_id
 * @property string $platform
 */
class SocialAccount extends Model
{
    use \App\Traits\HasAuditLog;
    use BelongsToTenant;
    use HasUlids;

    protected $fillable = [
        'tenant_id',
        'platform',
        'platform_id',
        'name',
        'username',
        'avatar_url',
        'access_token',
        'token_expires_at',
        'webhook_verified',
        'subscribed_fields',
        'is_active',
    ];

    protected $casts = [
        'access_token' => 'encrypted',
        'token_expires_at' => 'datetime',
        'webhook_verified' => 'boolean',
        'subscribed_fields' => 'json',
        'is_active' => 'boolean',
    ];

    /**
     * @return HasMany<SocialConversation, $this>
     */
    public function conversations(): HasMany
    {
        return $this->hasMany(SocialConversation::class);
    }
}
