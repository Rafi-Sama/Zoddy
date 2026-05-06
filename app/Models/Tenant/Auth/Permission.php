<?php

declare(strict_types=1);

namespace App\Models\Tenant\Auth;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property string $id
 * @property string $tenant_id
 * @property string $name
 * @property string $slug
 */
class Permission extends Model
{
    use BelongsToTenant;
    use HasUlids;

    protected $fillable = [
        'tenant_id',
        'name',
        'slug',
    ];

    /**
     * @return BelongsToMany<Role, $this>
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }
}
