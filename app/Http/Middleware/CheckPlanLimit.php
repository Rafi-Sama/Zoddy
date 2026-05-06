<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPlanLimit
{
    /**
     * Handle an incoming request.
     *
     * @param Closure(Request): (Response) $next
     */
    public function handle(Request $request, Closure $next, string $feature): Response
    {
        if (! tenancy()->initialized) {
            return $next($request);
        }

        $tenant = tenant();
        $plan = $tenant->plan;

        if (! $plan) {
            abort(403, 'No active plan found.');
        }

        // Logic to check limits based on feature string
        // e.g. 'orders', 'users', 'social_accounts'
        $isAllowed = match ($feature) {
            'orders' => is_null($plan->order_limit) || $tenant->orders()->count() < $plan->order_limit,
            'users' => $tenant->users()->count() < $plan->user_limit,
            'social_accounts' => $tenant->socialAccounts()->count() < $plan->social_accounts_limit,
            default => true,
        };

        if (! $isAllowed) {
            abort(403, "You have reached the limit for {$feature} on your current plan.");
        }

        return $next($request);
    }
}
