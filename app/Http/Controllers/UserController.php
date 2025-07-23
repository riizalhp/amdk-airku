<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Testing\Facades\Log; // <-- Pastikan ini ada untuk logging
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Menampilkan halaman daftar pengguna.
     * Mengirimkan data pengguna dan pesan notifikasi (flash message) ke komponen Inertia.
     */
    public function index()
    {
        return Inertia::render('Admin/Users/Index', [
            'users' => User::all(),
            'flash' => session()->only(['success', 'error']),
        ]);
    }

    /**
     * Menyimpan pengguna baru ke dalam database.
     */
    public function store(Request $request)
    {
        // Validasi data yang masuk dari form
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'string', Rule::in(['admin', 'sales', 'driver'])],
        ]);

        // Buat user baru jika validasi berhasil
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Enkripsi password
            'role' => $request->role,
        ]);

        // Redirect kembali ke halaman index dengan pesan sukses
        return redirect()->route('users.index')->with('success', 'Pengguna berhasil ditambahkan.');
    }

    /**
     * Memperbarui data pengguna yang sudah ada di database.
     */
    public function update(Request $request, User $user)
    {
        // Validasi data yang masuk dari form edit
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()], // Password boleh kosong saat edit
            'role' => ['required', 'string', Rule::in(['admin', 'sales', 'driver'])],
        ]);

        // Perbarui data user
        $user->name = $request->name;
        $user->email = $request->email;
        $user->role = $request->role;

        // Hanya update password jika field password diisi
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save(); // Simpan perubahan

        // Redirect kembali ke halaman index dengan pesan sukses
        return redirect()->route('users.index')->with('success', 'Data pengguna berhasil diperbarui.');
    }

    /**
     * Menghapus pengguna dari database.
     * Dilengkapi dengan try-catch dan logging untuk debugging.
     */
    public function destroy(User $user)
    {
        // Mencegah pengguna menghapus akunnya sendiri
        if ($user->id === auth()->id()) {
            return redirect()->route('users.index')
                ->with('error', 'Aksi Ditolak: Anda tidak dapat menghapus akun Anda sendiri.');
        }

        try {
            // Mencoba menghapus data user
            $user->delete();

        } catch (\Exception $e) {
            // Jika terjadi error saat menghapus (misalnya karena foreign key constraint)
            
            // 1. Catat error lengkap ke file log untuk dianalisis
            Log::error(
                "GAGAL MENGHAPUS USER ID: {$user->id}", // Pesan utama
                [
                    'user_email' => $user->email,
                    'error_message' => $e->getMessage(), // Pesan error yang paling penting
                    'file' => $e->getFile(),             // File lokasi error
                    'line' => $e->getLine(),             // Baris kode lokasi error
                ]
            );

            // 2. Kirim notifikasi error ke tampilan depan
            return redirect()->route('users.index')
                ->with('error', 'GAGAL MENGHAPUS: Pengguna ini terhubung dengan data lain. Cek log untuk detail.');
        }

        // Jika tidak ada error dan proses hapus berhasil
        return redirect()->route('users.index')
            ->with('success', 'Pengguna berhasil dihapus.');
    }
}