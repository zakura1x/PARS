<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Assessment;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Topics;
use App\Models\User;
use Illuminate\Http\Request;

class ProfessorDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
    
        // Check if user is a professor
        if (!$user->professor) {
            abort(403, 'Unauthorized access');
        }
        
        $professor = $user->professor;
        $userId = $user->id;

        //dd($professor);
        
        // 1. Get counts of all topics in the professor's subjects
        $totalTopicsCount = Topics::whereHas('subject', function($q) use ($professor) {
            $q->where('professor_id', $professor->id);
        })->count();

        //dd($totalTopicsCount);

        // 2. Assessments needing approval (only those created by this professor)
        $assessmentsNeedingApproval = Assessment::where('approved', false)
            ->where('status', 'pending')
            ->whereNull('comment')
            ->where('created_by', $userId)  // Add this condition
            ->count();

        //dd($assessmentsNeedingApproval);

        // 3. High proficiency students in professor's subjects (advanced in all assessed topics)
        $highProficiencyStudents = User::whereHas('topicProficiencies', function($q) use ($professor) {
            $q->where('proficiency_level', 'advanced')
              ->whereHas('topic.subject', function($q) use ($professor) {
                  $q->where('professor_id', $professor->id);
              });
        })
            ->withCount(['topicProficiencies as advanced_topics' => function($query) use ($professor) {
                $query->where('proficiency_level', 'advanced')
                      ->whereHas('topic.subject', function($q) use ($professor) {
                          $q->where('professor_id', $professor->id);
                      });
            }])
            ->withCount(['topicProficiencies as total_assessed_topics' => function($query) use ($professor) {
                $query->whereHas('topic.subject', function($q) use ($professor) {
                    $q->where('professor_id', $professor->id);
                });
            }])
            ->having('advanced_topics', '=', \DB::raw('total_assessed_topics'))
            ->count();

        //dd($highProficiencyStudents);

        // 4. Total enrolled students in professor's subjects
        $totalStudents = Student::whereHas('user', function($q) {
            $q->whereNull('deleted_at');
        })->count();

        // 5. Students needing intervention in professor's subjects
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

        // 6. Assessment status counts for professor's subjects
        $completedAssessmentsCount = Assessment::where('status', 'completed')
            ->where('created_by', $userId)
            ->count();
            
        $pendingAssessmentsCount = Assessment::where('status', 'pending')
            ->where('created_by', $userId)
            ->count();

        // 7. Recent assessments (limit to 5 for the dashboard) - only professor's
        $recentCompletedAssessments = Assessment::with(['subject', 'creator'])
            ->where('status', 'completed')
            ->where('created_by', $userId)
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

        // 8. Students with their average scores in professor's subjects
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

        // 9. Get proficiency distribution for professor's subjects
        $subjectsWithProficiency = Subject::where('professor_id', $professor->id)
            ->when($request->subject_id, function($query, $subjectId) {
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

            
        
        return inertia('Dashboard/ProfessorDashboard', [
            'metrics' => [
                'assessmentsNeedingApproval' => $assessmentsNeedingApproval,
                'highProficiencyStudents' => $highProficiencyStudents,
                'totalStudents' => $totalStudents,
                'studentsNeedingIntervention' => $studentsNeedingIntervention,
                'completedAssessments' => $completedAssessmentsCount,
                'totalTopics' => $totalTopicsCount,
                'pendingAssessments' => $pendingAssessmentsCount,
            ],
            'recentAssessments' => $recentCompletedAssessments,
            'studentPerformance' => $studentsWithAverages,
            'proficiencyDistribution' => $subjectsWithProficiency,
            'allSubjects' => Subject::where('professor_id', $professor->id)
                ->get()
                ->map(fn($s) => ['id' => $s->id, 'name' => $s->name]),
            'pendingAssessmentsList' => Assessment::where('status', 'pending')
                ->where('approved', false)
                ->whereNull('comment')
                ->where('created_by', $userId)
                ->with(['subject', 'creator'])
                ->get(),
        ]);
    }

    public function getProficiencyBySubject($subjectId)
    {
        // Verify the professor teaches this subject
        $professor = auth()->user()->professor;
        $subject = Subject::where('professor_id', $professor->id)
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
            ->findOrFail($subjectId);

        // Transform the data to match what the frontend expects
        $proficiencyData = $subject->topics->map(function($topic) {
            return [
                'topic' => $topic->name,
                'beginner' => $topic->beginner_count,
                'intermediate' => $topic->intermediate_count,
                'advanced' => $topic->advanced_count,
            ];
        });

        return response()->json($proficiencyData);
    }
}
