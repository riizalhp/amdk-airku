<?php

// 1. File: app/Models/Product.php
// Pastikan isi file ini HANYA seperti di bawah ini.
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'sku',
        'price',
        'stock',
        'low_stock_threshold',
    ];

    /**
     * The relationships that should always be loaded.
     *
     * @var array
     */
    protected $with = []; // Hapus 'orders' untuk mencegah infinite loop

    public function orders()
    {
        return $this->belongsToMany(Order::class)->withPivot('quantity');
    }
}