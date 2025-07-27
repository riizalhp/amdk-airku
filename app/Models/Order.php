<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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
        'user_id',
        'order_date',
        'total_amount',
        'status',
        'distribution_id',
    ];

    protected $appends = ['total_quantity'];

    /**
     * Mendefinisikan relasi "satu Order memiliki banyak OrderItem".
     */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Accessor untuk total_quantity.
     */
    public function getTotalQuantityAttribute()
    {
        return $this->products->sum('pivot.quantity');
    }

    /**
     * Mendefinisikan relasi "satu Order dimiliki oleh satu Store".
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Mendefinisikan relasi many-to-many dengan Product.
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class)->withPivot('quantity', 'price');
    }
}