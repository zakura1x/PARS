public function generateAssessment(Request $request)
{
    // ...existing code...

    $questions = $this->getQuestionsForAssessment($request);

    if (empty($questions) || $questions->isEmpty()) {
        return back()->with(['message' => 'No questions available for this assessment.'], 422);
    }

    // ...existing code...
}
