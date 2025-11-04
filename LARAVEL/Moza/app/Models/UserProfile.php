<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    use HasFactory;

    
    protected $table = 'user_profiles';  
 protected $fillable = [
    'user_id',
    'gender',
    'nric',
    'date_of_birth',
    'address',
    'profile_image',
    'profile_image_mime',
];


    /**
     * Relationship: UserProfile belongs to User
     */
    public function user()
    {
      
    return $this->belongsTo(User::class, 'user_id', 'id');
}
    }
