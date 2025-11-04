<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Subproduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    
public function index()
{
    return Product::with('subproducts.variants')->get(); // important!
}

// Get products by category
    public function getProductsByCategory($id)
    {
        return Product::where('category_id', $id)->get();
    }



// Store a new product
  public function storeProduct(Request $request)
{
    $request->validate([
        'name' => 'required|string',
        'category_id' => 'required|exists:categories,id',
        'image' => 'nullable|image|mimes:jpg,jpeg,png,webp',
    ]);

    $path = null;
    if ($request->hasFile('image')) {
        $ext = $request->file('image')->getClientOriginalExtension();
        $filename = str_replace(' ', '_', $request->name) . '.' . $ext;
        $path = $request->file('image')->storeAs('Produk', $filename, 'public');
    }

    $product = Product::create([
        'name' => $request->name,
        'category_id' => $request->category_id,
        'image_path' => $path,
    ]);

    return response()->json($product);
}



    public function show($id)
    {
        return Product::with('subproducts')->findOrFail($id);
    }


    // Update an existing product   
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }

            // Store new image
            $product->image = $request->file('image')->store('Produk', 'public');
        }

        $product->name = $request->name;
        $product->description = $request->description ?? null;
        $product->save();

        return response()->json($product);
    }



    // Delete a product
    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        // Delete image
        if ($product->image && Storage::disk('public')->exists($product->image)) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted']);
    }
}

