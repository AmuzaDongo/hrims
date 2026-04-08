<?php

namespace App\Http\Controllers;

use App\Http\Requests\HR\Employee\StoreEmployeeRequest;
use App\Http\Requests\HR\Employee\UpdateEmployeeRequest;
use App\Models\HR\Department;
use App\Models\HR\Employee;
use App\Models\HR\Position;
use App\Models\HR\SubDepartment;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::query()
            ->with(['department', 'subDepartment', 'position'])
            ->when($request->search, function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('employee_number', 'like', "%{$search}%");
                });
            });

        $employees = $query
            ->latest()
            ->paginate($request->get('per_page', 10)) // 🔥 dynamic pagination
            ->withQueryString();

        return Inertia::render('HR/Employees/Index', [
            'employees' => $employees,
            'filters' => $request->only(['search', 'per_page']),
        ]);
    }

    public function create(): Response
    {
        $departments    = Department::orderBy('name')->get(['id', 'name']);
        $subDepartments = SubDepartment::orderBy('name')->get(['id', 'name', 'department_id']);
        $positions      = Position::orderBy('title')->get(['id', 'title', 'department_id']);

        return Inertia::render('HR/Employees/Create', [
            'departments'     => $departments,
            'subDepartments'  => $subDepartments,
            'positions'       => $positions,
        ]);
    }

    /**
     * Store a newly created employee in storage.
     */
    public function store(StoreEmployeeRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        // Handle nullable fields
        $validated['sub_department_id'] = $validated['sub_department_id'] ?: null;
        $validated['position_id']       = $validated['position_id']       ?: null;

        Employee::create($validated);

        return redirect()->route('employees.index')
            ->with('success', 'Employee created successfully.');
    }

    /**
     * Display the specified employee.
     */
    public function show(Employee $employee): Response
    {
        $employee->load([
            'department',
            'subDepartment',
            'position',
            'user',
        ]);

        return Inertia::render('HR/Employees/Show', [
            'employee' => $employee,
        ]);
    }

    public function edit(Employee $employee): Response
    {
        $departments    = Department::orderBy('name')->get(['id', 'name']);
        $subDepartments = SubDepartment::orderBy('name')->get(['id', 'name', 'department_id']);
        $positions      = Position::orderBy('title')->get(['id', 'title', 'department_id']);

        return Inertia::render('HR/Employees/Edit', [
            'employee'       => $employee,
            'departments'    => $departments,
            'subDepartments' => $subDepartments,
            'positions'      => $positions,
        ]);
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee): RedirectResponse
    {
        $validated = $request->validated();

        // Merge validated data with old values if keys are missing
        $employee->update([
            'employee_number'    => $validated['employee_number'] ?? $employee->employee_number,
            'first_name'         => $validated['first_name'] ?? $employee->first_name,
            'middle_name'        => $validated['middle_name'] ?? $employee->middle_name,
            'last_name'          => $validated['last_name'] ?? $employee->last_name,
            'date_of_birth'      => $validated['date_of_birth'] ?? $employee->date_of_birth,
            'hire_date'          => $validated['hire_date'] ?? $employee->hire_date,
            'probation_end_date' => $validated['probation_end_date'] ?? $employee->probation_end_date,
            'termination_date'   => $validated['termination_date'] ?? $employee->termination_date,
            'employment_type'    => $validated['employment_type'] ?? $employee->employment_type,
            'status'             => $validated['status'] ?? $employee->status,
            'sub_department_id'  => $request->input('sub_department_id', $employee->sub_department_id),
            'position_id'        => $request->input('position_id', $employee->position_id),
        ]);

        return redirect()->route('employees.index')
            ->with('success', 'Employee updated successfully.');
    }

    /**
     * Remove the specified employee.
     */
    public function destroy(Employee $employee): RedirectResponse
    {
        $employee->delete();

        return redirect()->route('employees.index')
            ->with('success', 'Employee deleted successfully.');
    }
}