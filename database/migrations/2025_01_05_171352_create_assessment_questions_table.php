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
        Schema::create('assessment_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assessment_id')->constrained('assessments')->onDelete('cascade');
            $table->foreignId('question_id')->constrained('questions')->onDelete('cascade');
            
            // Track the very first question (never changes)
            $table->unsignedBigInteger('original_question_id')->nullable();
            $table->foreign('original_question_id')->references('id')->on('questions');
            
            // Track the immediate previous question that was replaced
            $table->unsignedBigInteger('replaced_question_id')->nullable();
            $table->foreign('replaced_question_id')->references('id')->on('questions');
            
            // Track who replaced it (program head or auto-replacement)
            $table->boolean('replaced_by_program_head')->default(false);
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessment_questions');
    }
};
