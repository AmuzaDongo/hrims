import { usePage } from '@inertiajs/react';

export function usePermissions() {
    const { permissions, roles } = usePage().props as any;

    const hasPermission = (permission: string): boolean => {
        return permissions?.includes(permission) || false;
    };

    const hasAnyPermission = (perms: string[]): boolean => {
        return perms.some(perm => hasPermission(perm));
    };

    const hasRole = (role: string): boolean => {
        return roles?.includes(role) || false;
    };

    const hasAnyRole = (roleList: string[]): boolean => {
        return roleList.some(r => hasRole(r));
    };

    return {
        hasPermission,
        hasAnyPermission,
        hasRole,
        hasAnyRole,
        permissions,
        roles,
    };
}