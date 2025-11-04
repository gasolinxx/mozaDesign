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
    $table->foreignId('subproduct_id')->constrained()->onDelete('cascade');
    $table->string('material')->nullable();
    $table->string('size')->nullable();
    $table->string('color')->nullable();
    $table->string('type')->nullable();
    $table->string('printing_side')->nullable();
    $table->boolean('offset')->default(false);
    $table->timestamps();
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
