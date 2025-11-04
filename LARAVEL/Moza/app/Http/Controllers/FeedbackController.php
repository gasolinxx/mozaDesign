<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Feedback;

class FeedbackController extends Controller
{
    public function index()
    {
        return response()->json(Feedback::orderBy('created_at', 'desc')->get());
    }
}
