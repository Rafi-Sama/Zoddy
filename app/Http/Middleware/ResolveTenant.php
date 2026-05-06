<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\Central\Tenant\Tenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ResolveTenant
{
    /**
     * Handle an incoming request.
     *
     * @param Closure(Request): (Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $hostname = $request->getHost();

        // Example: logic to find tenant by domain
        // For local development, we might use a header or session if domain isn't set up
        $tenantId = $request->header('X-Tenant-Id') ?? $request->session()->get('tenant_id');

        if ($tenantId) {
            $tenant = Tenant::find($tenantId);
            if ($tenant instanceof Tenant) {
                tenancy()->initialize($tenant);
            }
        }

        return $next($request);
    }
}
