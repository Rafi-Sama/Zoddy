<?php

declare(strict_types=1);

namespace App\Http\Controllers\Tenant\System;

use App\Http\Controllers\Controller;
use App\Models\Tenant\System\Notification;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(): \Inertia\Response
    {
        $notifications = Notification::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Tenant/System/Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }

    public function markAsRead(Notification $notification): \Illuminate\Http\RedirectResponse
    {
        $notification->update(['read_at' => now()]);

        return back();
    }

    public function markAllAsRead(): \Illuminate\Http\RedirectResponse
    {
        Notification::where('user_id', auth()->id())
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return back();
    }
}
