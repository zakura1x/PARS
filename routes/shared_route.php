<?php

use App\Exports\QuestionTemplateExport;
use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\Assessment\AssessmentCreateController;
use App\Http\Controllers\Assessment\AssessmentSubmissionController;
use App\Http\Controllers\Dashboard\ProfessorDashboardController;
use App\Http\Controllers\Dashboard\ProgramHeadDashboardController;
use App\Http\Controllers\Dashboard\StudentDashboardController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\StudyMaterialAttachmentController;
use App\Http\Controllers\StudyMaterialController;
use App\Http\Controllers\TopicsController;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Support\Facades\Route;
use Maatwebsite\Excel\Facades\Excel;

Route::middleware(['auth', RoleMiddleware::class . ':professor,program_head,dean' ])->group(function () {
    //Dashboard
    // Route::get('/dashboard/prof', [ProfessorDashboardController::class, 'index'])->name('professor.dashboard');
    Route::get('/dashboard/proficiency/student/{subjectId}', [ProgramHeadDashboardController::class, 'getProficiencyBySubject'])->name('get-proficiency-subject');
    Route::get('/dashboard/student/{studentId}', [StudentDashboardController::class, 'index']);
    Route::get('/dashboard/item-analysis/{id}', [AssessmentController::class, 'showItemAnalysis']);

    //Topics management
    Route::get('/topic/lists', [TopicsController::class, 'index'])->name('topics.index');
    Route::get('/topics/view/details/{subjectId}', [TopicsController::class, 'viewDetails'])->name('topics.view-details');
    Route::post('/topics/{subjectId}/store', [TopicsController::class, 'store'])->name('topics.store');
    Route::post('/topics/reorder/{subjectId}', [TopicsController::class, 'reorderTopics'])->name('topics.reorder');
    Route::get('/topics/edit/{subjectId}', [TopicsController::class, 'editView'])->name('topics.edit');
    Route::delete('/topics/delete/{topicId}', [TopicsController::class, 'delete'])->name('topic-delete');

    //Student Performance
    Route::get('/student/performance', [ProgramHeadDashboardController::class, 'studentAverages'])->name('student.performance');

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

    //Study Materials
    Route::get('/study-materials/index/{topicId}',  [StudyMaterialController::class, 'index'])->name('study-materials.index');
    Route::get('/study-materials/add/form/{topicId}', [StudyMaterialController::class, 'create'])->name('study-materials.form');
    Route::get('/study-materials/edit/{studyMaterialId}', [StudyMaterialController::class, 'edit'])->name('study-materials.edit');
    Route::post('/study-materials/add/new/{topicId}',[StudyMaterialController::class, 'store'])->name('study-materials.store');
    Route::delete('/study-materials/add/new/{studyMaterialId}', [StudyMaterialController::class, 'destroy'])->name('study-materials.destroy');
    Route::get('/attachments/download/{id}', [StudyMaterialAttachmentController::class, 'downloadAttachment'])->name('study-materials.download');
    Route::put('/study-materials/update/{studyMaterialId}', [StudyMaterialController::class, 'update'])->name('study-materials.update');

    //Study Materials attachment
    Route::post('/study-materials-attachment/add/new/{studyMaterialId}', [StudyMaterialAttachmentController::class, 'store'])->name('study-materials-attachment.store');
    Route::delete('/study-materials-attachment/delete/{studyMaterialId}', [StudyMaterialAttachmentController::class, 'destroy'])->name('study-materials-attachment.delete');

    //Assessment Generator Form
    Route::get('/assessment/generator/form/exam', [AssessmentCreateController::class, 'create'])->name('assessment-generator.form');
    //Assessment Store
    Route::post('/assessment/exam/create', [AssessmentCreateController::class, 'store'])->name('assessment-exam.store');
    //Assessment Edit
    Route::get('/assessment/edit/form/exam/{assessmentId}', [AssessmentCreateController::class, 'edit'])->name('assessment-edit.form');
    //Assessment Replace Question
    Route::post('/assessment/replace-question/{questionId}/{assessmentId}', [AssessmentCreateController::class, 'replaceQuestion'])->name('assessment-question.replace');
    
    
    //Assessment
    Route::get('/assessment/index/program-head', [AssessmentController::class, 'indexForProf'])->name('assessment-PH.index');

    //Approval Form
    Route::get('/assessment/approval/form/{assessmentId}', [AssessmentController::class, 'assessmentApprovalForm'])->name('assessment-approval.form');
    //Update the title of the assessment
    Route::put('/assessment/update/title/{assessmentId}', [AssessmentCreateController::class, 'updateTitle'])->name('assessment-update.title');
    //Update the assessment details
    Route::put('/assessment/update/{assessmentId}', [AssessmentCreateController::class, 'update']);

    //Update the status of the assessment
    Route::put('/assessment/update/approval/{assessmentId}', [AssessmentSubmissionController::class,'submitForApproval'])->name('assessment-update.approval');

    //Fork the assessment
    Route::post('/assessment/copy/{assessmentId}', [AssessmentCreateController::class, 'forkAssessment'])->name('assessment.fork');
    //Delete the assessment
    Route::delete('/assessment/delete/{assessmentId}', [AssessmentController::class, 'destroy'])->name('assessment.delete');

    //Assessment Prof View Start of Assessment
    Route::put('/assessment/update/to/wait/{assessmentId}', [AssessmentController::class,'updateToWait'])->name('assessment.update.wait');
    Route::get('/assessment/initialize/assessment/{assessmentId}', [AssessmentController::class, 'initializeAssessment'])->name('assessment.initialize');
    Route::get('/assessment/{assessmentId}/waiting-students', [AssessmentController::class,'getWaitingStudents'])->name('assessment.get-students');
    Route::post('/assessment/start/{assessmentId}', [AssessmentController::class, 'startAssessmentNow'])->name('assessment.start-now');
    Route::get('/assessment/{assessmentId}/status', [AssessmentController::class,'assessmentStatus'])->name('assessment.status');
    Route::get('/assessment/{assessmentId}/student-status', [AssessmentController::class,'getAssessmentStatus'])->name('assessment.get-student-status');
    Route::post('/assessment/{assessmentId}/end', [AssessmentController::class, 'endAssessment'])->name('assessment.end');
    Route::get('/assessment/{assessmentId}/results', [AssessmentController::class, 'assessmentResults'])->name('assessment.results');
    Route::get('/assessment/{assessmentId}/student/prof/view/{studentId}', [AssessmentController::class, 'showIndividualAssessment'])->name('assessment.student');
    Route::get('/assessment/{assessmentId}/item-analysis', [AssessmentController::class, 'assessmentItemAnalysis'])->name('assessment.item-analysis');

});