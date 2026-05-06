<?php

declare(strict_types=1);

namespace App\Http\Controllers\Central\Integration;

use App\Http\Controllers\Controller;
use App\Models\Central\CourierProvider;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourierProviderController extends Controller
{
    public function index(): \Inertia\Response
    {
        $providers = CourierProvider::all();

        return Inertia::render('Central/Integrations/Couriers/Index', [
            'providers' => $providers,
        ]);
    }

    public function update(Request $request, CourierProvider $provider): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'api_base_url' => 'required|url',
            'is_active' => 'boolean',
        ]);

        $provider->update($validated);

        return back()->with('success', 'Provider updated.');
    }
}
