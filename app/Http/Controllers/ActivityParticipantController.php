<?php

namespace App\Http\Controllers;

use App\Models\HR\Activity;
use App\Models\HR\Employee;
use App\Models\HR\ActivityParticipant;
use App\Enums\ParticipantStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityParticipantController extends Controller
{
    public function index(Activity $activity, Request $request): Response
    {
        $activity->load(['lead:id,first_name,last_name']);

        $participants = ActivityParticipant::with('employee:id,first_name,last_name')
            ->where('activity_id', $activity->id)
            ->paginate($request->get('per_page', 10))
            ->withQueryString();

        $availableEmployees = Employee::whereNotIn('id', 
                $activity->participants()->pluck('employee_id')
            )
            ->orderBy('first_name')
            ->get(['id', 'first_name', 'last_name']);

        $allParticipants = $activity->participants()->get();

        $stats = ActivityParticipant::where('activity_id', $activity->id)
            ->selectRaw("
                count(*) as total,
                sum(status = 'invited') as invited,
                sum(status = 'confirmed') as confirmed,
                sum(status = 'attended') as attended,
                sum(status = 'cancelled') as cancelled
            ")
            ->first();

        return Inertia::render('HR/Activities/Participants/Index', [
            'activity'           => $activity,
            'participants'       => $participants, 
            'employees' => $availableEmployees,
            'stats'              => $stats,
        ]);
    }

    public function store(Activity $activity, Request $request)
    {
        $request->validate([
            'employee_ids' => 'required|array|min:1',
            'employee_ids.*' => 'exists:employees,id|unique:activity_participant,employee_id,NULL,id,activity_id,' . $activity->id,
            'role' => 'required|in:participant,assessor,scout,judge,coordinator,guest',
        ]);

        foreach ($request->employee_ids as $employeeId) {
            $activity->participants()->attach($employeeId, [
                'role' => $request->role,
                'status' => ParticipantStatus::CONFIRMED,
            ]);
        }

        return back()->with('success', 'Participants added successfully.');
    }

    public function update(Activity $activity, Employee $employee, Request $request)
    {
        $request->validate([
            'role' => 'required|in:participant,assessor,scout,judge,coordinator,guest',
            'status' => 'required|string',
            'notes' => 'nullable|string|max:255',
        ]);

        $activity->participants()->updateExistingPivot($employee->id, [
            'role' => $request->role,
            'status' => $request->status,
            'notes' => $request->notes,
        ]);

        return back()->with('success', 'Participant updated successfully.');
    }


    public function destroy(ActivityParticipant $participant)
    {
        $participant->delete();

        return back()->with('success', 'Participant removed successfully.');
    }
}