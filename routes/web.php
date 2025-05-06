<?php

use App\Exports\QuestionTemplateExport;
use App\Http\Controllers\Assessment\AssessmentApprovalController;
use App\Http\Controllers\Assessment\AssessmentController as AssessmentAssessmentController;
use App\Http\Controllers\Assessment\AssessmentCreateController;
use App\Http\Controllers\Assessment\AssessmentGradeController;
use App\Http\Controllers\Assessment\AssessmentSubmissionController;
use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Dashboard\ProfessorDashboardController;
use App\Http\Controllers\Dashboard\ProgramHeadDashboardController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PracticeAssessment\GeneratePracticeAssessmentController;
use App\Http\Controllers\ProfileManagementController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\Dashboard\StudentDashboardController;
use App\Http\Controllers\StudentPracticeAssessmentController;
use App\Http\Controllers\StudyMaterialAttachmentController;
use App\Http\Controllers\StudyMaterialController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TableOfSpecificationController;
use App\Http\Controllers\TopicGradingCriteriaController;
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

Route::middleware(['auth'])->group(function(){
   Route::get('/profile', [ProfileManagementController::class, 'index'])->name('profile');
   Route::post('/profile/update-password', [ProfileManagementController::class, 'updatePassword'])->name('profile.update-password');
   Route::post('/profile/update-avatar', [ProfileManagementController::class, 'updateAvatar'])->name('profile.update-avatar');
});

Route::middleware(['auth', RoleMiddleware::class . ':professor'])->group(function () {
    Route::get('/dashboard/prof', [ProfessorDashboardController::class, 'index'])->name('professor.dashboard');
});


Route::middleware(['auth', RoleMiddleware::class . ':program_head'])->group(function () {

    //Dashboard
    Route::get('/dashboard', [ProgramHeadDashboardController::class, 'index'])->name('dashboard');
    Route::get('/pending-assessments', [ProgramHeadDashboardController::class, 'getPendingAssessments']);
    Route::get('/dashboard/proficiency/student/{subjectId}', [ProgramHeadDashboardController::class, 'getProficiencyBySubject'])->name('get-proficiency-subject');
    Route::get('/dashboard/student/{studentId}', [StudentDashboardController::class, 'index']);
    Route::get('/dashboard/item-analysis/{id}', [AssessmentController::class, 'showItemAnalysis']);

    //SUBJECT MANAGEMENT
    Route::get('/subjectList', [SubjectController::class, 'index'])->name('subjectList');
    Route::post('/addSubject',[SubjectController::class,'store'])->name('subject-store');
    Route::put('/subjects/edit/{id}', [SubjectController::class, 'edit'])->name('subjects-edit');

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

    //Table of Specification
    Route::get('/table-of-specification/index', [TableOfSpecificationController::class, 'index'])->name('tos.index');
    Route::get('/table-of-specification/forms/{subjectId}', [TableOfSpecificationController::class, 'createOrEditForm'])->name('tos.form');
    Route::post('/table-of-specification/save/form', [TableOfSpecificationController::class, 'store'])->name('tos.store');
    Route::get('/table-of-specification/view/{subjectId}', [TableOfSpecificationController::class, 'show'])->name('tos.show');

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

    //Update the status of the assessment
    Route::put('/assessment/update/approval/{assessmentId}', [AssessmentSubmissionController::class,'submitForApproval'])->name('assessment-update.approval');
    //Replace the question by the program head
    Route::post('/assessment/replace/question/program-head/{questionId}/{assessmentId}', [AssessmentApprovalController::class, 'replaceQuestionByProgramHead'])->name('question.replace.program-head');

    //Approve the assessment
    Route::post('/assessment/update/approve/{assessmentId}', [AssessmentApprovalController
    ::class,'approveAssessment'])->name('assessment.approve');

    //Disapprove the assessment
    Route::post('/assessment/update/reject/{assessmentId}', [AssessmentApprovalController::class,'rejectAssessment'])->name('assessment.reject');

    //Fork the assessment
    Route::post('/assessment/copy/{assessmentId}', [AssessmentCreateController::class, 'forkAssessment'])->name('assessment.fork');

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

Route::middleware(['auth', RoleMiddleware::class . ':student'])->group(function () {
    Route::get('/dashboard/student', [StudentDashboardController::class, 'index'])->name('students.dashboard');

    //Practice Assessment
    Route::get('/student-practice-assessments/index', [StudentPracticeAssessmentController::class, 'index'])->name('practice-assessment-generator.index');
    Route::get('/student-practice-assessments/generator/form', [GeneratePracticeAssessmentController::class, 'create'])->name('practice-assessment-generator.form');
    Route::get('/api/recommended-topics', [GeneratePracticeAssessmentController::class, 'getRecommendedTopics'])->name('practice-assessment-generator.recommended-topics');
    Route::get('/api/topic-proficiencies', [GeneratePracticeAssessmentController::class, 'getTopicProficiencies'])->name('practice-assessment-generator.topic-proficiencies');
    Route::post('/student-practice-assessments/generate/assessment', [GeneratePracticeAssessmentController::class, 'store'])->name('practice-assessment-generator.store');
    Route::get('/student-practice-assessments/generate/assessment/{id}', [StudentPracticeAssessmentController::class,'show'])->name('practice-assessment-generator.show');
    Route::get('/student-practice-assessments/start/{id}', [StudentPracticeAssessmentController::class, 'startIndex'])->name('practice-assessment.start');
    Route::post('/student-practice-assessments/answer/{id}', [StudentPracticeAssessmentController::class, 'startAssessment'])->name('practice-assessment.start-post');
    Route::get('/student-practice-assessments/take/{id}', [StudentPracticeAssessmentController::class, 'takePracticeAssessment'])->name('practice-assessment.take');
    Route::post('/student-practice-assessments/{practiceAssessmentId}/questions/{questionId}/save', [StudentPracticeAssessmentController::class,'saveAnswer'])->name('practice-assessment.save');
    Route::post('/student-practice-assessments/{practiceAssessmentId}/save',[StudentPracticeAssessmentController::class,'submitAssessment'])->name('practice-assessment.submit');
    Route::get('/student-practice-assessments/result/{practiceAssessmentId}', [StudentPracticeAssessmentController::class,'viewAssessmentReport'])->name('practice-assessment.view-result');

    //Assessment
    //Route for the Assessment index
    Route::get('/assessment/student/index', [AssessmentController::class, 'studentIndex'])->name('student.assessment.index');
    // Route for the input code view
    Route::get('/assessment/input/code', [AssessmentController::class, 'inputCode'])->name('assessment.inputCode');
    // Route for joining the assessment
    Route::post('/assessment/join', [AssessmentController::class, 'joinAssessment'])->name('assessment.join');
    // Route for the waiting list view
    Route::get('/assessment/waiting-list', [AssessmentController::class, 'waitingList'])->name('assessment.waitingList');
    //Route for the taking of assessment
    Route::get('/assessment/take/{assessmentId}', [AssessmentController::class,'takeAssessment'])->name('assessment.take-assessment');
    // Save answer for a question
    Route::post('/assessment/{assessmentId}/questions/{questionId}/save', [AssessmentController::class, 'saveAnswer']);
    // Submit the entire assessment
    Route::put('/assessment/{assessmentId}/submit/{studentId}', [AssessmentGradeController::class, 'submitAssessment'])->name('assessment.submit');
    //View the assessment result
    Route::get('/assessment/{assessmentId}/student/{studentId}', [AssessmentController::class, 'showIndividualAssessment'])->name('assessment.student-result');

    //Study Material
    Route::get('/study-materials/index', [StudyMaterialController::class, 'studentIndex'])->name('student-study-materials.index');
    Route::get('/study-materials/view/{topicId}', [StudyMaterialController::class, 'studentShowTopics'])->name('student-study-materials.show');
    Route::get('/study-materials/subtopic/{topicId}', [StudyMaterialController::class, 'studentShowSubTopics'])->name('student-study-materials.subtopic');
    Route::get('/study-materials/{topicId}', [StudyMaterialController::class, 'studentShowStudyMaterial'])->name('student-study-materials.study-material');
});


require_once __DIR__ . '/user_management.php';

