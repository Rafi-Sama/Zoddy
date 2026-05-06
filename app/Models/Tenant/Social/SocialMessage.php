<?php

declare(strict_types=1);

namespace App\Models\Tenant\Social;

use App\Models\Tenant\Auth\User;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $tenant_id
 * @property string $conversation_id
 * @property string|null $content
 */
class SocialMessage extends Model
{
    use HasUlids;

    protected $fillable = [
        'tenant_id',
        'conversation_id',
        'platform_message_id',
        'direction',
        'message_type',
        'content',
        'attachments',
        'is_read',
        'sent_by',
        'sent_at',
    ];

    protected $casts = [
        'attachments' => 'json',
        'is_read' => 'boolean',
        'sent_at' => 'datetime',
    ];

    /**
     * @return BelongsTo<SocialConversation, $this>
     */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(SocialConversation::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sent_by');
    }
}
