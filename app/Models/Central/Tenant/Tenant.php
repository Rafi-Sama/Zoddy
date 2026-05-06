<?php

declare(strict_types=1);

namespace App\Models\Central\Tenant;

use App\Models\Tenant\Auth\User;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Stancl\Tenancy\Database\Concerns\HasDomains;
use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;

/**
 * @property string $id
 * @property string $name
 * @property string $slug
 * @property string $email
 * @property string|null $phone
 * @property string|null $logo_path
 * @property string|null $plan_id
 * @property \Illuminate\Support\Carbon|null $plan_started_at
 * @property \Illuminate\Support\Carbon|null $plan_expires_at
 * @property \Illuminate\Support\Carbon|null $trial_ends_at
 * @property string $status
 * @property array<string, mixed>|null $settings
 * @property int $onboarding_step
 * @property string $timezone
 * @property string $currency
 * @property bool $is_active
 */
class Tenant extends BaseTenant
{
    use HasDomains;
    use HasUlids;
    use SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'settings' => 'json',
        'plan_started_at' => 'datetime',
        'plan_expires_at' => 'datetime',
        'trial_ends_at' => 'datetime',
    ];

    /**
     * @return list<string>
     */
    public static function getCustomColumns(): array
    {
        return [
            'id',
            'name',
            'slug',
            'email',
            'phone',
            'logo_path',
            'plan_id',
            'plan_started_at',
            'plan_expires_at',
            'trial_ends_at',
            'status',
            'settings',
            'onboarding_step',
            'timezone',
            'currency',
        ];
    }

    /**
     * @return BelongsTo<Plan, $this>
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    /**
     * @return HasMany<User, $this>
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
