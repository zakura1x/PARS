<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;


class ProfileManagementController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        //dd($user->avatar);

        return inertia('ProfileManagement/ProfileAccount', [
            'user' => $user->only([
            'first_name', 'last_name', 'idNumber', 'email', 'role', 'status', 'avatar'
        ]),
        ]);
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed'
        ]);

        $user = Auth::user();

        if(!password_verify($validated['current_password'], $user->password))
        {
            return redirect()->back()->withErrors(['current_password' => 'Current password is incorrect']);
        }else{

            $user->password = $validated['new_password']; // No need to hash manually
            $user->save();

            return redirect()->back()->with('success', 'Password updated successfully');
        }
    }

    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image', // Accept only images, max size 2MB
        ]);

        //dd($request->file('avatar'));

        $user = Auth::user();
        $user->avatar = 'data:image/png;base64,' . base64_encode(file_get_contents($request->file('avatar')->getRealPath()));
        $user->save();

        return redirect()->back()->with('success', 'Avatar updated successfully');
    }
}   

