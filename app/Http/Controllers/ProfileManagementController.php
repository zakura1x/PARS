<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class ProfileManagementController extends Controller
{
    public function index()
    {
        //dd('reached');
        $user = Auth::user();

        dd($user);

        return inertia('ProfileManagement/ProfileAccount');
    }
}
