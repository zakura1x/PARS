<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if (!$user) {
            // Redirect to login if the user is not authenticated
            return inertia('Authentication/Login');
        }

        sleep(2);

        $roleDashboardMap = [
            'program_head' => 'ProgramHead/Dashboard',
            // 'student' =>'Student/Dashboard',
            // 'professor' => 'Professor/Dashboard',
        ];

        return inertia($roleDashboardMap[$user->role] ?? 'default');
    }
    
}
