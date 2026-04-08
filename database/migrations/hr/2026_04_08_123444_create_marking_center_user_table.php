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
        Schema::create('marking_center_user', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('marking_center_id')->constrained('marking_centers')->onDelete('cascade');
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->string('role');
            $table->timestamps();

            $table->unique(['marking_center_id', 'user_id', 'role']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('marking_center_user');
    }
};
