<?php

declare(strict_types=1);

namespace App\Http\Controllers\Tenant\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\Order\StoreOrderRequest;
use App\Http\Resources\Tenant\Order\OrderResource;
use App\Models\Tenant\Order\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function __construct(
        protected OrderService $orderService,
    ) {}

    public function index(Request $request): \Inertia\Response
    {
        $orders = Order::with('customer')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Tenant/Orders/Index', [
            'orders' => OrderResource::collection($orders),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function store(StoreOrderRequest $request): \Illuminate\Http\RedirectResponse
    {
        $dto = \App\Dtos\OrderData::fromRequest($request->validated(), tenant('id'));
        $order = $this->orderService->createOrder($dto);

        return redirect()->route('orders.show', $order->id)
            ->with('success', 'Order created successfully.');
    }

    public function show(Order $order): \Inertia\Response
    {
        $order->load(['customer', 'items', 'history', 'shipment']);

        return Inertia::render('Tenant/Orders/Show', [
            'order' => new OrderResource($order),
        ]);
    }

    public function updateStatus(Request $request, Order $order): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'status' => 'required|string',
            'note' => 'nullable|string',
        ]);

        $this->orderService->transition($order, \App\Enums\OrderStatus::from($request->status), $request->note);

        return back()->with('success', 'Order status updated.');
    }
}
