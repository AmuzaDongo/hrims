<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeProfile\StoreEmployeeProfileRequest;
use App\Http\Requests\EmployeeProfile\UpdateEmployeeProfileRequest;
use App\Models\Employee;
use App\Models\EmployeeProfile;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeProfileController extends Controller
{
    public function create(Employee $employee): Response|RedirectResponse
    {
        if ($employee->profile) {
            return redirect()->route('employees.profiles.edit', [$employee, $employee->profile]);
        }

        return Inertia::render('HR/Employees/Profiles/Create', [
            'employee' => $employee,
        ]);
    }

    public function store(Employee $employee, StoreEmployeeProfileRequest $request): RedirectResponse
    {
        if ($employee->profile) {
            return redirect()->route('employees.profiles.edit', [$employee, $employee->profile])
                ->with('error', 'Profile already exists.');
        }

        $validated = $request->validated();
        $validated['employee_id'] = $employee->id;

        EmployeeProfile::create($validated);

        return redirect()->route('employees.show', $employee)
            ->with('success', 'Employee profile created successfully.');
    }

    public function show(Employee $employee, EmployeeProfile $profile): Response
    {
        if ($profile->employee_id !== $employee->id) {
            abort(404);
        }

        return Inertia::render('HR/Employees/Profiles/Show', [
            'employee' => $employee->load('department', 'position'),
            'profile'  => $profile,
        ]);
    }

    public function edit(Employee $employee, EmployeeProfile $profile): Response
    {
        if ($profile->employee_id !== $employee->id) {
            abort(404);
        }

        return Inertia::render('HR/Employees/Profiles/Edit', [
            'employee' => $employee,
            'profile'  => $profile,
        ]);
    }

    public function update(Employee $employee, EmployeeProfile $profile, UpdateEmployeeProfileRequest $request): RedirectResponse
    {
        if ($profile->employee_id !== $employee->id) {
            abort(404);
        }

        $profile->update($request->validated());

        return redirect()->route('employees.show', $employee)
            ->with('success', 'Employee profile updated successfully.');
    }

    public function destroy(Employee $employee, EmployeeProfile $profile): RedirectResponse
    {
        if ($profile->employee_id !== $employee->id) {
            abort(404);
        }

        $profile->delete();

        return redirect()->route('employees.show', $employee)
            ->with('success', 'Employee profile deleted successfully.');
    }
}