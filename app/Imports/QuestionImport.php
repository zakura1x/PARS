<?php

namespace App\Imports;

use App\Models\Question;
use App\Models\Subject;
use App\Models\Topics;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class QuestionImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // Validate the row data
        $validator = Validator::make($row, [
            'subject_name'   => 'required|exists:subjects,name',
            'topic_name'     => 'required|exists:topics,name',
            'format_type'    => 'required|in:multiple_choice,enumeration,true_or_false,fill_in_the_blank',
            'purpose_type'   => 'required|in:practice,assessment,examination',
            'difficulty'     => 'required|in:remembering,understanding,applying,analyzing,evaluating,create',
            'question_text'  => 'required|string|max:255',
            'options'        => 'nullable|json',
            'correct_answer' => 'required|json',
            'weight'         => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return null; // Skip invalid rows
        }

        // Convert subject_name and topic_name to their respective IDs
        $subject = Subject::where('name', $row['subject_name'])->first();
        $topic = Topics::where('name', $row['topic_name'])->first();

        return new Question([
            'user_id'        => Auth::id(),
            'subject_id'     => $subject->id,
            'topic_id'       => $topic->id,
            'format_type'    => $row['format_type'],
            'purpose_type'   => $row['purpose_type'],
            'difficulty'     => $row['difficulty'],
            'question_text'  => $row['question_text'],
            'options'        => json_decode($row['options'], true),
            'correct_answer' => json_decode($row['correct_answer'], true),
            'weight'         => $row['weight'],
        ]);
    }
}
