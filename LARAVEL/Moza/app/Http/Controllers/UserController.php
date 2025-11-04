<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage; 

class UserController extends Controller
{
    // Return logged-in user profile with profile details
    public function profile(Request $request)
    {
        $user = $request->user()->load('profile');

        return response()->json([
    'name' => $user->name,
    'email' => $user->email,
    'phone_number' => $user->phone_number,  // <-- Add this line
    'usertype' => $user->usertype,
    'profile' => $user->profile,
]);

    }

    // List all users
    public function index()
    {
        $users = User::with('profile')->get();
        return response()->json($users);
    }

    // Show a specific user by ID
    public function show($id)
    {
        $user = User::with('profile')->find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        return response()->json($user);
    }

    // Update user basic info
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:6|confirmed',
        ]);

        if ($request->has('name')) {
            $user->name = $request->name;
        }
        if ($request->has('email')) {
            $user->email = $request->email;
        }
        if ($request->has('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json($user);
    }

    // Update or create user's profile
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'gender' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'nric' => 'nullable|string|max:20',          // Added NRIC validation
            'address' => 'nullable|string',
            'profile_image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('profile_image')) {
            $path = $request->file('profile_image')->store('profiles', 'public');
            $validated['profile_image'] = $path;
        }

        // Update or create profile record
        $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        return response()->json(['message' => 'Profile updated successfully']);
    }

    // Delete a user by ID
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
