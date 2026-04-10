<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\HR\MarkingCenter;

class RolePermissionController extends Controller
{
    /**
     * Show Role & Permission Management Page
     */
    public function index(): Response
    {
        $users = User::with('marking_centers')->get();
        $marking_centers = MarkingCenter::all();
        $roles = Role::all();
        $permissions = Permission::all();

        return Inertia::render('settings/RolePermission/Index', [
            'users' => $users,
            'marking_centers' => $marking_centers,
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Assign Role to User in a Specific Center
     */
    public function assignRole(Request $request)
    {
        $request->validate([
            'user_id'    => 'required|exists:users,id',
            'center_id'  => 'required|exists:centers,id',
            'role'       => 'required|string|max:100',
        ]);

        $user = User::findOrFail($request->user_id);
        $marking_center = MarkingCenter::findOrFail($request->center_id);

        // Prevent duplicate role in same center
        $exists = DB::table('center_user')
            ->where('user_id', $user->id)
            ->where('marking_center_id', $marking_center->id)
            ->where('role', $request->role)
            ->exists();

        if ($exists) {
            return back()->with('error', 'User already has this role in the center.');
        }

        DB::table('center_user')->insert([
            'user_id'    => $user->id,
            'center_id'  => $center->id,
            'role'       => $request->role,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('success', "Role '{$request->role}' assigned to user in {$center->name}.");
    }

    /**
     * Remove Role from User in a Center
     */
    public function removeRole(Request $request)
    {
        $request->validate([
            'user_id'   => 'required|exists:users,id',
            'center_id' => 'required|exists:centers,id',
            'role'      => 'required|string',
        ]);

        $deleted = DB::table('center_user')
            ->where('user_id', $request->user_id)
            ->where('center_id', $request->center_id)
            ->where('role', $request->role)
            ->delete();

        if ($deleted) {
            return back()->with('success', 'Role removed successfully.');
        }

        return back()->with('error', 'Role not found.');
    }

    /**
     * Assign Permission to a Role (Global)
     */
    public function assignPermissionToRole(Request $request)
    {
        $request->validate([
            'role_id'       => 'required|exists:roles,id',
            'permission_id' => 'required|exists:permissions,id',
        ]);

        $role = Role::findOrFail($request->role_id);
        $permission = Permission::findOrFail($request->permission_id);

        if ($role->hasPermissionTo($permission->name)) {
            return back()->with('error', 'Permission already assigned to this role.');
        }

        $role->givePermissionTo($permission->name);

        return back()->with('success', "Permission '{$permission->name}' assigned to role '{$role->name}'.");
    }

    /**
     * Revoke Permission from a Role
     */
    public function revokePermissionFromRole(Request $request)
    {
        $request->validate([
            'role_id'       => 'required|exists:roles,id',
            'permission_id' => 'required|exists:permissions,id',
        ]);

        $role = Role::findOrFail($request->role_id);
        $permission = Permission::findOrFail($request->permission_id);

        $role->revokePermissionTo($permission->name);

        return back()->with('success', "Permission revoked successfully.");
    }
}