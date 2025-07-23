<?php

namespace App\Http\Controllers;

use App\Models\Fleet;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class FleetController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Fleets/Index', [
            'fleets' => Fleet::all(),
            'flash' => session()->only(['success', 'error']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'vehicle_name' => 'required|string|max:255',
            'license_plate' => 'required|string|max:255|unique:fleets,license_plate',
            'status' => ['required', Rule::in(['available', 'in_use', 'maintenance'])],
        ]);

        Fleet::create($request->all());

        return redirect()->route('fleets.index')->with('success', 'Armada berhasil ditambahkan.');
    }

    public function update(Request $request, Fleet $fleet)
    {
        $request->validate([
            'vehicle_name' => 'required|string|max:255',
            'license_plate' => ['required', 'string', 'max:255', Rule::unique('fleets')->ignore($fleet->id)],
            'status' => ['required', Rule::in(['available', 'in_use', 'maintenance'])],
        ]);

        $fleet->update($request->all());

        return redirect()->route('fleets.index')->with('success', 'Data armada berhasil diperbarui.');
    }

    public function destroy(Fleet $fleet)
    {
        try {
            $fleet->delete();
        } catch (\Exception $e) {
            return redirect()->route('fleets.index')->with('error', 'Gagal menghapus! Armada ini mungkin terkait dengan data lain.');
        }

        return redirect()->route('fleets.index')->with('success', 'Armada berhasil dihapus.');
    }
}