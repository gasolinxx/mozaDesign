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
    Schema::table('carts', function (Blueprint $table) {
        $table->string('subproduct_name')->nullable()->after('product_type');
    });
}

public function down(): void
{
    Schema::table('carts', function (Blueprint $table) {
        $table->dropColumn('subproduct_name');
    });
}

};
