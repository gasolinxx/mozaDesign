<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

protected $fillable = [
    'name',
    'category_id',
    'image_path',  //image in add product page (admin site)
];

    // Relationship: Product belongs to a Category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Relationship: Product has many Subproducts
    public function subproducts()
    {
        return $this->hasMany(Subproduct::class);
    }
}
