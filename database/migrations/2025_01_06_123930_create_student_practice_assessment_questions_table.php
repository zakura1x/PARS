<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('student_practice_assessment_questions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('practice_assessment_id'); // Foreign key column
            $table->unsignedBigInteger('question_id');
            $table->json('student_answer')->nullable();
            $table->boolean('answered')->default(false); // New column
            $table->boolean('is_correct')->default(false); // New column
            $table->timestamps();

            // Define foreign key constraint with a custom name
            $table->foreign('practice_assessment_id', 'spaq_practice_assessment_fk')
                  ->references('id')
                  ->on('student_practice_assessments')
                  ->onDelete('cascade');
            // Define foreign key constraint for question_id (assuming the `questions` table exists)
            $table->foreign('question_id', 'spaq_question_fk')
                  ->references('id')
                  ->on('questions') // Make sure this references the correct table
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_practice_assessment_questions');
    }
};
