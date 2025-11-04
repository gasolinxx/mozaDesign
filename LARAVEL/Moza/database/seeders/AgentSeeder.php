<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AgentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('agents')->insert([
            [
                'agent_id' => 123,
                'name' => 'Ahmad',
                'phone_number' => '0128323123',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'agent_id' => 342,
                'name' => 'Ali',
                'phone_number' => '01244244',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}