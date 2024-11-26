<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;


Route::get('/', [AuthController::class, 'login'])->name('login');
Route::post('/login', [AuthController::class, 'signIn'])->name('auth.signin');
Route::post('/logout',  [AuthController::class, 'logout'])->name('auth.signout');

Route::middleware(['auth'])->group(function(){
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

// Route::get('/test', function(){
//     return inertia('');
// });


// Route::resource('auth', AuthController::class)->except('login');

