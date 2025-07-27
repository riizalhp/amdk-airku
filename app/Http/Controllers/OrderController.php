<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use App\Notifications\LowStockNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Orders/Index', [
            'orders' => Order::with('store', 'products')->latest()->get(),
            'stores' => Store::all(),
            'products' => Product::where('stock', '>', 0)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'store_id' => 'required|exists:stores,id',
            'order_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            DB::transaction(function () use ($request) {
                // Validasi stok sebelum membuat pesanan
                foreach ($request->items as $item) {
                    $product = Product::find($item['product_id']);
                    if ($product->stock < $item['quantity']) {
                        throw \Illuminate\Validation\ValidationException::withMessages([
                            'items' => "Stok untuk produk '{$product->name}' tidak mencukupi. Sisa stok: {$product->stock}.",
                        ]);
                    }
                }

                // Buat Pesanan
                $order = Order::create([
                    'store_id' => $request->store_id,
                    'user_id' => auth()->id(),
                    'order_date' => $request->order_date,
                    'total_amount' => 0,
                    'status' => 'pending',
                ]);

                $totalAmount = 0;

                // Proses setiap item pesanan
                foreach ($request->items as $item) {
                    $product = Product::find($item['product_id']);
                    $quantity = $item['quantity'];

                    $order->products()->attach($product->id, ['quantity' => $quantity, 'price' => $product->price]);
                    $totalAmount += $product->price * $quantity;
                    $product->decrement('stock', $quantity);

                    // Cek stok setelah dikurangi
                    $product->refresh(); 
                    if ($product->stock <= $product->low_stock_threshold) {
                        $admins = User::where('role', 'admin')->get();
                        Notification::send($admins, new LowStockNotification($product));
                    }
                }

                $order->update(['total_amount' => $totalAmount]);
            });
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors());
        }

        return redirect()->route('orders.index');
    }
}