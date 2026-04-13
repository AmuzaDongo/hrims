<?php

namespace App\Http\Controllers;

use App\Http\Requests\Assessment\AssessmentSeries\StoreAssessmentSeriesRequest;
use App\Http\Requests\Assessment\AssessmentSeries\UpdateAssessmentSeriesRequest;
use App\Models\Assessment\AssessmentSeries;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class AssessmentSeriesController extends Controller
{
    public function index(Request $request): Response
    {
        $query = AssessmentSeries::query()
            ->when($request->search, function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                    ->orWhere('year', 'like', "%{$search}%");
                });
            })
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->when($request->type, fn($q, $type) => $q->where('type', $type));

        $assessmentSeries = $query
            ->orderBy('created_at', 'desc') 
            ->paginate($request->get('per_page', 10))
            ->withQueryString();

        return Inertia::render('Assessment/AssessmentSeries/Index', [
            'assessmentSeries' => $assessmentSeries,
            'filters' => $request->only(['search', 'status', 'type', 'per_page']),
        ]);
    }

    public function create(): Response
    {

        return Inertia::render('Assessment/AssessmentSeries/Create', [
            'assessmentSeries' => $assessmentSeries,
        ]);
    }

    public function store(StoreAssessmentSeriesRequest $request): RedirectResponse
    {
        $validated = $request->validated();
    
        $validated['created_by'] = auth()->id();
        $validated['updated_by'] = auth()->id();

        AssessmentSeries::create($validated);

        return redirect()->route('assessment-series.index')
            ->with('success', 'Assessment series created successfully.');
    }

    public function show(AssessmentSeries $assessmentSeries): Response
    {
        $assessmentSeries->load(['lead', 'createdBy', 'participants']);

        return Inertia::render('Assessment/AssessmentSeries/Show', [
            'assessmentSeries' => $assessmentSeries,
        ]);
    }

    public function edit(AssessmentSeries $assessmentSeries): Response
    {
        return Inertia::render('Assessment/AssessmentSeries/Edit', [
            'assessmentSeries' => $assessmentSeries,
        ]);
    }

    public function update(UpdateAssessmentSeriesRequest $request, AssessmentSeries $assessmentSeries): RedirectResponse
    {
        $validated = $request->validated();
        $validated['updated_by'] = auth()->id();

        $assessmentSeries->update($validated);

        return redirect()->route('assessment-series.index')
            ->with('success', 'Assessment series updated successfully.');
    }

    public function destroy(AssessmentSeries $assessmentSeries): RedirectResponse
    {
        $assessmentSeries->delete();

        return redirect()->route('assessment-series.index')
            ->with('success', 'Assessment series deleted successfully.');
    }
}