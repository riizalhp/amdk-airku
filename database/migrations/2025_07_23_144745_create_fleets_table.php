<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('fleets', function (Blueprint $table) {
            $table->id();
            $table->string('vehicle_name');
            $table->string('license_plate')->unique();
            
            // === TAMBAHKAN BARIS INI ===
            $table->enum('status', ['available', 'in_use', 'maintenance'])->default('available');
            // ===========================

            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('fleets');
    }
};