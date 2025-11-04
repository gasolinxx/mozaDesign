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
    Schema::create('product_variants', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('subproduct_id');
        $table->string('material')->nullable();
        $table->string('size')->nullable();
        $table->string('color')->nullable();
        $table->string('type')->nullable();
        $table->string('printing_side')->nullable();
        $table->decimal('price_lo', 8, 2)->nullable();
        $table->decimal('agent_price', 8, 2)->nullable();
        $table->decimal('customer_price', 8, 2)->nullable();
        $table->enum('unit', ['sqft', 'A3', 'pcs', 'unit'])->nullable(); // Enum unit
        $table->text('notes')->nullable();
        $table->timestamps();

        $table->foreign('subproduct_id')->references('id')->on('subproducts')->onDelete('cascade');
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
