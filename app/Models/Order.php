<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'store_id',
        'order_date',
        'total_amount',
        'status',
        'distribution_id',
    ];

    /**
     * Mendefinisikan relasi "satu Order memiliki banyak OrderItem".
     */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Mendefinisikan relasi "satu Order dimiliki oleh satu Store".
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }
}