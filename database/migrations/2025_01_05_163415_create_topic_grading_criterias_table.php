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
        Schema::create('topic_grading_criteria', function (Blueprint $table) {
            $table->id();
            $table->foreignId('topic_id')->constrained('topics')->onDelete('cascade');
            $table->enum('difficulty', ['remembering', 'understanding', 'applying', 'analyzing', 'evaluating', 'create']);
            $table->integer('percentage')->default(0);
            $table->integer('min_questions')->default(1);
            $table->timestamps();
            //softDelete
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('topic_grading_criteria');
    }
};
