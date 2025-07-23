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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores');
            $table->date('order_date');
            $table->decimal('total_amount', 12, 2);
            $table->enum('status', ['pending', 'processed', 'assigned_to_trip', 'delivered', 'cancelled'])->default('pending');
            $table->foreignId('distribution_id')->nullable()->constrained('distributions')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};