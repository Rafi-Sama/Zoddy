<?php

declare(strict_types=1);

namespace App\Http\Controllers\Tenant\Social;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Social\SocialConversation;
use App\Services\SocialService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SocialController extends Controller
{
    public function __construct(
        protected SocialService $socialService,
    ) {}

    public function index(): \Inertia\Response
    {
        $conversations = SocialConversation::with(['customer', 'socialAccount'])
            ->orderBy('last_message_at', 'desc')
            ->paginate(20);

        return Inertia::render('Tenant/Social/Index', [
            'conversations' => $conversations,
        ]);
    }

    public function show(SocialConversation $conversation): \Inertia\Response
    {
        $conversation->load(['messages', 'customer', 'socialAccount']);

        // Mark as read
        $conversation->update(['unread_count' => 0]);

        return Inertia::render('Tenant/Social/Show', [
            'conversation' => $conversation,
        ]);
    }

    public function reply(Request $request, SocialConversation $conversation): \Illuminate\Http\RedirectResponse
    {
        $request->validate(['message' => 'required|string']);

        $this->socialService->sendMessage($conversation, (string) $request->string('message'), (string) auth()->id());

        return back()->with('success', 'Message sent.');
    }
}
