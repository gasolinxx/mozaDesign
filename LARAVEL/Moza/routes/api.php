<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;

// Controllers
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AgentController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubproductController;
use App\Http\Controllers\ProductVariantController;
use App\Http\Controllers\RecordsController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;




/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/agents', [AgentController::class, 'index']);
Route::post('/agents', [AgentController::class, 'store']);
Route::put('/agents/{agent_id}', [AgentController::class, 'update']);

Route::get('/feedback', [FeedbackController::class, 'index']);


//check user by email to register agent
Route::get('/check-user-by-email', function (Request $request) {
    $email = $request->query('email');
    $user = User::with('profile')->where('email', $email)->first();

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    return response()->json(['user' => $user]);
});


//admin orders
Route::get('/admin/orders/{order}/receipt-data', [OrderController::class, 'getReceiptData']);
Route::get('/admin/orders', [OrderController::class, 'adminOrders']);
Route::post('/submit-order', [OrderController::class, 'submit']);
Route::put('/admin/orders/{id}', [OrderController::class, 'adminUpdate']);



// 🔹 Category Routes
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::get('/categories/{id}/products', [CategoryController::class, 'products']);


// 🔹 Product Routes
Route::get('/products', [ProductController::class, 'index']); // Main list of products
Route::get('/category/{id}/products', [ProductController::class, 'getProductsByCategory']);
Route::post('/products', [ProductController::class, 'storeProduct']);

Route::post('/generate-quotation-pdf', [ProductController::class, 'generateQuotationPdf']);



// 🔹 Subproduct Routes
Route::get('/subproducts', [SubproductController::class, 'index']);
Route::post('/subproducts', [SubproductController::class, 'store']);
Route::get('/products/{productId}/subproducts', [SubproductController::class, 'getByProduct']); // Used standardized `{productId}`
Route::get('/products/{id}/subproducts', [SubproductController::class, 'getByProduct']);


// 🔹 Variant Routes (ProductVariant)
Route::apiResource('variants', ProductVariantController::class);
Route::get('/variants/subproduct/{id}', [ProductVariantController::class, 'getBySubproduct']); // Optional custom
Route::get('/product-variants/by-subproduct/{subproductId}', [ProductVariantController::class, 'getBySubproduct']); // Probably duplicate
Route::get('/variants/records', [ProductVariantController::class, 'records']);
Route::get('/subproducts/{id}/sizes', [ProductVariantController::class, 'getSizesBySubproduct']);


// 🔹 Product Records
Route::get('/product-records', [RecordsController::class, 'getAllProductRecords']);
Route::put('/product-records/{id}', [RecordsController::class, 'updateVariant']);
Route::delete('/product-records/{id}', [RecordsController::class, 'deleteVariant']);


//api test connection
Route::get('/test-connection', function (Request $request) {
    return response()->json([
        'message' => 'API connection successful',
        'client_ip' => $request->ip(),
        'user_agent' => $request->header('User-Agent')
    ]);


});






/*
|--------------------------------------------------------------------------
| Protected Routes (Requires Sanctum Auth)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Orders
    Route::get('/user-orders', [OrderController::class, 'userOrders']);
    Route::post('/orders/submit', [OrderController::class, 'submit']);
    Route::get('/orders/{id}/invoice', [OrderController::class, 'downloadInvoice']);

    // Carts
    Route::post('/cart/add', [CartController::class, 'add']);
    Route::get('/cart', [CartController::class, 'index']);
    Route::delete('/cart/{id}', [CartController::class, 'remove']);

    // Profile
    Route::get('/profile', [UserController::class, 'profile']);
    Route::post('/user/profile', [UserController::class, 'updateProfile']);
    Route::get('/user/profile-image/{id}', [UserController::class, 'getProfileImage']);

    // Users
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);
});
