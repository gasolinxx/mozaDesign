<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('product_type');
            $table->string('subproduct_name')->nullable();
            $table->float('width')->nullable();
            $table->float('height')->nullable();
            $table->string('size')->nullable();
            $table->integer('quantity');
            $table->text('delivery_address');
            $table->text('note')->nullable();
            $table->string('artwork_path')->nullable();
            $table->json('product_specs')->nullable();
            $table->enum('order_status', ['pending', 'processing', 'completed', 'cancelled'])->default('pending');
            $table->enum('payment_status', ['unpaid', 'paid'])->default('unpaid');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
