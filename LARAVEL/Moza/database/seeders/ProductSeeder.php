<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run()
    {
        DB::table('products')->insert([
            ['product_id' => 1, 'name' => 'Sticker', 'code' => 'STK001', 'price_per_unit' => 5.00, 'unit' => 'A3'],
            ['product_id' => 2, 'name' => 'Banner', 'code' => 'BNR001', 'price_per_unit' => 10.00, 'unit' => 'ft'],
            ['product_id' => 3, 'name' => 'Mug', 'code' => 'MUG001', 'price_per_unit' => 15.00, 'unit' => 'unit'],
        ]);
    }
}

