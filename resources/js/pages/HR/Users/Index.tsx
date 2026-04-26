"use client";

import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from "react";
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/ui/confirm-provider";
import { DataTable } from "@/components/ui/data-table";
import { UserForm } from '@/components/users/UsersForm';
import UserShowModal from '@/components/users/UsersShowModal';
import AppLayout from "@/layouts/app-layout";
import { dashboard } from '@/routes';
import users, {destroy} from '@/routes/users';
import type { BreadcrumbItem, User } from "@/types";
import { columns } from './columns';


interface PaginatedUsers {
  data: User[];
  links: { url: string | null; label: string; active: boolean }[];
  total: number;
  per_page: number;
}

interface Props {
  users: PaginatedUsers;
  roles: { id: string; name: string }[];
  filters?: Record<string, string | number | undefined>;
}

  
const breadcrumbs = (): BreadcrumbItem[] => [
  { title: 'Dashboard', href: dashboard().url || "/" },
  { title: 'Users', href: users.index().url || "/users" },
];

export default function ActivitiesIndex({ users, roles, filters }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [showModalOpen, setShowModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { confirm } = useConfirm();

  const formRoles = roles.map((role) => ({
    id: Number(role.id),
    role: { name: role.name },
  }));

  const openAddModal = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setShowModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    confirm({
      title: "Delete User",
      description: "Are you sure you want to delete this user? This action cannot be undone.",
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
      <Head title="Users" />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <Button onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        <DataTable
          columns={columns({
            onView: handleView,
            onEdit: openEditModal,
            onDelete: handleDelete,
          })}
          data={users.data}
          links={users.links} 
          total={users.total}
          pageSize={users.per_page}
          currentRoute="/users"
          filters={filters}
          searchPlaceholder="Search users..."
        />
      </div>

      {/* Add/Edit Form Modal */}
      <UserForm
        initialData={editingUser || undefined}
        roles={formRoles}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
  
      {/* View Details Modal */}
      {selectedUser && (
        <UserShowModal
          open={showModalOpen}
          onClose={() => {
            setShowModalOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
        />
      )}
    </AppLayout>
  );
}