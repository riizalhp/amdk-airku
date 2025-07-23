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
        Schema::create('surveys', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
            $table->foreignId('sales_id')->constrained('users');
            $table->date('survey_date');
            $table->text('most_sought_after_product')->nullable(); // To store sorted list as text/JSON
            $table->text('most_sought_after_airku_variant')->nullable(); // To store sorted list as text/JSON
            $table->text('feedback_for_airku')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('surveys');
    }
};