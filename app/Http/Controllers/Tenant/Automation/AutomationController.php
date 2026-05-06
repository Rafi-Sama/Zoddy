<?php

declare(strict_types=1);

namespace App\Http\Controllers\Tenant\Automation;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Automation\AutomationRule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AutomationController extends Controller
{
    public function index(): \Inertia\Response
    {
        $rules = AutomationRule::orderBy('priority')->get();

        return Inertia::render('Tenant/Automation/Index', [
            'rules' => $rules,
        ]);
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'trigger_event' => 'required|string',
            'conditions' => 'array',
            'actions' => 'required|array',
            'is_active' => 'boolean',
            'priority' => 'integer',
        ]);

        AutomationRule::create([
            'tenant_id' => tenant('id'),
            ...$validated,
        ]);

        return back()->with('success', 'Automation rule created.');
    }

    public function toggle(AutomationRule $rule): \Illuminate\Http\RedirectResponse
    {
        $rule->update(['is_active' => ! $rule->is_active]);

        return back();
    }
}
