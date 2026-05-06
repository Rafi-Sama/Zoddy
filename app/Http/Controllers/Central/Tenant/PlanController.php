<?php

declare(strict_types=1);

namespace App\Http\Controllers\Central\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Central\Tenant\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlanController extends Controller
{
    public function index(): \Inertia\Response
    {
        $plans = Plan::all();

        return Inertia::render('Central/Plans/Index', [
            'plans' => $plans,
        ]);
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'slug' => 'required|string|unique:plans,slug',
            'price_monthly' => 'required|integer|min:0',
            'order_limit' => 'nullable|integer',
            'user_limit' => 'required|integer',
        ]);

        Plan::create($validated);

        return back()->with('success', 'Plan created successfully.');
    }
}
