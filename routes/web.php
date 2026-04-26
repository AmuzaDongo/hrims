<?php

use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\MarkingCenterController;
use App\Http\Controllers\PaperController;
use App\Http\Controllers\ScriptController;
use App\Http\Controllers\ScriptMovementController;
use App\Http\Controllers\AssessmentCategoryController;
use App\Http\Controllers\AssessmentSeriesController;
use App\Http\Controllers\SubDepartmentController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\EmployeeProfileController;
use App\Http\Controllers\ActivityParticipantController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('users', UserController::class);
    Route::resource('departments', DepartmentController::class);
    Route::resource('marking-centers', MarkingCenterController::class);
    Route::resource('papers', PaperController::class);
    Route::resource('assessment-series', AssessmentSeriesController::class);
    Route::resource('scripts', ScriptController::class);
    Route::resource('script-movements', ScriptMovementController::class);
    Route::resource('assessment-categories', AssessmentCategoryController::class);
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

    Route::resource('roles-permissions', RolePermissionController::class);

    Route::post(
        'roles-permissions/sync',
        [RolePermissionController::class, 'syncPermissions']
    )->name('roles-permissions.sync');

    Route::prefix('roles-permissions')->name('roles-permissions.')->group(function () {

        Route::post('/assign-permission', [RolePermissionController::class, 'assignPermissionToRole'])
            ->name('assign-permission');

        Route::delete('/revoke-permission', [RolePermissionController::class, 'revokePermissionFromRole'])
            ->name('revoke-permission');
    });
});

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__.'/settings.php';