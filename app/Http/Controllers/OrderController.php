<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['store:id,name', 'user:id,name'])->latest()->get();

        $summary = [
            'total_orders' => $orders->count(),
            'pending_orders' => $orders->where('status', 'pending')->count(),
            'completed_orders' => $orders->where('status', 'completed')->count(),
        ];

        // === PERUBAHAN DI SINI ===
        // Kirim juga data untuk form modal
        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'summary' => $summary,
            'stores' => Store::all(['id', 'name']),
            'products' => Product::all(['id', 'name', 'price']),
            'flash' => session()->only(['success', 'error']),
        ]);
    }

    // Method 'create' tidak lagi dibutuhkan, bisa dihapus.

    public function store(Request $request)
    {
        $request->validate([
            'store_id' => 'required|exists:stores,id',
            'order_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($request) {
            $totalAmount = 0;
            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);
                $totalAmount += $product->price * $item['quantity'];
            }

            $order = Order::create([
                'store_id' => $request->store_id,
                'user_id' => Auth::id(),
                'order_date' => $request->order_date,
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'notes' => $request->notes,
            ]);

            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);
                $order->products()->attach($item['product_id'], [
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                ]);
            }
        });

        return redirect()->route('orders.index')->with('success', 'Pesanan berhasil dibuat.');
    }
}