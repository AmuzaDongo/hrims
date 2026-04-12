<?php

namespace App\Http\Controllers;

use App\Http\Requests\Assessment\Paper\StoreScriptRequest;
use App\Http\Requests\Assessment\Paper\UpdateScriptRequest;
use App\Models\Assessment\Script;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class ScriptController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Script::query()
            ->with(['paper:id,name'])
            ->when($request->search, function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->where('center_origin', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%")
                    ->orWhere('current_location', 'like', "%{$search}%");
                });
            })
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->when($request->type, fn($q, $type) => $q->where('type', $type));

        $papers = $query
            ->orderBy('created_at', 'desc') 
            ->paginate($request->get('per_page', 15))
            ->withQueryString();

        return Inertia::render('Assessment/Scripts/Index', [
            'scripts' => $papers,
            'filters' => $request->only(['search', 'status', 'type', 'per_page']),
        ]);
    }

    public function create(): Response
    {

        return Inertia::render('Assessment/Scripts/Create', [
            'scripts' => $papers,
        ]);
    }

    public function store(StoreScriptRequest $request): RedirectResponse
    {
        $validated = $request->validated();
    
        $validated['created_by'] = auth()->id();
        $validated['updated_by'] = auth()->id();

        Script::create($validated);

        return redirect()->route('scripts.index')
            ->with('success', 'Script created successfully.');
    }

    public function show(Script $script): Response
    {
        $script->load(['paper:id,name']);

        return Inertia::render('Assessment/Scripts/Show', [
            'script' => $script,
        ]);
    }

    public function edit(Script $script): Response
    {
        return Inertia::render('Assessment/Scripts/Edit', [
            'script'  => $script->load(['paper:id,name']),
        ]);
    }

    public function update(UpdateScriptRequest $request, Script $script): RedirectResponse
    {
        $validated = $request->validated();
        $validated['updated_by'] = auth()->id();

        $script->update($validated);

        return redirect()->route('scripts.index')
            ->with('success', 'Script updated successfully.');
    }

    public function destroy(Script $script): RedirectResponse
    {
        $script->delete();

        return redirect()->route('scripts.index')
            ->with('success', 'Script deleted successfully.');
    }
}