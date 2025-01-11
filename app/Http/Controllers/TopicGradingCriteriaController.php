<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTopicGradingCriteriaRequest;
use App\Http\Requests\UpdateTopicGradingCriteriaRequest;
use App\Models\Subject;
use App\Models\TopicGradingCriteria;
use App\Models\Topics;
use Illuminate\Http\Request;

class TopicGradingCriteriaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Get the search query and subject ID
        $search = $request->input('search');
        $subjectId = $request->input('subject_id');

        // Get all the Subjects for the dropdown
        $subjects = Subject::all();

        // Get all the Topics with search functionality
        $topics = Topics::when($subjectId, function ($query, $subjectId) {
            return $query->where('subject_id', $subjectId);
        })
        ->when($search, function ($query, $search) {
            return $query->where('name', 'like', "%{$search}%");
        })
        ->latest() // Orders by created_at in descending order
        ->paginate(10);

        // Return Inertia component
        return inertia('TopicGradingCriteria/CriteriaIndex', [
            'subjects' => $subjects,
            'topics' => $topics,
            'search' => $search,
            'subjectId' => $subjectId,
        ]);
    }

    /**
     * Get the topics from the SubjectId
     *
    */
    public function indexTopics($subjectId){
        // Get all the topics based on the subjectId with pagination and in descending order
        $topics = Topics::where('subject_id', $subjectId)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Return inertia component of the topics
        return inertia('TopicGradingCriteria/CriteriaTopics', ['topics' => $topics]);
    }
    /**
     * Not yet WORKING
     * Function that checks if the topic has already a criteria
     * if it has already a criteria, Pass the needed information in the form to edit the criteria
     * else , do not pass anything and it should proceed with a blank form
     */
    public function createOrEdit($topicId){
        // Check if the topic already has criteria
        $criteria = TopicGradingCriteria::where('topic_id', $topicId)->get();

        // Fetch the topic by ID
        $topic = Topics::findOrFail($topicId);

        // If criteria exists, pass the needed information to the form to edit the criteria
        return inertia('TopicGradingCriteria/CriteriaForm', [
            'topic' => Topics::findOrFail($topicId),
            'criteria' => $criteria->isNotEmpty() ? $criteria : null,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $topicId)
    {
        // Fetch the topic by ID
        $topic = Topics::findOrFail($topicId);

        // Validate the incoming request data
        $request->validate([
            'criteria' => 'required|array',
            'criteria.*.difficulty' => 'required|in:remembering,understanding,applying,analyzing,evaluating,create',
            'criteria.*.percentage' => 'required|numeric|min:0|max:100',
            'criteria.*.min_questions' => 'required|integer|min:1'
        ]);

        // Validate that the total percentage should equal 100
        $totalPercentage = array_sum(array_column($request->criteria, 'percentage'));
        if ($totalPercentage !== 100) {
            return back()->withErrors(['totalPercentage' => 'Total percentage for the topic must equal to 100.']);
        }

        // Save each difficulty level's criteria
        foreach ($request->criteria as $criterion) {
            TopicGradingCriteria::updateOrCreate(
                [
                    'topic_id' => $topicId,
                    'difficulty' => $criterion['difficulty'],
                ],
                [
                    'percentage' => $criterion['percentage'],
                    'min_questions' => $criterion['min_questions']
                ]
            );
        }

        // Redirect to the index route with a success message
        return to_route('topic-grading-criteria.index')->with('message', 'Topic Grading Criteria created successfully!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function update(Request $request, $topicId, $criterionId)
    {
        $request->validate([
            'criteria' => 'required|array',
            'criteria.*.difficulty' => 'required|in:remembering,understanding,applying,analyzing,evaluating,create',
            'criteria.*.percentage' => 'required|integer|min:0|max:100',
            'criteria.*.min_questions' => 'required|integer|min:1',
        ]);

        // Check if the Total Percentage is 100
        $totalPercentage = array_sum(array_column($request->criteria, 'percentage'));
        if ($totalPercentage !== 100) {
            return back()->withErrors(['totalPercentage' => 'Total percentage for the topic must equal to 100.']);
        }

        foreach ($request->criteria as $criterion) {
            TopicGradingCriteria::where('topic_id', $topicId)
                ->where('difficulty', $criterion['difficulty'])
                ->update([
                    'percentage' => $criterion['percentage'],
                    'min_questions' => $criterion['min_questions']
                ]);
        }

        return to_route('topic-grading-criteria.index')
            ->with('message', 'Topic Grading Criteria was updated Successfully!');
    }

    /**
     * UPDATE THIS:
     * DESTROY FUNCTION SHOULD BE IN THE TOPIC AREA. SO WHEN THE TOPIC IS DELETED/SOFTDELETED 
     * ALSO DELETE/SOFTDELETE THE TopicGradingCriteria
     */
    public function destroy($topicId)
    {
        $topic = Topics::findOrFail($topicId);
        $topic->criteria()->delete(); // Ensure a relationship exists in the `Topics` model
        return to_route('topic-grading-criteria.index')->with('message', 'Criteria deleted successfully!');
    }
}