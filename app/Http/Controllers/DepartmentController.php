<?php

namespace App\Http\Controllers;

use App\Http\Requests\HR\Department\StoreDepartmentRequest;
use App\Http\Requests\HR\Department\UpdateDepartmentRequest;
use App\Models\HR\Department;
use App\Models\HR\Employee;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Department::query()
            ->with([
                'parent:id,name',
                'head:id,first_name,last_name'
            ])
            ->when($request->search, function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
                });
            });

        $departments = $query
            ->orderBy('name')
            ->paginate($request->get('per_page', 10)) // ✅ dynamic pagination
            ->withQueryString()
            ->through(function ($dept) {
                return [
                    'id' => $dept->id,
                    'name' => $dept->name,
                    'code' => $dept->code,
                    'description' => $dept->description,
                    'is_active' => $dept->is_active,

                    'parent' => $dept->parent
                        ? [
                            'id' => $dept->parent->id,
                            'name' => $dept->parent->name,
                        ]
                        : null,

                    'head' => $dept->head
                        ? [
                            'id' => $dept->head->id,
                            'first_name' => $dept->head->first_name,
                            'last_name' => $dept->head->last_name,
                        ]
                        : null,
                ];
            });

        return Inertia::render('HR/Departments/Index', [
            'departments' => $departments,

            // dropdowns
            'parents' => Department::orderBy('name')
                ->get(['id', 'name']),

            'employees' => Employee::orderBy('first_name')
                ->get(['id', 'first_name', 'last_name']),

            // 🔥 SAME as employees controller
            'filters' => $request->only(['search', 'per_page']),
        ]);
    }

    public function store(StoreDepartmentRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $validated['parent_id'] = $validated['parent_id'] ?: null;
        $validated['head_id']   = $validated['head_id']   ?: null;

        Department::create($validated);

        return back()->with('success', 'Department created successfully.');
    }

    public function show(Department $department): Response
    {
        $department->load(['parent', 'head', 'children', 'employees']);

        return Inertia::render('HR/Departments/Show', [
            'department' => $department,
        ]);
    }

    public function edit(Department $department): Response
    {
        $parents = Department::where('id', '!=', $department->id)
            ->orderBy('name')
            ->get(['id', 'name']);

        $employees = Employee::orderBy('first_name')->get(['id', 'first_name', 'last_name']);

        return Inertia::render('HR/Departments/Index', [
            'department' => $department,
            'parents'    => $parents,
            'employees'  => $employees,
        ]);
    }

    public function update(UpdateDepartmentRequest $request, Department $department): RedirectResponse
    {
        $department->update($request->validated());

        return redirect()->route('departments.index')
            ->with('success', 'Department updated successfully.');
    }

    public function destroy(Department $department): RedirectResponse
    {
        $department->delete();

        return redirect()->route('departments.index')
            ->with('success', 'Department deleted successfully.');
    }
}