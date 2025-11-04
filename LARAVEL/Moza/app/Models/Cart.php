<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property \App\Models\User $user
 * @property \App\Models\Subproduct $subproduct
 */
class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'subproduct_id',
        'subproduct_name',
        'product_type',
        'size',
        'quantity',
        'delivery_address',
        'note',
        'artwork_path',
        'product_specs',
        'is_ordered',
        'order_status',
        'payment_status',
    ];

    protected $casts = [
        'product_specs' => 'array',
        'is_ordered' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function subproduct()
    {
        return $this->belongsTo(Subproduct::class, 'subproduct_id');
    }
}
