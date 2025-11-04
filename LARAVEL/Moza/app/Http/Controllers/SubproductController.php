<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subproduct;

class SubproductController extends Controller
{
   
    public function index()
    {
        return Subproduct::with('product')->get(); // include relation if needed
    }


    // Get subproducts by product ID
public function getSubproductByProduct($productId)
{
    return Subproduct::with(['variants' => function($query) {
        $query->select('id', 'subproduct_id', 'customer_price'); // Add other fields as needed
    }])
    ->where('product_id', $productId)
    ->get();
}


//GetByProduct
public function getByProduct($id)
{
    return Subproduct::where('product_id', $id)->get();
}


//add subproduct
    public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'product_id' => 'required|exists:products,id',
        'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
    ]);

    $path = null;

    // 🔹 Store image if uploaded with name based on subproduct name
    if ($request->hasFile('image')) {
        $ext = $request->file('image')->getClientOriginalExtension();
        $cleanName = preg_replace('/[^A-Za-z0-9_\-]/', '_', $validated['name']); // sanitize name
        $filename = $cleanName . '.' . $ext;
        $path = $request->file('image')->storeAs('Subproduk', $filename, 'public');
    }

    $subproduct = Subproduct::create([
        'name' => $validated['name'],
        'product_id' => $validated['product_id'],
        'image_path' => $path,
    ]);

    return response()->json($subproduct);
}



}
