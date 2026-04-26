"use client";

import { Head, router } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { useState } from "react";

import { AssignPermissionsForm } from "@/components/roles/AsignPermissionsForm";
import { RoleForm } from "@/components/roles/RoleForm";
import RoleShowModal from "@/components/roles/RoleShowModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useConfirm } from "@/components/ui/confirm-provider";
import { DataTable } from "@/components/ui/data-table";
import { toast } from "@/components/ui/sonner";
import AppLayout from "@/layouts/app-layout";
import { dashboard } from '@/routes';
import rolesPermissions, {destroy} from "@/routes/roles-permissions";
import type { BreadcrumbItem } from "@/types";
import { columns } from "./columns";

interface Role {
  id: number;
  name: string;
  permissions: { id: number; name: string }[];
}

interface Permission {
  id: number;
  name: string;
}

interface PaginatedRoles {
  data: Role[];
  links: { url: string | null; label: string; active: boolean }[];
  total: number;
  per_page: number;
}

interface Props {
    roles: PaginatedRoles;
    permissions: Permission[];
    filters: {
        search?: string;
    };
}

const breadcrumbs = (): BreadcrumbItem[] => [
  { title: 'Dashboard', href: dashboard().url || "/" },
  { title: 'Roles & Permissions', href: rolesPermissions.index().url || "/roles-permissions" },
];

export default function Index({
  roles,
  permissions,
  filters,
}: Props) {

    const [modalOpen, setModalOpen] = useState(false);
    const [showModalOpen, setShowModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [permissionModalOpen, setPermissionModalOpen] = useState(false);
    const [editingPermissionsAssign, setEditingPermissionsAssign] = useState<Role | null>(null);

    const { confirm } = useConfirm();

    
  const openAddModal = () => {
    setEditingRole(null);
    setModalOpen(true);
  };

  const handleView = (role: Role) => {
    setSelectedRole(role);
    setShowModalOpen(true);
  };

  const openEditModal = (role: Role) => {
    setEditingRole(role);
    setModalOpen(true);
  };

  const openAssignPermissionsModal = (role: Role) => {
    setEditingPermissionsAssign(role);
    setPermissionModalOpen(true);
  };

  const handleDelete = (id: string) => {
    confirm({
      title: "Delete Role",
      description: "Are you sure you want to delete this role? This action cannot be undone.",
      onConfirm: async () => {
        const promise = new Promise((resolve, reject) => {
          router.delete(destroy(id), {
            preserveScroll: true,
            onSuccess: resolve,
            onError: reject,
          });
        });

        toast.promise(promise, {
          loading: "Deleting user...",
          success: "User deleted successfully ✅",
          error: "Failed to delete user ❌",
        });

        await promise;
      },
    });
  };

    return (
        <AppLayout breadcrumbs={breadcrumbs()}>
            <Head title="Roles & Permissions" />
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold tracking-tight">Roles & Permissions</h2>
                    <Button onClick={openAddModal}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Role
                    </Button>
                </div>

                <DataTable
                    columns={columns({
                    onView: handleView,
                    onEdit: openEditModal,
                    onAsignPermissions: openAssignPermissionsModal,
                    onDelete: handleDelete,
                    })}
                    data={roles.data}
                    links={roles.links} 
                    total={roles.total}
                    pageSize={roles.per_page}
                    currentRoute="/roles-permissions"
                    filters={filters}
                    searchPlaceholder="Search roles..."
                />

                <Card className="bg-muted px-4">
                    <h2 className="text-lg font-semibold mb-4">All Permissions</h2>

                    <div className="flex flex-wrap gap-2">
                    {permissions.map((perm) => (
                        <Badge key={perm.id} variant="outline">
                        {perm.name}
                        </Badge>
                    ))}
                    </div>
                </Card>
            </div>

            <RoleForm
                initialData={editingRole || undefined}
                open={modalOpen}
                onOpenChange={setModalOpen}
            />

            <AssignPermissionsForm
                initialData={editingPermissionsAssign || undefined}
                permissions={permissions}
                open={permissionModalOpen}
                onOpenChange={setPermissionModalOpen}
            />

            {selectedRole && (
                <RoleShowModal
                    open={showModalOpen}
                    onClose={() => {
                    setShowModalOpen(false);
                    setSelectedRole(null);
                    }}
                    role={selectedRole}
                />
            )}
        </AppLayout>
    );
}