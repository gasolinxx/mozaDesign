<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Agent;
use App\Models\User;

class AgentController extends Controller
{
    public function index()
    {
        $agents = Agent::with('user')->get()->map(function ($agent) {
            return [
                'agent_id'     => $agent->agent_id,
                'name'         => $agent->name,
                'email'        => $agent->email,
                'phone_number' => $agent->phone_number,
                'state'        => $agent->state,
                'branch'       => $agent->branch,
            ];
        });

        return response()->json($agents);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'email'        => 'required|email|exists:users,email',
            'agent_id'     => 'nullable|string', // only required if new agent
            'name'         => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'state'        => 'required|string|max:100',
            'branch'       => 'required|string|max:100',
        ]);

        // Get the user
        $user = User::where('email', $validated['email'])->first();

        // Always set the usertype to agent
        $user->usertype = 'agent';
        $user->save();

        // Check if agent exists
        $agent = Agent::where('email', $validated['email'])->first();

        if ($agent) {
            // 🔹 Update existing agent
            $agent->update([
                'name'         => $validated['name'],
                'phone_number' => $validated['phone_number'],
                'state'        => $validated['state'],
                'branch'       => $validated['branch'],
            ]);

            return response()->json([
                'message' => 'Agent updated successfully.',
                'action'  => 'updated',
                'agent'   => $agent
            ], 200);
        }

        // 🔹 Creating new agent — ensure agent_id is provided and unique
        if (empty($validated['agent_id'])) {
            return response()->json(['message' => 'Agent ID is required for new agents.'], 422);
        }

        if (Agent::where('agent_id', $validated['agent_id'])->exists()) {
            return response()->json(['message' => 'Agent ID already exists.'], 422);
        }

        $agent = Agent::create([
            'agent_id'     => $validated['agent_id'],
            'user_id'      => $user->id,
            'name'         => $validated['name'],
            'email'        => $validated['email'],
            'phone_number' => $validated['phone_number'],
            'state'        => $validated['state'],
            'branch'       => $validated['branch'],
        ]);

        return response()->json([
            'message' => 'Agent registered successfully, usertype updated to agent.',
            'action'  => 'created',
            'agent'   => $agent
        ], 201);
    }


    public function update(Request $request, $agent_id)
{
    $validated = $request->validate([
        'name'         => 'required|string|max:255',
        'phone_number' => 'required|string|max:20',
        'state'        => 'required|string|max:100',
        'branch'       => 'required|string|max:100',
    ]);

    $agent = Agent::findOrFail($agent_id);

    $agent->update($validated);

    return response()->json([
        'message' => 'Agent updated successfully.',
        'agent'   => $agent
    ], 200);
}

}
