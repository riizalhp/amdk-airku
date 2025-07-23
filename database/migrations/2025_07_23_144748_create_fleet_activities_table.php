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
        Schema::create('fleet_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fleet_id')->constrained('fleets')->onDelete('cascade');
            $table->date('activity_date');
            $table->enum('activity_type', ['distribution', 'maintenance', 'idle', 'other']);
            $table->text('notes')->nullable();
            $table->foreignId('related_distribution_id')->nullable()->constrained('distributions')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fleet_activities');
    }
};