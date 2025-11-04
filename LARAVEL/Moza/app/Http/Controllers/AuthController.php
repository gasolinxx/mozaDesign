<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // Register a new user and create an API token
    public function register(Request $request)
    {
        // Validate input data including phone_number
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email',
            'phone_number' => 'required|string|unique:users,phone_number|max:20',
            'password' => 'required|string|min:6|confirmed', // password_confirmation field required
        ]);

        // Create user with hashed password and phone_number
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'password' => Hash::make($request->password),
        ]);

        // Generate token for API authentication
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201); // 201 Created
    }

    // Authenticate user and create a new token
    public function login(Request $request)
    {
        // Validate login data
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // Find user by email
        $user = User::where('email', $request->email)->first();

        // Verify user exists and password matches
        if (! $user || ! Hash::check($request->password, (string) $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Create a new token for the user
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    // Logout user by deleting current access token
    public function logout(Request $request)
    {
        // Revoke token used for current request
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
