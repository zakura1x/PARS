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
        Schema::create('student_assessment_topic_proficiencies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assessment_id')->constrained('student_practice_assessments')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('topic_id')->constrained('topics')->onDelete('cascade');
            $table->decimal('previous_grade', 5,2)->default(0);
            $table->string('previous_level')->default('beginner');
            $table->decimal('grade', 5,2)->default(0);
            $table->string('current_level')->default('beginner');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_assessment_topic_proficiencies');
    }
};
