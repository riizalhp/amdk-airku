<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class StoreController extends Controller
{
    /**
     * Menampilkan halaman daftar toko.
     */
    public function index()
    {
        // Ambil semua data toko beserta relasi pesanan terakhirnya
        $stores = Store::with('latestOrder')->get();

        return Inertia::render('Admin/Stores/Index', [
            'stores' => $stores,
            'flash' => session()->only(['success', 'error']),
        ]);
    }

    /**
     * Menyimpan toko baru ke database.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'pic_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        Store::create(array_merge($request->all(), ['created_by_user_id' => Auth::id()]));

        return redirect()->route('stores.index')->with('success', 'Toko berhasil ditambahkan.');
    }

    /**
     * Memperbarui data toko di database.
     */
    public function update(Request $request, Store $store)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'pic_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $store->update($request->all());

        return redirect()->route('stores.index')->with('success', 'Data toko berhasil diperbarui.');
    }

    /**
     * Menghapus toko dari database.
     */
    public function destroy(Store $store)
    {
        try {
            $store->delete();
        } catch (\Exception $e) {
            Log::error("Gagal menghapus Toko ID {$store->id}: {$e->getMessage()}");
            return redirect()->route('stores.index')->with('error', 'Gagal menghapus! Toko ini mungkin memiliki data terkait.');
        }

        return redirect()->route('stores.index')->with('success', 'Toko berhasil dihapus.');
    }
}