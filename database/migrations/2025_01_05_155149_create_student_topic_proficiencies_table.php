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
        Schema::create('student_topic_proficiencies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('topic_id')->constrained('topics')->onDelete('cascade');

            $table->enum('proficiency_level', ['beginner', 'intermediate', 'advanced'])->default('beginner'); //Proficiency level
            $table->decimal('average_score',5,2)->nullable(); //Track the student's average score for the topic
            $table->integer('attempts')->default(0); //Tracks the number of attempts for this topic
            $table->decimal('grade', 5,2)->nullable();
            $table->integer('mastered_questions')->default(0);
            $table->integer('total_questions')->default(0);
            
            $table->timestamps();
            //Soft delete
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_topic_proficiencies');
    }
};
