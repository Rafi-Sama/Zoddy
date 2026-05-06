<?php

declare(strict_types=1);

namespace App\Http\Controllers\Tenant\System;

use App\Http\Controllers\Controller;
use App\Models\Tenant\System\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index(Request $request): \Inertia\Response
    {
        $logs = AuditLog::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return Inertia::render('Tenant/System/AuditLogs/Index', [
            'logs' => $logs,
        ]);
    }

    public function show(AuditLog $log): \Inertia\Response
    {
        return Inertia::render('Tenant/System/AuditLogs/Show', [
            'log' => $log->load('user'),
        ]);
    }
}
