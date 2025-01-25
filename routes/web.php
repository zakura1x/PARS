<?php

use App\Exports\QuestionTemplateExport;
use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\StudentDashboardController;
use App\Http\Controllers\StudentPracticeAssessmentController;
use App\Http\Controllers\StudyMaterialAttachmentController;
use App\Http\Controllers\StudyMaterialController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TableOfSpecificationController;
use App\Http\Controllers\TopicGradingCriteriaController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\TopicMasterController;
use App\Http\Controllers\TopicsController;
use App\Http\Middleware\RoleMiddleware;
use App\Models\Student;
use App\Models\TableOfSpecification;
use App\Models\TopicMaster;
use Illuminate\Support\Facades\Route;
use Maatwebsite\Excel\Facades\Excel;

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
    // Route::get('/topicList', [TopicMasterController::class, 'index'])->name('topicList');
    // Route::post('/topic-masters/add',[TopicMasterController::class,'store'])->name('topic-masters.store');
    // Route::get('/topic-masters/{id}/edit', [TopicMasterController::class, 'edit'])->name('topic-masters.edit');
    // Route::put('/topic-masters/{id}', [TopicMasterController::class, 'update'])->name('topic-masters.update');
    // Route::delete('/topic-masters/{id}', [TopicMasterController::class, 'destroy'])->name('topic-masters.destroy');

    //TOPIC/SUBTOPICS MANAGEMENT
    Route::get('/topic/lists', [TopicsController::class, 'index'])->name('topics.index');
    Route::get('/topics/view/details/{subjectId}', [TopicsController::class, 'viewDetails'])->name('topics.view-details');
    Route::post('/topics/{subjectId}/store', [TopicsController::class, 'store'])->name('topics.store');
    Route::post('/topics/reorder/{subjectId}', [TopicsController::class, 'reorderTopics'])->name('topics.reorder');
    Route::get('/topics/edit/{subjectId}', [TopicsController::class, 'editView'])->name('topics.edit');
    

    //Question Management
    Route::get('/questionBank', [QuestionController::class, 'index'])->name('questionIndex');
    Route::get('/questionDetails', [QuestionController::class, 'questionDetails'])->name('questionDetails');
    Route::get('/api/question-form-requirements', [QuestionController::class, 'questionFormRequirements']);
    Route::post('/addQuestion', [QuestionController::class, 'store'])->name('questionAdd');
    Route::get('/questions/{id}/edit', [QuestionController::class, 'edit'])->name('questions.edit');
    Route::put('/questions/{id}',[QuestionController::class, 'update'])->name('questions.update');
    Route::delete('/questions/{question}', [QuestionController::class, 'destroy'])->name('questions.delete');
    //Mass Upload
    Route::get('/question/mass-upload', [QuestionController::class, 'uploadIndex'])->name('question-mass.form');
    Route::post('/question/mass-upload/upload', [QuestionController::class, 'uploadQuestions'])->name('question-mass.upload');
    //Download Question
    Route::get('/download-question-template', function () {
        return Excel::download(new QuestionTemplateExport, 'question_template.xlsx');
    });

    //TopicGradingCriteria
    Route::get('/topic-grading-criteria/index', [TopicGradingCriteriaController::class, 'index'])->name('topic-grading-criteria.index');
    Route::get('/topic-grading-criteria/form/{topicId}', [TopicGradingCriteriaController::class, 'createOrEdit'])->name('topic-grading-criteria.add.edit');
    Route::post('/topic-grading-criteria/create/criteria/{topicId}', [TopicGradingCriteriaController::class, 'store'])->name('topic-grading-criteria.store');
    Route::put('/topic-grading-criteria/update/criteria/{topicId}/{criterionId}', [TopicGradingCriteriaController::class, 'update'])->name('topic-grading-criteria.update');

    //Study Materials
    Route::get('/study-materials/index/{topicId}', [StudyMaterialController::class, 'index'])->name('study-materials.index');
    Route::get('/study-materials/add/form/{topicId}', [StudyMaterialController::class, 'create'])->name('study-materials.form');
    Route::get('/study-materials/edit/{studyMaterialId}', [StudyMaterialController::class, 'edit'])->name('study-materials.edit');
    Route::post('/study-materials/add/new/{topicId}',[StudyMaterialController::class, 'store'])->name('study-materials.store');
    Route::delete('/study-materials/add/new/{studyMaterialId}', [StudyMaterialController::class, 'destroy'])->name('study-materials.destroy');
    Route::get('/attachments/download/{id}', [StudyMaterialAttachmentController::class, 'downloadAttachment'])->name('study-materials.download');
    Route::put('/study-materials/update/{studyMaterialId}', [StudyMaterialController::class, 'update'])->name('study-materials.update');

    //Study Materials attachment
    Route::post('/study-materials-attachment/add/new/{studyMaterialId}', [StudyMaterialAttachmentController::class, 'store'])->name('study-materials-attachment.store');
    Route::delete('/study-materials-attachment/delete/{studyMaterialId}', [StudyMaterialAttachmentController::class, 'destroy'])->name('study-materials-attachment.delete');

    //Table of Specification
    Route::get('/table-of-specification/index', [TableOfSpecificationController::class, 'index'])->name('tos.index');
    Route::get('/table-of-specification/forms/{subjectId}', [TableOfSpecificationController::class, 'createOrEditForm'])->name('tos.form');
    Route::post('/table-of-specification/save/form', [TableOfSpecificationController::class, 'store'])->name('tos.store');
    Route::get('/table-of-specification/view/{subjectId}', [TableOfSpecificationController::class, 'show'])->name('tos.show');
    
    //Assessment
    Route::get('/assessment/index/program-head', [AssessmentController::class, 'indexForProf'])->name('assessment-PH.index');
    //Route::get('/assessment/index/professor', [AssessmentController::class, 'indexForProf'])->name('assessment-prof.index');
    Route::get('/assessment/generator/form/exam', [AssessmentController::class, 'create'])->name('assessment-generator.form');
    Route::post('/assessment/exam/create', [AssessmentController::class, 'storeExam'])->name('assessment-exam.store');
    Route::get('/assessment/edit/form/exam/{assessmentId}', [AssessmentController::class, 'edit'])->name('assessment-edit.form');
    Route::post('/assessment/replace-question/{questionId}/{assessmentId}', [AssessmentController::class, 'replaceQuestion'])->name('assessment-question.replace');
    Route::get('/assessment/approval/form/{assessmentId}', [AssessmentController::class, 'assessmentApprovalForm'])->name('assessment-approval.form');
    Route::put('/assessment/update/approval/{assessmentId}', [AssessmentController::class,'updateForApproval'])->name('assessment-update.approval');
    Route::put('/assessment/update/approve/{assessmentId}', [AssessmentController::class,'approveAssessment'])->name('assessment.approve');
    Route::put('/assessment/update/reject/{assessmentId}', [AssessmentController::class,'rejectAssessment'])->name('assessment.reject');

    //Assessment Prof View Start of Assessment
    Route::get('/assessment/initialize/assessment', [AssessmentController::class, 'initializeAssessment'])->name('assessment.initialize');
    Route::get('/assessment/{assessmentId}/waiting-students', [AssessmentController::class,'getWaitingStudents'])->name('assessment.get-students');
    Route::post('/assessment/start/{assessmentId}', [AssessmentController::class, 'startAssessmentNow'])->name('assessment.start-now');
    Route::get('/assessment/{assessmentId}/status', [AssessmentController::class,'assessmentStatus'])->name('assessment.status');
    Route::get('/assessment/{assessmentId}/student-status', [AssessmentController::class,'getAssessmentStatus'])->name('assessment.get-student-status');
    Route::post('/assessment/{assessmentId}/end', [AssessmentController::class, 'endAssessment'])->name('assessment.end');
    Route::get('/assessment/{assessmentId}/results', [AssessmentController::class, 'assessmentResults'])->name('assessment.results');
    Route::get('/assessment/{assessmentId}/student/{studentId}', [AssessmentController::class, 'showIndividualAssessment'])->name('assessment.student');

});

Route::middleware(['auth', RoleMiddleware::class . ':student'])->group(function () {
    Route::get('/dashboard/student', [StudentDashboardController::class, 'index'])->name('students.dashboard');
    //Practice Assessment\
    Route::get('/student-practice-assessments/index', [StudentPracticeAssessmentController::class, 'index'])->name('practice-assessment-generator.index');
    Route::get('/student-practice-assessments/generator/form', [StudentPracticeAssessmentController::class, 'create'])->name('practice-assessment-generator.form');
    Route::post('/student-practice-assessments/generate/assessment', [StudentPracticeAssessmentController::class, 'store'])->name('practice-assessment-generator.store');
    Route::get('/student-practice-assessments/generate/assessment/{id}', [StudentPracticeAssessmentController::class,'show'])->name('practice-assessment-generator.show');
    Route::get('/student-practice-assessments/start/{id}', [StudentPracticeAssessmentController::class, 'startIndex'])->name('practice-assessment.start');
    Route::post('/student-practice-assessments/answer/{id}', [StudentPracticeAssessmentController::class, 'startAssessment'])->name('practice-assessment.start-post');
    Route::get('/student-practice-assessments/take/{id}', [StudentPracticeAssessmentController::class, 'takePracticeAssessment'])->name('practice-assessment.take');
    Route::post('/student-practice-assessments/{practiceAssessmentId}/questions/{questionId}/save', [StudentPracticeAssessmentController::class,'saveAnswer'])->name('practice-assessment.save');
    Route::post('/student-practice-assessments/{practiceAssessmentId}/save',[StudentPracticeAssessmentController::class,'submitAssessment'])->name('practice-assessment.submit');
    Route::get('/student-practice-assessments/result/{practiceAssessmentId}', [StudentPracticeAssessmentController::class,'viewAssessmentReport'])->name('practice-assessment.view-result');
});

//TEster
Route::get('/test-store', [StudentPracticeAssessmentController::class, 'testStore']);

require_once __DIR__ . '/user_management.php';

// Route::get('/test', function(){
//     return inertia('');
// });


// Route::resource('auth', AuthController::class)->except('login');

