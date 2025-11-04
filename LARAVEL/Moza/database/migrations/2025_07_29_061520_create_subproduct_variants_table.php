<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('subproduct_variants', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->string('name');
            $table->string('image_path')->nullable();

            $table->string('material')->nullable();
            $table->string('size')->nullable();
            $table->string('color')->nullable();
            $table->string('type')->nullable();
            $table->string('printing_side')->nullable();

            $table->decimal('price_lo', 8, 2)->nullable();       // L/O price
            $table->decimal('price_agent', 8, 2)->nullable();    // Agent price
            $table->decimal('price_customer', 8, 2)->nullable(); // Customer price

            $table->text('notes')->nullable();
            $table->timestamps();

            // Foreign key to products table
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subproduct_variants');
    }
};
