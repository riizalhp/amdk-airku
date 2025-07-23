<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StoreController extends Controller
{
    /**
     * Menampilkan halaman daftar toko.
     */
    public function index()
    {
        return Inertia::render('Admin/Stores/Index', [
            'stores' => Store::all(),
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
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        Store::create([
            'name' => $request->name,
            'address' => $request->address,
            'pic_name' => $request->pic_name,
            'phone_number' => $request->phone_number,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'created_by_user_id' => Auth::id(),
        ]);

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
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $store->update($request->all());

        return redirect()->route('stores.index')->with('success', 'Data toko berhasil diperbarui.');
    }

    /**
     * Menghapus toko dari database.
     */
    public function destroy(Store $store)
    {
        $store->delete();

        return redirect()->route('stores.index')->with('success', 'Toko berhasil dihapus.');
    }
}