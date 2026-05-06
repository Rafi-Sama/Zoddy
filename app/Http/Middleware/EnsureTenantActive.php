<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTenantActive
{
    /**
     * Handle an incoming request.
     *
     * @param Closure(Request): (Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! tenancy()->initialized) {
            abort(403, 'Tenant not resolved.');
        }

        $tenant = tenant();

        if ($tenant->status === 'suspended') {
            abort(403, 'Your account has been suspended. Please contact support.');
        }

        if ($tenant->status === 'cancelled') {
            abort(403, 'Your account has been cancelled.');
        }

        return $next($request);
    }
}
