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
        Schema::create('student_practice_assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('subject_id')->constrained('subjects')->onDelete('cascade');
            $table->integer('total_items');
            $table->enum('type', ['proficiency', 'criteria', 'exam']);
            $table->enum('status', ['active', 'completed', 'on_going'])->default('active');
            $table->time('time_limit')->nullable(); // Time limit (e.g., 00:30:00 for 30 minutes)
            $table->json('student_answer');
            $table->timestamp('started_at')->nullable(); // Timestamp when the assessment starts
            $table->timestamp('submitted_at')->nullable(); // Timestamp when the assessment is submitted
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_practice_assessments');
    }
};
