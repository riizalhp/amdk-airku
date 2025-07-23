<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User; // <-- Tambahkan ini

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// === TAMBAHKAN RUTE INI DI BAWAH ===
Route::get('/users', function () {
    return User::all();
});