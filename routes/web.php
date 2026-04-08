<?php

use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\SubDepartmentController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\EmployeeProfileController;
use App\Http\Controllers\ActivityParticipantController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('departments', DepartmentController::class);
    Route::resource('sub-departments', SubDepartmentController::class);
    Route::resource('positions', PositionController::class);
    Route::resource('employees', EmployeeController::class);
    Route::resource('activities', ActivityController::class);
    Route::prefix('activities/{activity}')->name('activities.')->group(function () {
        Route::get('participants', [ActivityParticipantController::class, 'index'])->name('participants.index');
        Route::post('participants', [ActivityParticipantController::class, 'store'])->name('participants.store');
        Route::put('participants/{employee}', [ActivityParticipantController::class, 'update'])->name('participants.update');
        Route::delete('participants/{employee}', [ActivityParticipantController::class, 'destroy'])->name('participants.destroy');
    });
    Route::prefix('employees/{employee}')->name('employees.')->group(function () {
        Route::resource('profiles', EmployeeProfileController::class)->only([
            'create', 'store', 'show', 'edit', 'update', 'destroy'
        ]);
    });
});

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__.'/settings.php';