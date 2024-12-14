<?php

use App\Http\Controllers\UserManagementController;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', RoleMiddleware::class . ':program_head'])->group(function (){
    Route::get('/UserList', [UserManagementController::class, 'index'])->name('userlist');
    Route::post('/register', [UserManagementController::class, 'store'])->name('user-store');
    Route::post('/users/edit/{id}', [UserManagementController::class, 'edit'])->name('user-edit');
});