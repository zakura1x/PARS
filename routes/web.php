<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', [AuthController::class, 'login']);
Route::post('/login', [AuthController::class, 'signIn'])->name('auth.signin');

Route::get('/test', function(){
    return inertia('ProgramHead/Sidebar');
});


// Route::resource('auth', AuthController::class)->except('login');

