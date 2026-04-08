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
        Schema::create('activity_participant', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            $table->foreignUuid('activity_id')->constrained('activities')->onDelete('cascade');
            $table->foreignUuid('employee_id')->constrained('employees')->onDelete('cascade');
            
            $table->enum('role', ['participant', 'assessor', 'scout', 'judge', 'coordinator', 'guest'])
                  ->default('participant');
                  
            $table->enum('status', ['invited', 'confirmed', 'attended', 'absent', 'cancelled'])
                  ->default('invited');

            $table->text('notes')->nullable();

            $table->timestamps();

            // Prevent duplicate entries
            $table->unique(['activity_id', 'employee_id']);

            $table->index(['activity_id', 'status']);
            $table->index(['employee_id', 'role']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_participant');
    }
};
