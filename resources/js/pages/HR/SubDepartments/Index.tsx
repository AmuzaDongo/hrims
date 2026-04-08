import { Head, router } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { SubDepartmentForm } from "@/components/departments/sub-department-form";
import SubDepartmentShowModal from "@/components/departments/SubDepartmentShowModal";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/ui/confirm-provider";
import { DataTable } from "@/components/ui/data-table";
import { toast } from "@/components/ui/sonner";
import AppLayout from "@/layouts/app-layout";
import { destroy } from "@/wayfinder/routes/sub-departments";
import { columns } from "./columns";

interface SubDepartment {
  id: string;
  name: string;
  code: string | null;
  department: {
    id: string;
    name: string;
  };
}

interface PaginatedSubDepartments {
  data: SubDepartment[];
  links: { url: string | null; label: string; active: boolean }[];
  total: number;
  per_page: number;
}

interface Props {
  subDepartments: PaginatedSubDepartments;
  departments: { id: string; name: string }[];
  filters?: { 
    search?: string;
    per_page?: number; 
    [key: string]: string | number | undefined;
  };
}

export default function SubDepartmentsIndex({ subDepartments, departments, filters }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SubDepartment | null>(null);
  const [showModalOpen, setShowModalOpen] = useState(false);
  const [selectedSubDepartment, setSelectedSubDepartment] = useState<SubDepartment | null>(null);
  const { confirm } = useConfirm();

  const formInitialData = editingItem
  ? {
      id: editingItem.id,
      name: editingItem.name,
      code: editingItem.code || "",
      department_id: editingItem.department?.id || "",
    }
  : undefined;

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // const openAddModal = () => {
  //   setEditingDept(null);
  //   setModalOpen(true);
  // };

  const handleView = (subDepartment: SubDepartment) => {
    setSelectedSubDepartment(subDepartment);
    setShowModalOpen(true);
  };

  const openEditModal = (subDepartment: SubDepartment) => {
    setEditingItem(subDepartment);
    setIsModalOpen(true);
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
      <Head title="Sub-Departments" />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Sub-Departments</h1>

          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Sub-Department
          </Button>
        </div>

        <DataTable
          columns={columns({
            onView: handleView,
            onEdit: openEditModal,
            onDelete: handleDelete,
          })}
          data={subDepartments.data}
          searchPlaceholder="Search sub-departments..."
          links={subDepartments.links}
          total={subDepartments.total}
          pageSize={subDepartments.per_page || 10}
          enableExport={true}
          enableColumnVisibility={true}
          currentRoute="/sub-departments"
          filters={filters}
        />
      </div>

      <SubDepartmentForm
        open={isModalOpen}
        onOpenChange={handleModalClose}
        departments={departments}
        initialData={formInitialData}
      />

      <SubDepartmentShowModal
        open={showModalOpen}
        onClose={() => setShowModalOpen(false)}
        subDepartment={selectedSubDepartment}
      />
    </AppLayout>
  );
}