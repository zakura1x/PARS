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
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subject_id')->constrained('subjects')->onDelete('cascade');
            $table->foreignId('topic_id')->constrained('topics')->onDelete('cascade');
            
            //Question Details
            $table->enum('format_type',['multiple_choice', 'enumeration', 'true_or_false', 'fill_in_the_blank']);
            $table->enum('purpose_type',['practice', 'assessment', 'examination']);
            $table->enum('difficulty', ['remembering', 'understanding', 'analyzing', 'evaluating', 'create']);
            $table->text('question_text');
            $table->json('options')->nullable();
            $table->json('correct_answer')->nullable();
            $table->integer('weight')->default(1);
            $table->string('attachment_path')->nullable();
            $table->enum('status', ['active', 'inactive', 'archived'])->default('active');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
