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
        Schema::create('script_allocations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('script_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('batch_id')->nullable()->constrained('script_batches')->cascadeOnDelete();
            $table->foreignId('assessor_id')->constrained('users');
            $table->enum('type', ['single', 'batch']);
            $table->timestamp('allocated_at')->useCurrent();
            $table->enum('status', ['pending', 'in_progress', 'completed'])->default('pending');
            $table->foreignUuid('created_by')->nullable()->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('script_allocations');
    }
};
