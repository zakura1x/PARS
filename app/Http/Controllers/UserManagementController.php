<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Professor;

class UserManagementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('UserManagement/UserList');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    // Validate the user data
    $validateUser = $request->validate([
        'first_name' => 'required|string|max:255',
        'last_name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users,email',
        'idNumber' => ['required', 'string', 'regex:/^[0-9]{2}-[0-9]{5}$/', 'unique:users,idNumber'],
        'role' => 'required|string|in:professor,program_head,dean',
    ]);

    // Validate additional details
    $validateDetails = $request->validate([
        'gender' => 'required|string|in:Male,Female,Other',
        'birthdate' => 'required|date|before:today',
    ]);

    // Generate the password from birthdate
    $password = bcrypt($validateDetails['birthdate']);

    // Create the user
    $user = User::create([
        'first_name' => $validateUser['first_name'],
        'last_name' => $validateUser['last_name'],
        'email' => $validateUser['email'],
        'idNumber' => $validateUser['idNumber'],
        'role' => $validateUser['role'],
        'password' => $password,
    ]);

    // Create the professor details if the role is 'Professor'
    if ($user->role == 'Professor') {
        Professor::create([
            'user_id' => $user->id,
            'gender' => $validateDetails['gender'],
            'birthdate' => $validateDetails['birthdate'],
        ]);
    }

    // Redirect or return response as needed
}


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
