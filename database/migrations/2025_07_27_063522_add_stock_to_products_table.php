<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Menambahkan kolom untuk jumlah stok, default 0
            $table->integer('stock')->default(0)->after('price');
            // Menambahkan kolom untuk ambang batas notifikasi stok rendah, default 5
            $table->integer('low_stock_threshold')->default(5)->after('stock');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('stock');
            $table->dropColumn('low_stock_threshold');
        });
    }
};

