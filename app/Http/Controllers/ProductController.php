<?php

// 3. File: app/Http/Controllers/ProductController.php
// Ganti isi file ini dengan kode di bawah.
namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
        $totalStock = $products->sum('stock');

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'totalStock' => $totalStock,
            'flash' => session('flash'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:255|unique:products',
            'price' => 'required|numeric',
            'stock' => 'required|integer|min:0',
            'low_stock_threshold' => 'required|integer|min:0',
        ]);

        Product::create($request->all());

        return redirect()->route('products.index');
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:255|unique:products,sku,' . $product->id,
            'price' => 'required|numeric',
            'stock' => 'required|integer|min:0',
            'low_stock_threshold' => 'required|integer|min:0',
        ]);

        $product->update($request->all());

        return redirect()->route('products.index');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('products.index');
    }
}