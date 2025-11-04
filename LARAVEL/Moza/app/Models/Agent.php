<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Agent extends Model
{
    use HasFactory;

    protected $table = 'agents';
    protected $primaryKey = 'agent_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'agent_id',
        'user_id',
        'name',
        'email',
        'phone_number',
        'state',
        'branch'
    ];

    /**
     * Relationship to the User model.
     * Allows you to get the linked user details easily.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Scope to search by email (for your "search then auto-fill" feature)
     */
    public function scopeSearchByEmail($query, $email)
    {
        return $query->where('email', $email);
    }
}
