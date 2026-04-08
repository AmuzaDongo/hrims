<?php

namespace App\Http\Controllers;

use App\Http\Requests\HR\Activity\StoreActivityRequest;
use App\Http\Requests\HR\Activity\UpdateActivityRequest;
use App\Models\HR\Activity;
use App\Models\HR\Employee;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Activity::query()
            ->with([
                'lead:id,first_name,last_name',
                'createdBy:id,name'
            ])
            ->when($request->search, function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('venue', 'like', "%{$search}%");
                });
            })
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->when($request->type, fn($q, $type) => $q->where('type', $type));

        $activities = $query
            ->orderBy('start_date', 'desc') 
            ->paginate($request->get('per_page', 15))
            ->withQueryString();

        return Inertia::render('HR/Activities/Index', [
            'activities' => $activities,

            'employees' => Employee::orderBy('first_name')
                ->get(['id', 'first_name', 'last_name']),

            'filters' => $request->only(['search', 'status', 'type', 'per_page']),
        ]);
    }

    public function create(): Response
    {
        $employees = Employee::orderBy('first_name')
            ->get(['id', 'first_name', 'last_name']);

        return Inertia::render('HR/Activities/Create', [
            'employees' => $employees,
        ]);
    }

    public function store(StoreActivityRequest $request): RedirectResponse
    {
        $validated = $request->validated();
    
        $validated['created_by'] = auth()->id();
        $validated['updated_by'] = auth()->id();

        Activity::create($validated);

        return redirect()->route('activities.index')
            ->with('success', 'Activity created successfully.');
    }

    public function show(Activity $activity): Response
    {
        $activity->load(['lead', 'createdBy', 'participants']);

        return Inertia::render('HR/Activities/Show', [
            'activity' => $activity,
        ]);
    }

    public function edit(Activity $activity): Response
    {
        $employees = Employee::orderBy('first_name')
            ->get(['id', 'first_name', 'last_name']);

        return Inertia::render('HR/Activities/Edit', [
            'activity'  => $activity,
            'employees' => $employees,
        ]);
    }

    public function update(UpdateActivityRequest $request, Activity $activity): RedirectResponse
    {
        $validated = $request->validated();
        $validated['updated_by'] = auth()->id();

        $activity->update($validated);

        return redirect()->route('activities.index')
            ->with('success', 'Activity updated successfully.');
    }

    public function destroy(Activity $activity): RedirectResponse
    {
        $activity->delete();

        return redirect()->route('activities.index')
            ->with('success', 'Activity deleted successfully.');
    }
}