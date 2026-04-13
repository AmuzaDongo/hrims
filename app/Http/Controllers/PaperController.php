<?php

namespace App\Http\Controllers;

use App\Http\Requests\Assessment\Paper\StorePaperRequest;
use App\Http\Requests\Assessment\Paper\UpdatePaperRequest;
use App\Models\Assessment\Paper;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class PaperController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Paper::query()
            ->when($request->search, function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
                });
            })
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->when($request->type, fn($q, $type) => $q->where('type', $type));

        $papers = $query
            ->orderBy('created_at', 'desc') 
            ->paginate($request->get('per_page', 10))
            ->withQueryString();

        return Inertia::render('Assessment/Papers/Index', [
            'papers' => $papers,
            'filters' => $request->only(['search', 'status', 'type', 'per_page']),
        ]);
    }

    public function create(): Response
    {

        return Inertia::render('Assessment/Papers/Create', [
            'papers' => $papers,
        ]);
    }

    public function store(StorePaperRequest $request): RedirectResponse
    {
        $validated = $request->validated();
    
        $validated['created_by'] = auth()->id();
        $validated['updated_by'] = auth()->id();

        Paper::create($validated);

        return redirect()->route('papers.index')
            ->with('success', 'Paper created successfully.');
    }

    public function show(Paper $paper): Response
    {
        $paper->load(['lead', 'createdBy', 'participants']);

        return Inertia::render('Assessment/Papers/Show', [
            'paper' => $paper,
        ]);
    }

    public function edit(Paper $paper): Response
    {
        return Inertia::render('Assessment/Papers/Edit', [
            'paper'  => $paper,
        ]);
    }

    public function update(UpdatePaperRequest $request, Paper $paper): RedirectResponse
    {
        $validated = $request->validated();
        $validated['updated_by'] = auth()->id();

        $paper->update($validated);

        return redirect()->route('papers.index')
            ->with('success', 'Paper updated successfully.');
    }

    public function destroy(Paper $paper): RedirectResponse
    {
        $paper->delete();

        return redirect()->route('papers.index')
            ->with('success', 'Paper deleted successfully.');
    }
}