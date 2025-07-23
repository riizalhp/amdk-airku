<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fleet extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_name',
        'license_plate',
        'status',
        'capacity', // <-- Tambahkan ini
    ];

    // Relasi untuk mengambil semua data distribusi terkait armada ini
    public function distributions()
    {
        return $this->hasMany(Distribution::class);
    }
}