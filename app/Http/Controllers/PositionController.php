<?php

namespace App\Http\Controllers;

use App\Http\Requests\HR\Position\StorePositionRequest;
use App\Http\Requests\HR\Position\UpdatePositionRequest;
use App\Models\HR\Department;
use App\Models\HR\Position;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class PositionController extends Controller
{
   
    public function index(Request $request): Response
    {
        $query = Position::query()
            ->with([
                'department:id,name',
            ])
            ->when($request->search, function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
                });
            });

        $positions = $query
            ->orderBy('title')
            ->paginate($request->get('per_page', 10)) // ✅ dynamic pagination
            ->withQueryString()
            ->through(function ($position) {
                return [
                    'id' => $position->id,
                    'title' => $position->title,
                    'code' => $position->code,
                    'description' => $position->description,
                    'is_active' => $position->is_active,
                    'department' => $position->department ? [
                        'id' => $position->department->id,
                        'name' => $position->department->name,
                    ] : null,
                ];
            });

        return Inertia::render('HR/Positions/Index', [
            'positions' => $positions,
            'departments' => Department::orderBy('name')
                ->get(['id', 'name']),
            'filters' => $request->only(['search', 'per_page']),
        ]);
    }

    public function create(): Response
    {
        $departments = Department::orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('HR/Positions/Create', [
            'departments' => $departments,
        ]);
    }

    public function store(StorePositionRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Position::create($validated);

        return redirect()->route('positions.index')
            ->with('success', 'Position created successfully.');
    }

    public function show(Position $position): Response
    {
        $position->load(['department', 'employees']);

        return Inertia::render('HR/Positions/Show', [
            'position' => $position,
        ]);
    }

    public function edit(Position $position): Response
    {
        $departments = Department::orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('HR/Positions/Edit', [
            'position'    => $position,
            'departments' => $departments,
        ]);
    }

    public function update(UpdatePositionRequest $request, Position $position): RedirectResponse
    {
        $position->update($request->validated());

        return redirect()->route('positions.index')
            ->with('success', 'Position updated successfully.');
    }

    public function destroy(Position $position): RedirectResponse
    {
        $position->delete();

        return redirect()->route('positions.index')
            ->with('success', 'Position deleted successfully.');
    }
}