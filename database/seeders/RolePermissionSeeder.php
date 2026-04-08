<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // ==================== PERMISSIONS ====================
        $permissions = [
            // HR Module
            'employees.view', 'employees.create', 'employees.edit', 'employees.delete',
            'departments.view', 'departments.create', 'departments.edit', 'departments.delete',
            'positions.view', 'positions.create', 'positions.edit', 'positions.delete',
            'activities.view', 'activities.create', 'activities.edit', 'activities.delete',

            // Assessment Module
            'scripts.view', 'scripts.mark', 'scripts.review', 'scripts.approve', 'scripts.recheck',
            'assessments.view', 'assessments.create', 'assessments.edit', 'assessments.delete',

            // Assets & Inventory
            'assets.view', 'assets.create', 'assets.edit', 'assets.delete', 'assets.assign',
            'inventory.view', 'inventory.create', 'inventory.edit', 'inventory.delete',

            // Marking Centers
            'marking_centers.view', 'marking_centers.create', 'marking_centers.edit', 'marking_centers.delete',
            'marking_centers.manage_staff',

            // General
            'reports.view', 'reports.generate',
            'audit_logs.view',
            'settings.view', 'settings.edit',
            'notifications.send',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // ==================== ROLES ====================
        $roles = [
            'super.admin',
            'system.admin',
            'hr.manager',
            'hr.officer',
            'assessment.chief_assessor',
            'assessment.assessor',
            'assessment.supervisor',
            'marking_center.admin',
            'marking_center.deputy_admin',
            'assets.manager',
            'assets.officer',
            'inventory.manager',
            'inventory.officer',
        ];

        foreach ($roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName]);
        }

        // Assign some basic permissions to key roles
        $superAdmin = Role::findByName('super.admin');
        $superAdmin->givePermissionTo(Permission::all());

        $hrManager = Role::findByName('hr.manager');
        $hrManager->givePermissionTo([
            'employees.view', 'employees.create', 'employees.edit', 'employees.delete',
            'departments.view', 'departments.create', 'departments.edit',
            'positions.view', 'positions.create', 'positions.edit',
            'reports.view', 'reports.generate',
        ]);

        $assessmentChief = Role::findByName('assessment.chief_assessor');
        $assessmentChief->givePermissionTo([
            'scripts.view', 'scripts.mark', 'scripts.review', 'scripts.approve', 'scripts.recheck',
            'assessments.view', 'assessments.create', 'assessments.edit',
        ]);
    }
}