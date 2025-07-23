<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'address',
        'pic_name',
        'phone_number',
        'latitude',
        'longitude',
        'created_by_user_id',
    ];

    /**
     * Relasi untuk mendapatkan satu pesanan (order) terakhir dari toko ini.
     * Ini akan mengambil order dengan 'created_at' terbaru.
     */
    public function latestOrder()
    {
        return $this->hasOne(Order::class)->latestOfMany();
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}