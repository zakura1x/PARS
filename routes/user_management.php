<?php

use App\Http\Controllers\StudentController;
use App\Http\Controllers\UserManagementController;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', RoleMiddleware::class . ':program_head'])->group(function (){
    Route::get('/UserList', [UserManagementController::class, 'index'])->name('userlist');
    Route::post('/register', [UserManagementController::class, 'store'])->name('user-store');
    Route::post('/users/edit/{id}', [UserManagementController::class, 'edit'])->name('user-edit');

    //Student Management
    Route::get('/student/list', [StudentController::class, 'index'])->name('student.list');
    Route::get('/student/add/form', [StudentController::class, 'create'])->name('student.add.form');
    Route::get('/student/edit/{id}', [StudentController::class, 'show'])->name('student.edit');
    Route::post('/student/add', [StudentController::class, 'store'])->name('student.add');
    Route::put('/student/update/{id}', [StudentController::class, 'update'])->name('student.update');
    Route::delete('/student/delete/{id}', [StudentController::class, 'destroy'])->name('student.delete');
});