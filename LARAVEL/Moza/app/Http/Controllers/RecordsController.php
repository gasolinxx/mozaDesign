<?php

namespace App\Http\Controllers;

use App\Models\ProductVariant;
use Illuminate\Http\Request;

class RecordsController extends Controller
{
    // Get all product variant records with related category/product/subproduct
    public function getAllProductRecords()
    {
        $variants = ProductVariant::with([
            'subproduct.product.category'
        ])->get();

        $records = $variants->map(function ($variant) {
            return [
                'variant_id' => $variant->id,
                'category' => $variant->subproduct->product->category->name ?? '',
                'product' => $variant->subproduct->product->name ?? '',
                'subproduct' => $variant->subproduct->name ?? '',
                'material' => $variant->material,
                'size' => $variant->size,
                'color' => $variant->color,
                'type' => $variant->type,
                'printing_side' => $variant->printing_side,
                'price_lo' => $variant->price_lo,
                'unit' => $variant->unit,
                'agent_price' => $variant->agent_price,
                'customer_price' => $variant->customer_price,
                'notes' => $variant->notes,
            ];
        });

        return response()->json($records);
    }

    // Delete a variant
    public function deleteVariant($id)
{
    try {
        $variant = ProductVariant::findOrFail($id);
        $variant->delete();

        return response()->json(['message' => 'Variant deleted successfully']);
    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        return response()->json([
            'message' => 'Variant not found',
        ], 404);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Failed to delete variant',
            'error' => $e->getMessage(),
        ], 500);
    }
}


    // Update a variant
   public function updateVariant(Request $request, $id)
{
    try {
        $variant = ProductVariant::findOrFail($id); // 404 if not found

        $variant->update($request->all());

        return response()->json(['message' => 'Variant updated successfully']);
    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        return response()->json([
            'message' => 'Variant not found',
        ], 404);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Failed to update variant',
            'error' => $e->getMessage(),
        ], 500);
    }
}
}