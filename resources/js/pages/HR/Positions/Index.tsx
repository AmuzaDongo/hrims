"use client";

import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from "react";
import { toast } from 'sonner';
import { PositionForm } from '@/components/positions/position-form';
import PositionShowModal from '@/components/positions/PositionShowModal';
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/ui/confirm-provider";
import { DataTable } from "@/components/ui/data-table";
import AppLayout from "@/layouts/app-layout";
import { destroy } from '@/wayfinder/routes/positions';
import { columns } from './columns';

interface Position {
  id: string;
  title: string;
  code: string | null;
  description: string | null;
  base_salary: number | null;
  is_active: boolean;
  department: {
    id: string;
    name: string;
  };
}

interface PaginatedPositions {
  data: Position[];
  links: { url: string | null; label: string; active: boolean }[];
  total: number;
  per_page: number;
}

interface Props {
  positions: PaginatedPositions;
  departments: { id: string; name: string }[];
  filters?: { 
    search?: string;
    per_page?: number; 
    [key: string]: string | number | undefined;
  };
}

export default function PositionsIndex({ positions, departments, filters }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [showModalOpen, setShowModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const { confirm } = useConfirm();

  const openAddModal = () => {
    setEditingPosition(null);
    setModalOpen(true);
  };

  const handleView = (position: Position) => {
    setSelectedPosition(position);
    setShowModalOpen(true);
  };

  const openEditModal = (position: Position) => {
    setEditingPosition(position);
    setModalOpen(true);
  };

  const handleDelete = (deleteId: string) => {
    confirm({
      title: "Delete Position",
      description: "This action cannot be undone.",
      onConfirm: async () => {
        const promise = new Promise((resolve, reject) => {
          router.delete(destroy(deleteId), {
            onSuccess: resolve,
            onError: reject,
          });
        });

        toast.promise(promise, {
          loading: "Deleting position...",
          success: "Position deleted successfully ✅",
          error: "Failed to delete position ❌",
        });

        await promise;
      },
    });
  };


  return (
    <AppLayout>
      <Head title="Positions" />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Positions</h1>
          <Button onClick={openAddModal}>
            <Plus className="mr-1 h-4 w-4" /> Add Position
          </Button>
        </div>

        <DataTable
          columns={columns({
            onView: handleView,
            onEdit: openEditModal,
            onDelete: handleDelete,
          })}
          data={positions.data}
          links={positions.links}
          total={positions.total}
          pageSize={positions.per_page || 10}
          currentRoute="/positions"
          filters={filters}
        />
      </div>

      {/* Dynamic Form Modal */}
      <PositionForm
        initialData={editingPosition || undefined}
        departments={departments}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      <PositionShowModal
        open={showModalOpen}
        onClose={() => setShowModalOpen(false)}
        position={selectedPosition || undefined}
      />
    </AppLayout>
  );
}