<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TopicGradingCriteriaController;
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
// 

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
    Route::get('/topics/{id}/{topicMasterId}/edit', [TopicsController::class, 'editView'])->name('topics.edit');
    

    //Question Management
    Route::get('/questionBank', [QuestionController::class, 'index'])->name('questionIndex');
    Route::get('/questionDetails', [QuestionController::class, 'questionDetails'])->name('questionDetails');
    Route::get('/api/question-form-requirements', [QuestionController::class, 'questionFormRequirements']);
    Route::post('/addQuestion', [QuestionController::class, 'store'])->name('questionAdd');
    Route::get('/questions/{id}/edit', [QuestionController::class, 'edit'])->name('questions.edit');
    Route::put('/questions/{id}',[QuestionController::class, 'update'])->name('questions.update');
    Route::delete('/questions/{question}', [QuestionController::class, 'destroy'])->name('questions.delete');

    //TopicGradingCriteria
    Route::get('/topic-grading-criteria/index', [TopicGradingCriteriaController::class, 'index'])->name('topic-grading-criteria.index');
    Route::get('/topic-grading-criteria/form/{topicId}', [TopicGradingCriteriaController::class, 'createOrEdit'])->name('topic-grading-criteria.add.edit');
    Route::post('/topic-grading-criteria/create/criteria/{topicId}', [TopicGradingCriteriaController::class, 'store'])->name('topic-grading-criteria.store');
    Route::put('/topic-grading-criteria/update/criteria/{topicId}/{criterionId}', [TopicGradingCriteriaController::class, 'update'])->name('topic-grading-criteria.update');

});

require_once __DIR__ . '/user_management.php';

// Route::get('/test', function(){
//     return inertia('');
// });


// Route::resource('auth', AuthController::class)->except('login');

