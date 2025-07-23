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
        Schema::create('distribution_routes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('distribution_id')->constrained('distributions')->onDelete('cascade');
            $table->foreignId('store_id')->constrained('stores');
            $table->unsignedInteger('sequence_order');
            $table->enum('status', ['pending', 'visited', 'failed'])->default('pending');
            $table->timestamp('visited_at')->nullable();
            // No need for timestamps() here unless you want to track when the route entry itself was created/updated.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('distribution_routes');
    }
};