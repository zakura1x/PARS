<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\UserManagementController;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Support\Facades\Route;



Route::get('/', [AuthController::class, 'login'])->name('login');
Route::post('/login', [AuthController::class, 'signIn'])->name('auth.signin');
Route::post('/logout',  [AuthController::class, 'logout'])->name('auth.signout');

//Add, Get, Delete Subject


// Route::middleware(['auth'])->group(function(){
//     Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
// });

Route::middleware(['auth', RoleMiddleware::class . ':program_head'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/UserList', [UserManagementController::class, 'index'])->name('User List');

    Route::post('/addSubject',[SubjectController::class,'store'])->name('addSubject');
    Route::get('/subjects/view', [SubjectController::class, 'index'])->name('viewSubject');
    Route::get('/subjects', [SubjectController::class, 'getSubjects'])->name('getSubject');
    Route::post('/subjects', [SubjectController::class, 'store'])->name('addSubject');
    Route::delete('subjects/{id}', [SubjectController::class, 'destroy'])->name('deleteSubject');
});

// Route::get('/test', function(){
//     return inertia('');
// });


// Route::resource('auth', AuthController::class)->except('login');

