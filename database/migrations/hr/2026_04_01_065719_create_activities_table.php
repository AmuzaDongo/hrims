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
        Schema::create('activities', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            $table->string('title');
            $table->text('description')->nullable();
            
            $table->dateTime('start_date');
            $table->dateTime('end_date')->nullable();           // null = ongoing
            
            $table->enum('status', ['draft', 'upcoming', 'ongoing', 'completed', 'cancelled'])
                  ->default('draft');
                  
            $table->enum('type', ['assessment', 'award_ceremony', 'training', 'meeting', 'event', 'other'])
                  ->default('assessment');

            $table->string('venue')->nullable();
            $table->text('address')->nullable();

            $table->decimal('budget', 12, 2)->nullable();
            $table->decimal('actual_cost', 12, 2)->nullable();

            $table->foreignUuid('lead_id')->nullable()->constrained('employees');
            $table->foreignUuid('created_by')->constrained('users');
            $table->foreignUuid('updated_by')->nullable()->constrained('users');

            $table->jsonb('metadata')->nullable();   // flexible extra data

            $table->timestamps();
            $table->softDeletes();

            $table->index(['start_date', 'end_date']);
            $table->index('status');
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
