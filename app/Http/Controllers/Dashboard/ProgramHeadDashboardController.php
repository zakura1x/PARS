<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Assessment;
use App\Models\Dean;
use App\Models\Professor;
use App\Models\ProgramHead;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Topics;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProgramHeadDashboardController extends Controller
{
    public function index(Request $request)
    {
        // 1. Get counts of all topics in the system
        $totalTopicsCount = Topics::count();

        // 2. Assessments needing approval
        $assessmentsNeedingApproval = Assessment::where('approved', false)
            ->where('status', 'pending')
            ->whereNull('comment')
            ->count();

        // 3. High proficiency students (advanced in all assessed topics)
        $highProficiencyStudents = User::whereHas('topicProficiencies', function($q) {
            $q->where('proficiency_level', 'advanced');
        })
            ->withCount(['topicProficiencies as advanced_topics' => function($query) {
                $query->where('proficiency_level', 'advanced');
            }])
            ->withCount('topicProficiencies as total_assessed_topics')
            ->having('advanced_topics', '=', \DB::raw('total_assessed_topics'))
            ->count();

        // 4. Total enrolled students
        $totalStudents = Student::whereHas('user', function($q) {
            $q->whereNull('deleted_at');
        })->count();

        // 5. Students needing intervention (comprehensive approach)
        $studentsNeedingIntervention = User::where(function($query) use ($totalTopicsCount) {
            $interventionThreshold = max(3, $totalTopicsCount * 0.3);

            $query->whereHas('topicProficiencies', function($q) {
                    $q->where('proficiency_level', 'beginner');
                })
                ->orWhereHas('topicProficiencies', function($q) use ($interventionThreshold) {
                    $q->groupBy('student_id')
                     ->havingRaw('COUNT(*) < ?', [$interventionThreshold]);
                });
        })
        ->count();

        // 6. Active staff counts - only non-deleted
        $activeProfessors = Professor::whereHas('user', function($q) {
            $q->whereNull('deleted_at')->where('role', 'professor');
        })->count();

        $activeProgramHeads = ProgramHead::whereHas('user', function($q) {
                $q->whereNull('deleted_at');
            })->count();

        $activeDeans = Dean::whereHas('user', function($q) {
                $q->whereNull('deleted_at');
            })->count();

        // 7. Assessment status counts
        $completedAssessmentsCount = Assessment::where('status', 'completed')->count();
        $pendingAssessmentsCount = Assessment::where('status', 'pending')->count();

        // 8. Recent assessments (limit to 5 for the dashboard)
        $recentCompletedAssessments = Assessment::with(['subject', 'creator'])
            ->where('status', 'completed')
            ->latest()
            ->take(5)
            ->get()
            ->map(function($assessment) {
                return [
                    'id' => $assessment->id,
                    'title' => $assessment->title,
                    'subject' => $assessment->subject->name,
                    'creator' => $assessment->creator->full_name,
                    'created_at' => $assessment->created_at->format('M d, Y'),
                ];
            });

        // 9. Students with their average scores (limited for dashboard)
        $studentsWithAverages = User::whereNull('deleted_at')
            ->with(['student', 'topicProficiencies', 'assessmentResults.result'])
            ->whereHas('student')
            ->withCount(['assessmentResults as completed_assessments' => function($q) {
                $q->whereNotNull('completed_at')
                ->whereHas('result');
            }])
            ->orderByDesc('completed_assessments')
            ->take(10)
            ->get()
            ->map(function($user) {
                $totalScore = 0;
                $totalQuestions = 0;

                foreach ($user->assessmentResults as $assessment) {
                    if ($assessment->result) {
                        $totalScore += $assessment->result->correct_answers;
                        $totalQuestions += $assessment->result->total_questions;
                    }
                }

                $averageScore = $totalQuestions > 0
                    ? round(($totalScore / $totalQuestions) * 100, 2)
                    : 0;

                return [
                    'id' => $user->id,
                    'name' => $user->full_name,
                    'email' => $user->email,
                    'average_score' => $averageScore,
                    'assessments_completed' => $user->completed_assessments,
                ];
            });

            //10. Get all the students proficiency distribution
            // Get proficiency distribution per topic filtered by subject
            $subjectsWithProficiency = Subject::when($request->subject_id, function($query, $subjectId) {
                $query->where('id', $subjectId);
            })
            ->with(['topics' => function($query) {
                $query->withCount([
                    'studentProficiencies as beginner_count' => function($q) {
                        $q->whereHas('student', function($q) {
                            $q->whereHas('user', function($q) {
                                $q->whereNull('deleted_at');
                            });
                        })->where('proficiency_level', 'beginner');
                    },
                    'studentProficiencies as intermediate_count' => function($q) {
                        $q->whereHas('student', function($q) {
                            $q->whereHas('user', function($q) {
                                $q->whereNull('deleted_at');
                            });
                        })->where('proficiency_level', 'intermediate');
                    },
                    'studentProficiencies as advanced_count' => function($q) {
                        $q->whereHas('student', function($q) {
                            $q->whereHas('user', function($q) {
                                $q->whereNull('deleted_at');
                            });
                        })->where('proficiency_level', 'advanced');
                    },
                    'studentProficiencies as total_count' => function($q) {
                        $q->whereHas('student', function($q) {
                            $q->whereHas('user', function($q) {
                                $q->whereNull('deleted_at');
                            });
                        });
                    }
                ]);
            }])
            ->get()
            ->map(function($subject) {
                return [
                    'subject_id' => $subject->id,
                    'subject_name' => $subject->name,
                    'topics' => $subject->topics->map(function($topic) {
                        return [
                            'topic_id' => $topic->id,
                            'topic_name' => $topic->name,
                            'proficiency_distribution' => [
                                'beginner' => $topic->beginner_count,
                                'intermediate' => $topic->intermediate_count,
                                'advanced' => $topic->advanced_count,
                                'total' => $topic->total_count,
                                'beginner_percentage' => $topic->total_count > 0
                                    ? round(($topic->beginner_count / $topic->total_count) * 100, 2)
                                    : 0,
                                'intermediate_percentage' => $topic->total_count > 0
                                    ? round(($topic->intermediate_count / $topic->total_count) * 100, 2)
                                    : 0,
                                'advanced_percentage' => $topic->total_count > 0
                                    ? round(($topic->advanced_count / $topic->total_count) * 100, 2)
                                    : 0,
                            ]
                        ];
                    })
                ];
            });

        //dd($assessmentsNeedingApproval);

        return Inertia::render('ProgramHead/ProgramHeadDashboard', [
            'metrics' => [
                'assessmentsNeedingApproval' => $assessmentsNeedingApproval,
                'highProficiencyStudents' => $highProficiencyStudents,
                'totalStudents' => $totalStudents,
                'studentsNeedingIntervention' => $studentsNeedingIntervention,
                'activeProfessors' => $activeProfessors,
                'activeProgramHeads' => $activeProgramHeads,
                'activeDeans' => $activeDeans,
                'completedAssessments' => $completedAssessmentsCount,
                'totalTopics' => $totalTopicsCount,
                'pendingAssessments' => $pendingAssessmentsCount,
            ],
            'recentAssessments' => $recentCompletedAssessments,
            'studentPerformance' => $studentsWithAverages,
            'proficiencyDistribution' => $subjectsWithProficiency,
            'allSubjects' => Subject::all()->map(fn($s) => ['id' => $s->id, 'name' => $s->name]),
            'pendingAssessmentsList' => Assessment::where('status', 'pending')
                ->where('approved', false)
                ->whereNull('comment')
                ->with(['subject', 'creator'])
                ->get(),
        ]);
    }

    public function getProficiencyBySubject($subjectId)
    {
        $subjectWithProficiency = Subject::where('id', $subjectId)
            ->with(['topics' => function($query) {
                $query->withCount([
                    'studentProficiencies as beginner_count' => function($q) {
                        $q->whereHas('student', function($q) {
                            $q->whereHas('user', function($q) {
                                $q->whereNull('deleted_at');
                            });
                        })->where('proficiency_level', 'beginner');
                    },
                    'studentProficiencies as intermediate_count' => function($q) {
                        $q->whereHas('student', function($q) {
                            $q->whereHas('user', function($q) {
                                $q->whereNull('deleted_at');
                            });
                        })->where('proficiency_level', 'intermediate');
                    },
                    'studentProficiencies as advanced_count' => function($q) {
                        $q->whereHas('student', function($q) {
                            $q->whereHas('user', function($q) {
                                $q->whereNull('deleted_at');
                            });
                        })->where('proficiency_level', 'advanced');
                    },
                    'studentProficiencies as total_count' => function($q) {
                        $q->whereHas('student', function($q) {
                            $q->whereHas('user', function($q) {
                                $q->whereNull('deleted_at');
                            });
                        });
                    }
                ]);
            }])
            ->get()
            ->map(function($subject) {
                return [
                    'subject_id' => $subject->id,
                    'subject_name' => $subject->name,
                    'topics' => $subject->topics->map(function($topic) {
                        return [
                            'topic_id' => $topic->id,
                            'topic_name' => $topic->name,
                            'proficiency_distribution' => [
                                'beginner' => $topic->beginner_count,
                                'intermediate' => $topic->intermediate_count,
                                'advanced' => $topic->advanced_count,
                                'total' => $topic->total_count,
                                'beginner_percentage' => $topic->total_count > 0
                                    ? round(($topic->beginner_count / $topic->total_count) * 100, 2)
                                    : 0,
                                'intermediate_percentage' => $topic->total_count > 0
                                    ? round(($topic->intermediate_count / $topic->total_count) * 100, 2)
                                    : 0,
                                'advanced_percentage' => $topic->total_count > 0
                                    ? round(($topic->advanced_count / $topic->total_count) * 100, 2)
                                    : 0,
                            ]
                        ];
                    })
                ];
            });

        return response()->json($subjectWithProficiency);
    }

    // Separate endpoint if you need full student averages (not just top 10)
    public function studentAverages()
    {
        $studentsWithAverages = User::whereNull('deleted_at')
            ->with(['student', 'assessmentResults.result'])
            ->whereHas('student')
            ->get()
            ->map(function($user) {
                $totalScore = 0;
                $totalQuestions = 0;

                foreach ($user->assessmentResults as $assessment) {
                    if ($assessment->result) {
                        $totalScore += $assessment->result->correct_answers;
                        $totalQuestions += $assessment->result->total_questions;
                    }
                }

                $averageScore = $totalQuestions > 0
                    ? round(($totalScore / $totalQuestions) * 100, 2)
                    : 0;

                return [
                    'id' => $user->id,
                    'name' => $user->full_name,
                    'average_score' => $averageScore,
                ];
            });

        return Inertia::render('Dashboard/StudentAverages', [
            'students' => $studentsWithAverages,
        ]);
    }

}
