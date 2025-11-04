<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Subproduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'product_id',
        'image_path',
    ];

    /**
     * 🔗 Subproduct belongs to a Product
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * 🔗 Subproduct has many ProductVariants
     */
    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    /**
     * 🔍 Accessor: return full image URL
     */
    public function getImageUrlAttribute()
    {
        return $this->image_path
            ? asset('storage/' . $this->image_path)
            : null;
    }
}
