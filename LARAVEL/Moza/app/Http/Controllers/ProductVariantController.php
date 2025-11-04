<?php

namespace App\Http\Controllers;

use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductVariantController extends Controller
{

    public function index()
    {
        return ProductVariant::with('subproduct.product')->get();
    }


    
    //Get by Subproduct
    public function getBySubproduct($subproductId)
    {
        return ProductVariant::where('subproduct_id', $subproductId)->get();
    }



    // Add Variants to subproduct
    public function store(Request $request)
    {
        Log::info('Variant Data:', $request->all());

        $validated = $request->validate([
            'subproduct_id' => 'required|exists:subproducts,id',
            'material' => 'nullable|string',
            'size' => 'nullable|string',
            'color' => 'nullable|string',
            'type' => 'nullable|string',
            'printing_side' => 'nullable|string',
            'price_lo' => 'nullable|numeric',
            'agent_price' => 'nullable|numeric',
            'customer_price' => 'nullable|numeric',
            'notes' => 'nullable|string',
        ]);

        $variant = ProductVariant::create($validated);

        return response()->json($variant, 201);
    }


public function show($id)
{
    $variant = ProductVariant::with([
        'subproduct.product.category'  
    ])->findOrFail($id);

    return response()->json($variant);
}



 public function getSizesBySubproduct($subproductId)
{
    $sizes = ProductVariant::where('subproduct_id', $subproductId)
        ->select('id', 'size')
        ->get();

    return response()->json($sizes);
}



    
}
