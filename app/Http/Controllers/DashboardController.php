<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        //dd($user);

        if (!$user) {
            // Redirect to login if the user is not authenticated
            return inertia('Authentication/Login');
        }

        sleep(2);

        $roleDashboardMap = [
            'program_head' => 'ProgramHead/ProgramHeadDashboard',
            // 'student' =>'Student/Dashboard',
            'professor' => 'ProgramHead/ProfessorDashboard',
        ];

        return inertia($roleDashboardMap[$user->role] ?? 'default');
    }

}
