<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('feedback', function (Blueprint $table) {
            $table->id('feedback_id');        // feedback_id (primary key)
            $table->string('user', 100);      // user name or identifier
            $table->text('comments');         // comments text
            $table->unsignedTinyInteger('rating');  // rating (1-5 stars)
            $table->date('date')->default(DB::raw('CURRENT_DATE'));  // feedback date
            $table->timestamps();             // created_at and updated_at columns
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedback');
    }
};
