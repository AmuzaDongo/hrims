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
        Schema::create('marking_centers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('code')->unique();
            $table->string('type')->default('marking'); // marking, assessment, admin, etc.
            $table->string('region')->nullable();
            $table->string('district')->nullable();
            $table->text('address')->nullable();
            $table->boolean('is_active')->default(true);
            $table->enum('status', ['open', 'closed', 'postponed', 'cancelled'])
                  ->default('open');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('marking_centers');
    }
};
