<?php

declare(strict_types=1);

namespace App\Http\Controllers\Central\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Central\Tenant\Tenant;
use Inertia\Inertia;

class TenantController extends Controller
{
    public function index(): \Inertia\Response
    {
        $tenants = Tenant::with('plan')->paginate(20);

        return Inertia::render('Central/Tenants/Index', [
            'tenants' => $tenants,
        ]);
    }

    public function show(Tenant $tenant): \Inertia\Response
    {
        return Inertia::render('Central/Tenants/Show', [
            'tenant' => $tenant->load(['plan', 'domains']),
        ]);
    }

    public function toggleStatus(Tenant $tenant): \Illuminate\Http\RedirectResponse
    {
        $tenant->update(['is_active' => ! $tenant->is_active]);

        return back()->with('success', 'Tenant status updated.');
    }
}
