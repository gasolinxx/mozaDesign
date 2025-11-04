
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserProfilesTable extends Migration
{
public function up()
{
    Schema::create('user_profiles', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        $table->string('gender')->nullable();
         $table->string('nric')->nullable();
        $table->date('date_of_birth')->nullable();
        $table->string('address')->nullable();
        $table->binary('profile_image')->nullable();  // BLOB column
        $table->string('profile_image_mime')->nullable(); // MIME type for image
        $table->timestamps();
    });
}

    public function down()
    {
        Schema::dropIfExists('user_profiles');
    }
}
