<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;


class Order extends Model
{
    use HasFactory;

    // Specify the fillable fields for mass assignment
    protected $fillable = [
        'user_id',
        'product_type',
        'subproduct_name',
        'width',
        'height',
        'size',
        'quantity',
        'delivery_address',
        'note',
        'artwork_path',
        'product_specs',
        'order_status',
        'payment_status',
    ];

    // Cast product_specs JSON to array automatically
    protected $casts = [
        'product_specs' => 'array',
    ];

    // (Optional) relationship with User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    
    
public function variant()
{
    return $this->belongsTo(ProductVariant::class, 'product_variant_id');
}

    
}
