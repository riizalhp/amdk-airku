<?php

namespace App\Http\Controllers;

use App\Models\Product; // <-- Import model Product
use Illuminate\Http\Request;
use Inertia\Inertia; // <-- Import Inertia

class ProductController extends Controller
{
    /**
     * Menampilkan halaman daftar produk.
     */
    public function index()
    {
        return Inertia::render('Admin/Products/Index', [
            'products' => Product::all(),
        ]);
    }

    /**
     * Menyimpan produk baru ke database.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'sku' => 'nullable|string|max:100|unique:products',
        ]);

        Product::create($request->all());

        return redirect()->route('products.index')->with('success', 'Produk berhasil ditambahkan.');
    }
}