<?php

namespace App\Http\Controllers;

use App\Http\Requests\Settings\RolesPermissions\StoreRoleRequest;
use App\Http\Requests\Settings\RolesPermissions\UpdateRoleRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionController extends Controller
{

    public function index(Request $request): Response
    {
        $query = Role::query()
            ->with(['permissions:id,name'])
            ->when($request->search, function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                    ->orWhere('permissions.name', 'like', "%{$search}%");
                });
            })
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->when($request->type, fn($q, $type) => $q->where('type', $type));

        $roles = $query
            ->orderBy('created_at', 'desc') 
            ->paginate($request->get('per_page', 10))
            ->withQueryString();
        $permissions = Permission::select('id', 'name')->get();
        return Inertia::render('settings/RolePermission/Index', [
            'roles' => $roles,
            'permissions' => $permissions,
            'filters' => $request->only(['search', 'status', 'type', 'per_page']),
        ]);
    }

    public function store(StoreRoleRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Role::create($validated);

        return redirect()->route('roles-permissions.index')
            ->with('success', 'Role created successfully.');
    }

    public function show(Role $role): Response
    {
         $role->load(['permissions', 'users']);

        return Inertia::render('HR/Roles/Show', [
            'role' => $role,
        ]);
    }
    
    public function update(UpdateRoleRequest $request, $id): RedirectResponse
    {
        $role = Role::findOrFail($id);

        $role->update($request->validated());

        return redirect()->route('roles-permissions.index')
            ->with('success', 'Role updated successfully.');
    }
    
    public function destroy(Role $role): RedirectResponse
    {
        $role->delete();

        return redirect()->route('roles-permissions.index')
            ->with('success', 'Role deleted successfully.');
    }

    /**
     * Assign Role to User
     */
    public function assignRole(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role'    => 'required|string|exists:roles,name',
        ]);

        $user = User::findOrFail($request->user_id);

        if ($user->hasRole($request->role)) {
            return back()->with('error', 'User already has this role.');
        }

        $user->assignRole($request->role);

        return back()->with('success', "Role '{$request->role}' assigned successfully.");
    }

    /**
     * Remove Role from User
     */
    public function removeRole(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role'    => 'required|string|exists:roles,name',
        ]);

        $user = User::findOrFail($request->user_id);

        if (!$user->hasRole($request->role)) {
            return back()->with('error', 'User does not have this role.');
        }

        $user->removeRole($request->role);

        return back()->with('success', 'Role removed successfully.');
    }

    /**
     * Assign Permission to Role
     */
    // public function assignPermissionToRole(Request $request)
    // {
    //     $request->validate([
    //         'role_id'       => 'required|exists:roles,id',
    //         'permission_id' => 'required|exists:permissions,id',
    //     ]);

    //     $role = Role::findOrFail($request->role_id);
    //     $permission = Permission::findOrFail($request->permission_id);

    //     if ($role->hasPermissionTo($permission->name)) {
    //         return back()->with('error', 'Permission already assigned.');
    //     }

    //     $role->givePermissionTo($permission->name);

    //     return back()->with('success', 'Permission assigned successfully.');
    // }

    public function assignPermissionToRole(Request $request)
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id',
            'permission_id' => 'nullable|exists:permissions,id',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role = Role::findOrFail($request->role_id);

        // CASE 1: single permission
        if ($request->permission_id) {
            $permission = Permission::findOrFail($request->permission_id);

            if ($role->hasPermissionTo($permission->name)) {
                return back()->with('error', 'Permission already assigned.');
            }

            $role->givePermissionTo($permission->name);
        }

        // CASE 2: bulk permissions
        if ($request->permissions) {
            $permissions = Permission::whereIn('id', $request->permissions)->pluck('name');

            $role->givePermissionTo($permissions);
        }

        return back()->with('success', 'Permission(s) assigned successfully.');
    }

    public function syncPermissions(Request $request)
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role = Role::findOrFail($request->role_id);

        // Sync replaces all permissions cleanly
        $role->syncPermissions($request->permissions ?? []);

        return back()->with('success', 'Permissions updated successfully');
    }

    /**
     * Revoke Permission from Role
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

        return back()->with('success', 'Permission revoked successfully.');
    }
}