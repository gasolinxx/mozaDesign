<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPriceColumnsToProductVariantsTable extends Migration
{
    public function up()
    {
        Schema::table('product_variants', function (Blueprint $table) {
            $table->decimal('agent_price', 8, 2)->nullable()->after('id');
            $table->decimal('customer_price', 8, 2)->nullable()->after('agent_price');
            $table->text('notes')->nullable()->after('customer_price');
        });
    }

    public function down()
    {
        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropColumn(['agent_price', 'customer_price', 'notes']);
        });
    }
}
