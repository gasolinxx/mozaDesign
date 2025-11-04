<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Cart;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;

class OrderController extends Controller
{

    //submit order from cart
    public function submit(Request $request)
    {
        $user = Auth::user();

        try {
            $validated = $request->validate([
                'items' => 'required|array',
                'items.*.cart_id' => 'required|integer|exists:carts,id',
                'items.*.quantity' => 'required|integer|min:1',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        }

        $orders = [];

        foreach ($validated['items'] as $item) {
            $cartItem = Cart::where('id', $item['cart_id'])
                            ->where('user_id', $user->id)
                            ->first();

            if (!$cartItem) {
                continue; // Skip invalid or unauthorized cart item
            }

            $orders[] = Order::create([
                'user_id'          => $user->id,
                'product_type'     => $cartItem->product_type,
                'subproduct_name'  => $cartItem->subproduct_name,
                'size'             => $cartItem->size,
                'quantity'         => $item['quantity'],
                'delivery_address' => $cartItem->delivery_address,
                'note'             => $cartItem->note,
                'artwork_path'     => $cartItem->artwork_path,
                'product_specs'    => is_array($cartItem->product_specs)
                    ? json_encode($cartItem->product_specs)
                    : (is_string($cartItem->product_specs) ? $cartItem->product_specs : null),
                'order_status'     => 'pending',
                'payment_status'   => 'unpaid',
            ]);

            $cartItem->delete(); 
        }

        if (count($orders) === 0) {
            return response()->json([
                'success' => false,
                'message' => 'No valid cart items submitted.',
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Order submitted successfully.',
            'orders'  => $orders,
        ]);
    }


    //index
    public function index()
    {
        $orders = Order::with('user')->latest()->get();
        return response()->json($orders);
    }


    //get orders for admin
    public function adminOrders()
    {
        return Order::with('user')->latest()->get();
    }

    public function adminUpdate(Request $request, $id)
    {
        $validated = $request->validate([
    'order_status' => 'in:pending,processing,completed,cancelled',
    'payment_status' => ['required', function($attribute, $value, $fail) {
        $allowed = ['unpaid', 'paid', 'lo'];
        // Accept exact allowed or deposit pattern
        if (!in_array(strtolower($value), $allowed, true) &&
            !preg_match('/^deposit\s*\(rm\s*\d+(\.\d+)?\)$/i', $value)) {
            $fail($attribute.' is invalid.');
        }
    }],
]);


        $order = Order::findOrFail($id);
        $order->update($validated);

        return response()->json(['message' => 'Order updated successfully.']);
    }



    //get user orders
    public function userOrders(Request $request)
    {
        $user = $request->user();
        $orders = Order::where('user_id', $user->id)->latest()->get();
        return response()->json($orders);
    }

    public function downloadInvoice($orderId)
    {
        $order = Order::with('user')->findOrFail($orderId);
         $user = Auth::user();

        $pdf = Pdf::loadView('invoices.invoice', [
            'order' => $order,
            'user'  => $user
        ]);

        return $pdf->download('invoice_' . $order->id . '.pdf');
    }




    public function getReceiptData($orderId)
{
    $order = Order::with(['user', 'variant'])->find($orderId);

    if (!$order) {
        return response()->json(['error' => 'Order not found'], 404);
    }

    // Decode specs if stored as JSON string
    $specs = $order->product_specs;
    if (is_string($specs)) {
        $specs = json_decode($specs, true);
    }

    return response()->json([
        'order_id' => $order->id,
        'user_name' => $order->user->name ?? '-',
        'user_email' => $order->user->email ?? '-',
        'user_phone' => $order->user->phone_number ?? '-',
        'usertype' => $order->user->usertype ?? 'customer',
        'order_date' => now()->format('d/m/Y'),
        'product_type' => $order->product_type ?? '-',
        'subproduct_name' => $order->subproduct_name ?? '',
        'size' => $order->size ?? '-',
        'quantity' => $order->quantity ?? 0,
        'product_specs' => $specs ?? [],
        'price_lo' => $order->variant->price_lo ?? 0,
        'agent_price' => $order->variant->agent_price ?? 0,
        'customer_price' => $order->variant->customer_price ?? 0,
    ]);
}

}
