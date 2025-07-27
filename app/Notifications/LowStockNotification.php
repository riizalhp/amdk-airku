<?php

// 5. File: app/Notifications/LowStockNotification.php
// Pastikan Anda sudah membuat file ini dengan `php artisan make:notification LowStockNotification`
// Lalu isi dengan kode di bawah.
namespace App\Notifications;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LowStockNotification extends Notification
{
    use Queueable;

    protected $product;

    public function __construct(Product $product)
    {
        $this->product = $product;
    }

    public function via(object $notifiable): array
    {
        return ['database']; // Kirim notifikasi ke database
    }

    public function toArray(object $notifiable): array
    {
        return [
            'product_id' => $this->product->id,
            'product_name' => $this->product->name,
            'remaining_stock' => $this->product->stock,
            'message' => "Stok untuk produk {$this->product->name} menipis. Sisa stok: {$this->product->stock}.",
        ];
    }
}