<?php

namespace App\Http\Controllers;

use App\Models\Fleet;
use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoutePlanningController extends Controller
{
    /**
     * Menampilkan halaman perencanaan rute.
     */
    public function index()
    {
        // Ambil data yang dibutuhkan untuk form
        $fleets = Fleet::where('status', 'available')->get(['id', 'vehicle_name', 'license_plate']);
        $stores = Store::all(['id', 'name', 'address', 'latitude', 'longitude']);

        return Inertia::render('Admin/RoutePlanning/Index', [
            'fleets' => $fleets,
            'stores' => $stores,
        ]);
    }

    // Nanti kita bisa tambahkan method untuk memproses rute di sini
    // public function generate(Request $request) { ... }
}