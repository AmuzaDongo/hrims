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
        Schema::create('script_movements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->enum('type', ['single', 'batch']);
            $table->foreignId('script_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('batch_id')->nullable()->constrained('script_batches')->cascadeOnDelete();
            $table->string('from_location')->nullable();
            $table->string('to_location');
            $table->string('action');
            $table->enum('status', ['pending', 'in_progress', 'completed'])->default('pending');
            $table->foreignUuid('handled_by')->constrained()->cascadeOnDelete();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('script_movements');
    }
};
