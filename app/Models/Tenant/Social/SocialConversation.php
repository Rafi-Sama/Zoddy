<?php

declare(strict_types=1);

namespace App\Models\Tenant\Social;

use App\Models\Tenant\Crm\Customer;
use App\Models\Tenant\Order\Order;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 * @property string $tenant_id
 * @property string $social_account_id
 * @property string|null $customer_id
 * @property string|null $sender_platform_id
 * @property int $unread_count
 * @property-read SocialAccount $socialAccount
 */
class SocialConversation extends Model
{
    use BelongsToTenant;
    use HasUlids;

    protected $fillable = [
        'tenant_id',
        'social_account_id',
        'platform_thread_id',
        'customer_id',
        'sender_platform_id',
        'sender_name',
        'sender_avatar',
        'status',
        'order_id',
        'last_message_at',
        'last_message_preview',
        'unread_count',
        'is_archived',
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
        'unread_count' => 'integer',
        'is_archived' => 'boolean',
    ];

    /**
     * @return BelongsTo<SocialAccount, $this>
     */
    public function socialAccount(): BelongsTo
    {
        return $this->belongsTo(SocialAccount::class);
    }

    /**
     * @return BelongsTo<Customer, $this>
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * @return BelongsTo<Order, $this>
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * @return HasMany<SocialMessage, $this>
     */
    public function messages(): HasMany
    {
        return $this->hasMany(SocialMessage::class, 'conversation_id');
    }
}
