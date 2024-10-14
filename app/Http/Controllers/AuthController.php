<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
        // Validate input fields
        $request->validate([
            'emailOrStudentNumber' => 'required',
            'password' => 'required',
        ]);
    
        $input = $request->input('emailOrStudentNumber');
        $password = $request->input('password');
    
        // Regular expressions for email and student number formats
        $emailRegex = '/^[^\s@]+@[^\s@]+\.[^\s@]+$/';
        $studentNumberRegex = '/^[A-Z0-9]{2}-[A-Z0-9]{5}$/';
    
        // Determine credentials based on input type (email or student number)
        $credentials = preg_match($emailRegex, $input)
            ? ['email' => $input, 'password' => $password]
            : (preg_match($studentNumberRegex, $input)
                ? ['idNumber' => $input, 'password' => $password]
                : null);
    
        // If the input format is invalid, return error
        if (!$credentials) {
            return back()->withErrors(['Email or Student Number' => 'Invalid email or student number format.']);
        }
    
        // Attempt to authenticate with the determined credentials
        if (Auth::attempt($credentials)) {
            return redirect()->route('dashboard');
        }
    
        // Return error for invalid credentials
        return back()->withErrors(['Email or Student Number' => 'Invalid Credentials.']);
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
