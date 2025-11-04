<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    use HasFactory;

 protected $fillable = [
    'subproduct_id', 'material', 'size', 'color', 'type',
    'printing_side', 'price_lo', 'agent_price', 'customer_price',
    'unit', 'notes',
];

    public function subproduct()
    {
        return $this->belongsTo(Subproduct::class);
    }

public function product() {
    return $this->belongsTo(Product::class);
}

public function category() {
    return $this->belongsTo(Category::class);
}

}
