<?php

namespace App\Http\Controllers;

use App\Http\Requests\HR\SubDepartment\StoreSubDepartmentRequest;
use App\Http\Requests\HR\SubDepartment\UpdateSubDepartmentRequest;
use App\Models\HR\Department;
use App\Models\HR\SubDepartment;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SubDepartmentController extends Controller
{
    public function index(): Response
    {
        $subDepartments = SubDepartment::with('department')
            ->orderBy('id', 'desc')
            ->paginate(10) // ✅ FIX
            ->withQueryString();

        $departments = Department::orderBy('name')->get(['id', 'name']);

        return Inertia::render('HR/SubDepartments/Index', [
            'subDepartments' => $subDepartments,
            'departments'    => $departments,
        ]);
    }

    public function create(): Response
    {
        $departments = Department::orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('HR/SubDepartments/Create', [
            'departments' => $departments,
        ]);
    }

    public function store(StoreSubDepartmentRequest $request): RedirectResponse
    {
        SubDepartment::create($request->validated());

        return redirect()->route('sub-departments.index')
            ->with('success', 'Sub-department created successfully.');
    }

    public function show(SubDepartment $subDepartment): Response
    {
        $subDepartment->load(['department', 'employees']);

        return Inertia::render('HR/SubDepartments/Show', [
            'subDepartment' => $subDepartment,
        ]);
    }

    public function edit(SubDepartment $subDepartment): Response
    {
        $departments = Department::orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('HR/SubDepartments/Edit', [
            'subDepartment' => $subDepartment,
            'departments'   => $departments,
        ]);
    }

    public function update(UpdateSubDepartmentRequest $request, SubDepartment $subDepartment): RedirectResponse
    {
        $subDepartment->update($request->validated());

        return redirect()->route('sub-departments.index')
            ->with('success', 'Sub-department updated successfully.');
    }

    public function destroy(SubDepartment $subDepartment): RedirectResponse
    {
        $subDepartment->delete();

        return redirect()->route('sub-departments.index')
            ->with('success', 'Sub-department deleted successfully.');
    }
}