<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    // Add item to cart
    public function add(Request $request)
    {
        $validated = $request->validate([
            'product_type'     => 'required|string|max:255',
            'subproduct'       => 'required|string|max:255',
            'size'             => 'nullable|string|max:255',
            'quantity'         => 'required|integer|min:1',
            'delivery_address' => 'nullable|string|max:255',
            'note'             => 'nullable|string|max:255',
            'artwork'          => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'product_specs'    => 'nullable|json',
        ]);

        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized. Please login first.'], 401);
        }

        // Store uploaded artwork if exists
        if ($request->hasFile('artwork')) {
            $validated['artwork_path'] = $request->file('artwork')->store('artworks', 'public');
        }

        $cart = Cart::create([
            'user_id'         => $user->id,
            'product_type'    => $validated['product_type'],
            'subproduct_name' => $validated['subproduct'],
            'size'            => $validated['size'] ?? null,
            'quantity'        => $validated['quantity'],
            'delivery_address'=> $validated['delivery_address'] ?? 'N/A',
            'note'            => $validated['note'] ?? null,
            'artwork_path'    => $validated['artwork_path'] ?? null,
            'product_specs'   => $validated['product_specs'] ?? null,
        ]);

        return response()->json([
            'message' => 'Cart item added successfully!',
            'cart'    => $cart
        ], 201);
    }

    // View cart items
    public function index()
    {
        $cart = Cart::where('user_id', Auth::id())->get();
        return response()->json($cart);
    }

    // View orders
    public function myOrders()
    {
        return Cart::where('user_id', Auth::id())
                   ->where('is_ordered', true)
                   ->get();
    }

    // Remove item from cart
    public function remove($id)
    {
        $cartItem = Cart::where('id', $id)
                        ->where('user_id', Auth::id())
                        ->first();

        if (!$cartItem) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }

        $cartItem->delete();

        return response()->json(['message' => 'Item removed successfully']);
    }
}
