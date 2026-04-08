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
        Schema::create('employee_profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('employee_id')
                  ->unique()
                  ->constrained('employees')
                  ->onDelete('cascade');

            $table->string('national_id')->unique()->nullable();
            $table->string('passport_number')->unique()->nullable();
            $table->string('tin_number')->unique()->nullable();  
            $table->string('nssf_number')->unique()->nullable();
            $table->string('nhis_number')->unique()->nullable();

            $table->enum('gender', ['male', 'female', 'other', 'prefer_not_to_say'])->nullable();
            $table->enum('marital_status', ['single', 'married', 'divorced', 'widowed', 'separated'])->nullable();
            $table->string('religion')->nullable();
            $table->string('blood_group')->nullable(); 
            $table->string('disability_status')->nullable();
            $table->text('disability_description')->nullable();

            $table->text('residential_address')->nullable();
            $table->string('city')->nullable();
            $table->string('district')->nullable();
            $table->string('country')->default('Uganda');

            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->string('emergency_contact_relationship')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index('employee_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_profiles');
    }
};
