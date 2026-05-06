<?php

declare(strict_types=1);

namespace App\Policies\Tenant;

use App\Models\Tenant\Auth\User;
use App\Models\Tenant\Order\Order;

class OrderPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->roles()->whereHas('permissions', fn ($q) => $q->where('slug', 'view_orders'))->exists();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Order $order): bool
    {
        return $this->viewAny($user);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->roles()->whereHas('permissions', fn ($q) => $q->where('slug', 'create_orders'))->exists();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Order $order): bool
    {
        return $user->roles()->whereHas('permissions', fn ($q) => $q->where('slug', 'update_orders'))->exists();
    }
}
