<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
class CategoryController extends Controller
{

  public function index()
    {
        return Category::all();
    }

public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
    ]);

    $category = Category::create([
        'name' => $request->name,
    ]);

    return response()->json([
        'message' => 'Category created successfully',
        'category' => $category
    ], 201);
}

    public function products($id)
    {
        return Product::with('category')->where('category_id', $id)->get();
    }



    public function show($id)
    {
        return Category::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $request->validate([
            'name' => 'required|string|unique:categories,name,' . $id,
        ]);
        $category->update($request->only('name'));

        return $category;
    }

    public function destroy($id)
    {
        Category::destroy($id);
        return response()->json(['message' => 'Category deleted']);
    }
}
