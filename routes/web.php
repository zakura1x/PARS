<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SubjectController;
use Illuminate\Support\Facades\Route;



Route::get('/', [AuthController::class, 'login'])->name('login');
Route::post('/login', [AuthController::class, 'signIn'])->name('auth.signin');
Route::post('/logout',  [AuthController::class, 'logout'])->name('auth.signout');

//Add, Get, Delete Subject
Route::get('/subjects/view', [SubjectController::class, 'index'])->name('subjects.view');
Route::get('/subjects', [SubjectController::class, 'getSubjects'])->name('subjects.get');
Route::post('/subjects/store', [SubjectController::class, 'store'])->name('subjects.store');
Route::delete('subjects/{id}', [SubjectController::class, 'destroy']);

Route::middleware(['auth'])->group(function(){
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

// Route::get('/test', function(){
//     return inertia('');
// });


// Route::resource('auth', AuthController::class)->except('login');

