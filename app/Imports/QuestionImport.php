<?php

namespace App\Imports;

use App\Models\Question;
use App\Models\Subject;
use App\Models\Topics;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Collection;

class QuestionImport implements ToCollection, WithHeadingRow
{
    public $duplicates = []; // Store duplicate questions

    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            // Validate the row data
            $validator = Validator::make($row->toArray(), [
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
                continue; // Skip invalid rows
            }

            // Convert subject_name and topic_name to their respective IDs
            $subject = Subject::where('name', $row['subject_name'])->first();
            $topic = Topics::where('name', $row['topic_name'])->first();

            // Check for existing question
            $existingQuestion = Question::where([
                'question_text'=> $row['question_text'],
            ])->exists();

            if ($existingQuestion) {
                // Store duplicate questions
                $this->duplicates[] = [
                    'question'  => $row['question_text'],
                ];
                continue;
            }

            // Insert the question if it's not a duplicate
            Question::create([
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
}
