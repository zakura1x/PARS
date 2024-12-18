<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\TopicMasterController;
use App\Http\Controllers\TopicsController;
use App\Http\Middleware\RoleMiddleware;
use App\Models\TopicMaster;
use Illuminate\Support\Facades\Route;



Route::get('/', [AuthController::class, 'login'])->name('login');
Route::post('/login', [AuthController::class, 'signIn'])->name('auth.signin');
Route::post('/logout',  [AuthController::class, 'logout'])->name('auth.signout');

//TESTING


// Route::middleware(['auth'])->group(function(){
//     Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
// });

Route::middleware(['auth', RoleMiddleware::class . ':program_head'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    //SUBJECT MANAGEMENT
    Route::get('/subjectList', [SubjectController::class, 'index'])->name('subjectList');
    Route::post('/addSubject',[SubjectController::class,'store'])->name('subject-store');
    Route::post('/subjects/edit/{id}', [SubjectController::class, 'edit'])->name('subjects-edit');

    //MASTER TOPIC MANAGEMENT
    Route::get('/topicList', [TopicMasterController::class, 'index'])->name('topicList');
    Route::post('/addTopicmasters',[TopicMasterController::class,'store'])->name('topicmaster-store');
    // Route::post('/topicmasters/edit/{id}', [TopicMasterController::class, 'edit'])->name('topicmaster-edit');

    //TOPIC/SUBTOPICS MANAGEMENT
    Route::get('/topicDetails', [TopicsController::class, 'index'])->name('topicDetails');

});

require_once __DIR__ . '/user_management.php';

// Route::get('/test', function(){
//     return inertia('');
// });


// Route::resource('auth', AuthController::class)->except('login');

