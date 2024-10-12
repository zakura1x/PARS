<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function login()
    {
        return inertia('Authentication/Login');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function signIn(Request $request)
    {
        // Validate that both emailOrStudentNumber and password are present
        $request->validate([
            'emailOrStudentNumber' => 'required',
            'password' => 'required',
        ]);
    
        $input = $request->input('emailOrStudentNumber');
        $password = $request->input('password');
    
        // Regular expressions for email and student number formats
        $emailRegex = '/^[^\s@]+@[^\s@]+\.[^\s@]+$/';  // Simple email validation regex
        $studentNumberRegex = '/^[A-Z0-9]{2}-[A-Z0-9]{5}$/'; // Example: XX-XXXXX
    
        $credentials = [];
    
        // Check if the input is an email or a student number
        if (preg_match($emailRegex, $input)) {
            // Input is an email, use the email field for authentication
            $credentials = ['email' => $input, 'password' => $password];
        } elseif (preg_match($studentNumberRegex, $input)) {
            // Input is a student number, use the student_number field for authentication
            $credentials = ['student_number' => $input, 'password' => $password];
        } else {
            // If the input doesn't match either, return with an error
            return back()->withErrors(['emailOrStudentNumber' => 'Invalid email or student number format.']);
        }
    
        // Attempt to authenticate using the appropriate credentials
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
    
            // Redirect based on user role
            switch ($user->role) {
                case 'programHead':
                    return inertia('ProgramHead/Dashboard');
                case 'student':
                    return inertia('Student/Dashboard');
                case 'professor':
                    return inertia('Professor/Dashboard');
                default:
                    return inertia('default');
            }
        }
    
        // If authentication fails, return with an error
        return back()->withErrors(['emailOrStudentNumber' => 'Invalid Credentials.']);
    }
    

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //User Registration
        $credentials = $request->validate([

            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string'
        ]);

        Auth::create($credentials);

        return redirect('/');
    }

    /**
     * Display the specified resource.
     */
    public function logout()
    {
        Auth::logout();
        return inertia('Authentication/Login');

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Auth $auth)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Auth $auth)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Auth $auth)
    {
        //
    }
}
