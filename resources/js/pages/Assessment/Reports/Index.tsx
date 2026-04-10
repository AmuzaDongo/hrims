"use client";

import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from "react";
import { toast } from 'sonner';
import { DepartmentForm } from "@/components/departments/department-form";
import DepartmentShowModal from '@/components/departments/DepartmentShowModal';
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/ui/confirm-provider";
import { DataTable } from "@/components/ui/data-table";
import AppLayout from "@/layouts/app-layout";
import { destroy } from '@/wayfinder/routes/departments';
import { columns } from './columns';

interface Department {
  id: string;
  name: string;
  code: string; // keep null here
  description: string | null;
  parent?: { id: string; name: string };
  head?: { id: string; first_name: string; last_name: string };
  is_active: boolean;
}

interface PaginatedDepartments {
  data: Department[];
  links: { url: string | null; label: string; active: boolean }[];
  total: number;
  per_page: number;
}

interface Props {
  departments: PaginatedDepartments;
  parents: { id: string; name: string }[];
  employees: { id: string; first_name: string; last_name: string }[];
  filters?: { 
    search?: string;
    per_page?: number; 
    [key: string]: string | number | undefined;
  };
}

export default function DepartmentsIndex({ departments, parents, employees, filters }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [showModalOpen, setShowModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const { confirm } = useConfirm();

  const openAddModal = () => {
    setEditingDept(null);
    setModalOpen(true);
  };

  const handleView = (department: Department) => {
    setSelectedDepartment(department);
    setShowModalOpen(true);
  };

  const openEditModal = (dept: Department) => {
    setEditingDept(dept);
    setModalOpen(true);
  };

  const handleDelete = (deleteId: string) => {
    confirm({
      title: "Delete Department",
      description: "This action cannot be undone.",
      onConfirm: async () => {
        const promise = new Promise((resolve, reject) => {
          router.delete(destroy(deleteId), {
            onSuccess: resolve,
            onError: reject,
          });
        });

        toast.promise(promise, {
          loading: "Deleting department...",
          success: "Department deleted successfully ✅",
          error: "Failed to delete department ❌",
        });

        await promise;
      },
    });
  };


  return (
    <AppLayout>
      <Head title="Departments" />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Departments</h1>
          <Button onClick={openAddModal}>
            <Plus className="mr-1 h-4 w-4" /> Add Department
          </Button>
        </div>

        <DataTable
          columns={columns({
            onView: handleView,
            onEdit: openEditModal,
            onDelete: handleDelete,
          })}
          data={departments.data}
          links={departments.links}
          total={departments.total}
          pageSize={departments.per_page || 10}
          currentRoute="/departments"
          filters={filters}
        />
      </div>

      {/* Dynamic Form Modal */}
      <DepartmentForm
        initialData={editingDept || undefined}
        parents={parents}
        employees={employees}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      <DepartmentShowModal
        open={showModalOpen}
        onClose={() => setShowModalOpen(false)}
        department={selectedDepartment}
      />
    </AppLayout>
  );
}