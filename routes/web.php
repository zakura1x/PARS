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
    Route::post('/topic-masters/add',[TopicMasterController::class,'store'])->name('topic-masters.store');
    Route::get('/topic-masters/{id}/edit', [TopicMasterController::class, 'edit'])->name('topic-masters.edit');
    Route::put('/topic-masters/{id}', [TopicMasterController::class, 'update'])->name('topic-masters.update');
    Route::delete('/topic-masters/{id}', [TopicMasterController::class, 'destroy'])->name('topic-masters.destroy');

    //TOPIC/SUBTOPICS MANAGEMENT
    Route::get('/topicDetails', [TopicsController::class, 'index'])->name('topicDetails');
    Route::post('/topics/{id}/add-topics', [TopicsController::class, 'store'])->name('topics.store');
    Route::post('/topics/{topicMasterId}/reorder', [TopicsController::class, 'reorder'])->name('topics.reorder');
    Route::get('/topics/{id}/edit', [TopicsController::class, 'editView'])->name('topics.edit');
    

    //Question Management
    Route::get('/questionBank', [QuestionController::class, 'index'])->name('questionIndex');
    Route::get('/questionFormRequirements', [QuestionController::class, 'questionFormRequirements'])->name('questionFormRequirements');
    Route::get('/questions/add', [QuestionController::class, 'questionDetails'])->name('questionDetails');
    Route::post('/addQuestion', [QuestionController::class, 'store'])->name('questionAdd');

});

require_once __DIR__ . '/user_management.php';

// Route::get('/test', function(){
//     return inertia('');
// });


// Route::resource('auth', AuthController::class)->except('login');

