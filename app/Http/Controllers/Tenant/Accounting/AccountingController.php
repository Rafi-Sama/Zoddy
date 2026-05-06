<?php

declare(strict_types=1);

namespace App\Http\Controllers\Tenant\Accounting;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Accounting\Expense;
use App\Models\Tenant\Accounting\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountingController extends Controller
{
    public function index(Request $request): \Inertia\Response
    {
        $transactions = Transaction::orderBy('transaction_date', 'desc')
            ->paginate(20);

        return Inertia::render('Tenant/Accounting/Index', [
            'transactions' => $transactions,
        ]);
    }

    public function expenses(): \Inertia\Response
    {
        $expenses = Expense::orderBy('expense_date', 'desc')->paginate(20);

        return Inertia::render('Tenant/Accounting/Expenses', [
            'expenses' => $expenses,
        ]);
    }

    public function storeExpense(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'category' => 'required|string',
            'amount' => 'required|integer|min:0',
            'expense_date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        Expense::create([
            'tenant_id' => tenant('id'),
            'created_by' => auth()->id(),
            ...$validated,
        ]);

        return back()->with('success', 'Expense recorded.');
    }
}
