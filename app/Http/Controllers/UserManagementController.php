<?php

namespace App\Http\Controllers;

use App\Models\Dean;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Professor;
use App\Models\ProgramHead;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserManagementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $searchQuery = $request->input('search', '');

        $users = User::with(['professor', 'programHead', 'dean', 'student'])
            ->whereIn('role', ['professor', 'program_head', 'dean'])
            ->when($searchQuery, function ($query, $searchQuery) {
                $query->where(function ($q) use ($searchQuery) {
                    $q->where('first_name', 'like', '%' . $searchQuery . '%')
                    ->orWhere('last_name', 'like', '%' . $searchQuery . '%')
                    ->orWhere('email', 'like', '%' . $searchQuery . '%');
                });
            })
            ->latest()
            ->paginate(10)
            ->through(function ($user) {
                $roleData = $user->roleModel();
                
                return [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'idNumber' => $user->idNumber,
                    'role' => $user->role,
                    'gender' => $roleData->gender ?? null,
                    'birthdate' => $roleData->birth_date ?? null,
                    'professor' => $user->professor,
                    'program_head' => $user->programHead,
                    'dean' => $user->dean,
                ];
            });

        return inertia('UserManagement/UserManagement', [
            'users' => $users,
            'searchQuery' => $searchQuery
        ]);
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
        'password' => Hash::make($validateUser['birthdate']),
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

     // Redirect using Inertia
     return to_route('userlist')->with('message', 'Question was Created Successfully');

}


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::findOrFail($id);

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, string $id)
    {
        $user = User::with(['professor', 'programHead', 'dean'])->findOrFail($id);

        $validateUser = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'role' => 'required|string|in:professor,program_head,dean',
            'gender' => 'required|string|in:Male,Female,Other',
            'birthdate' => 'required|date|before:today',
        ]);

        // Update user
        $user->update([
            'first_name' => $validateUser['first_name'],
            'last_name' => $validateUser['last_name'],
            'email' => $validateUser['email'],
            'role' => $validateUser['role'],
        ]);

        // Get or create the role-specific model
        $roleModel = match($user->role) {
            'professor' => $user->professor()->firstOrNew(),
            'program_head' => $user->programHead()->firstOrNew(),
            'dean' => $user->dean()->firstOrNew(),
            default => null,
        };

        if ($roleModel) {
            $roleModel->fill([
                'gender' => $validateUser['gender'],
                'birth_date' => $validateUser['birthdate'],
            ])->save();
        }

        return redirect('userList')->with('message', 'The User was Edited Successfully');
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);

        // Delete role-specific details
        if ($user->role == 'professor') {
            Professor::where('user_id', $user->id)->delete();
        } elseif ($user->role == 'program_head') {
            ProgramHead::where('user_id', $user->id)->delete();
        } elseif ($user->role == 'dean') {
            Dean::where('user_id', $user->id)->delete();
        }

        // Delete the user
        $user->delete();

        return redirect()->route('userlist')->with('message', 'User was deleted successfully');
    }
}
