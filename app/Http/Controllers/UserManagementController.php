<?php

namespace App\Http\Controllers;

use App\Models\Dean;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Professor;
use App\Models\ProgramHead;

class UserManagementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Get all users with roles of professor, program_head, and dean, and paginate with 10 users per page
        $users = User::whereIn('role', ['professor', 'program_head', 'dean'])
            ->latest() // Orders by created_at in descending order
            ->paginate(10);

        // dd($users->toArray());

        // Return the users to the view with inertia
        return inertia('UserManagement/UserManagement', ['users' => $users]);
        
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
        'gender' => 'required|string|in:Male,Female,Other',
        'birthdate' => 'required|date|before:today',
    ]);

    // Create the user
    $user = User::create([
        'first_name' => $validateUser['first_name'],
        'last_name' => $validateUser['last_name'],
        'email' => $validateUser['email'],
        'idNumber' => $validateUser['idNumber'],
        'role' => $validateUser['role'],
        'password' => $validateUser['birthdate'],
    ]);

    // Determine the user's role and create corresponding details for professor, program_head, or dean.
    if (in_array($user->role, ['professor', 'program_head', 'dean'])) {
        // Create the professor details with common attributes
        Professor::create([
            'user_id' => $user->id,
            'gender' => $validateUser['gender'],
            'birth_date' => $validateUser['birthdate'],
        ]);

        // If there are role-specific attributes, handle them separately
        if ($user->role == 'program_head') {
            // Example: Additional attributes or logic specific to program_head
            ProgramHead::create([
                'user_id' => $user->id,
                'gender' => $validateUser['gender'],
                'birth_date' => $validateUser['birthdate'],
            ]);
        }

        if ($user->role == 'dean') {
            // Example: Additional attributes or logic specific to dean
            Dean::create([
                'user_id' => $user->id,
                'gender' => $validateUser['gender'],
                'birth_date' => $validateUser['birthdate'],
            ]);
        }
    }

    //Send a message to inertia
    return redirect('/UserList')->with('message', 'The User was Created');

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
