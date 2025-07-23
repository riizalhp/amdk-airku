<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia; // Pastikan Inertia di-import

class DashboardController extends Controller
{
    /**
     * Menampilkan halaman utama dashboard.
     */
    public function index()
    {
        // Untuk saat ini, kita hanya akan merender komponen React Dashboard
        return Inertia::render('Dashboard');
    }
}