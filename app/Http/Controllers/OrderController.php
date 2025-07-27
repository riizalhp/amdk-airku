<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Menampilkan halaman daftar pesanan dengan total kuantitas barang.
     */
    public function index()
    {
        // Mengambil semua data pesanan, diurutkan dari yang terbaru.
        // `with('store')` mengambil data toko terkait untuk efisiensi.
        $orders = Order::with('store')->latest()->get()->map(function ($order) {
            // Untuk setiap pesanan, kita buat properti baru 'total_quantity'.
            // Isinya adalah hasil penjumlahan dari kolom 'quantity' di semua item yang terkait.
            $order->total_quantity = $order->orderItems()->sum('quantity');
            return $order;
        });

        // Mengirim data pesanan yang sudah dimodifikasi ke komponen React 'Admin/Orders/Index'.
        // Kita juga mengirim daftar toko dan produk untuk digunakan di form tambah/edit.
        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'stores' => Store::all(['id', 'name']),
            'products' => Product::all(['id', 'name', 'price']),
        ]);
    }

    /**
     * Menyimpan pesanan baru ke database.
     */
    public function store(Request $request)
    {
        $request->validate([
            'store_id' => 'required|exists:stores,id',
            'order_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        // Menggunakan transaction untuk memastikan semua query berhasil atau semua dibatalkan.
        DB::transaction(function () use ($request) {
            $totalAmount = 0;
            $itemsToCreate = [];

            // Loop pertama untuk menghitung total harga
            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);
                $totalAmount += $product->price * $item['quantity'];
                
                $itemsToCreate[] = [
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price_per_item' => $product->price,
                ];
            }

            // Buat pesanan utama
            $order = Order::create([
                'store_id' => $request->store_id,
                'order_date' => $request->order_date,
                'total_amount' => $totalAmount,
                'status' => 'pending',
            ]);

            // Buat semua item pesanan yang terhubung ke pesanan utama
            $order->orderItems()->createMany($itemsToCreate);
        });

        return redirect()->route('orders.index')->with('success', 'Pesanan berhasil dibuat.');
    }

    /**
     * (Placeholder) Memperbarui data pesanan di database.
     */
    public function update(Request $request, Order $order)
    {
        // Logika untuk validasi dan memperbarui pesanan akan ditambahkan di sini
        return redirect()->route('orders.index')->with('success', 'Pesanan berhasil diperbarui.');
    }

    /**
     * (Placeholder) Menghapus pesanan dari database.
     */
    public function destroy(Order $order)
    {
        // Logika untuk menghapus pesanan akan ditambahkan di sini
        $order->delete();
        return redirect()->route('orders.index')->with('success', 'Pesanan berhasil dihapus.');
    }
}