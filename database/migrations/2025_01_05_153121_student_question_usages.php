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
        Schema::create('student_question_usages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('question_id')->constrained('questions')->onDelete('cascade');
            $table->decimal('selection_percentage', 5,2)->default(100);

            //Track attempts
            $table->unsignedInteger('correct_attempts')->default(0);
            $table->unsignedInteger('wrong_attempts')->default(0);

            //Track mastery
            $table->boolean('is_mastered')->default(false);
            $table->json('recent_attempts')->nullable();

            $table->timestamps();
            //Implement a softDelete
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_question_usages');
    }
};
