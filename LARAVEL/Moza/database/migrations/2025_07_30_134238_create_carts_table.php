<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCartsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('user_id');
            $table->string('product_type'); // e.g. banner, sticker, etc.
            $table->string('subproduct_name')->nullable(); // e.g. Tarpaulin Frontlit

            $table->float('width')->nullable(); // in feet
            $table->float('height')->nullable(); // in feet
            $table->string('size')->nullable(); // fallback for legacy size string

            $table->integer('quantity')->default(1);
            $table->text('delivery_address');
            $table->text('note')->nullable();

            $table->string('artwork_path')->nullable(); // image or PDF file

            $table->json('product_specs')->nullable(); // eyelet, grommets, side, material, etc.

            $table->enum('order_status', ['pending', 'ordered', 'cancelled'])->default('pending');
            $table->enum('payment_status', ['unpaid', 'paid'])->default('unpaid');

            $table->timestamps();

            // Foreign key constraint
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
}
