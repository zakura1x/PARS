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
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('assessment_id')->constrained('assessments')->onDelete('cascade');

            //Fillable
            $table->enum('type', ['practice', 'assessment', 'examination']);
            $table->decimal('score', 5,2); //Decimal for percentage or points Perfect for storing percentage scores (like 85.50%) or points that need decimal precision
            $table->integer('total_score'); //For example, if a test is out of 100 points, total_score would be 100
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
        Schema::dropIfExists('grades');
    }
};
