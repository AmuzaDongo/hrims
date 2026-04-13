"use client";

import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from "react";
import { toast } from 'sonner';
import { ScriptForm } from '@/components/scripts/Script-form';
import ScriptShowModal from '@/components/scripts/ScriptShowModal';
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/ui/confirm-provider";
import { DataTable } from "@/components/ui/data-table";
import AppLayout from "@/layouts/app-layout";
import { dashboard } from '@/routes';
import scripts, { destroy } from '@/routes/scripts';
import type { BreadcrumbItem } from "@/types";
import { columns } from './columns';

interface Script {
  id: string;
  papers: {
    id: string;
    name: string;
    code: string;
  }[];
  center_origin: string;
  current_location: string;
  status: string;
}

interface Paginatedscripts {
  data: Script[];
  links: { url: string | null; label: string; active: boolean }[];
  total: number;
  per_page: number;
}
  
interface Props {
  scripts: Paginatedscripts;
  papers: {
    id: string;
    name: string;
    code: string;
  }[];
  filters?: Record<string, string | number | undefined>;
}

const breadcrumbs = (): BreadcrumbItem[] => [
  { title: 'Dashboard', href: dashboard().url || "/" },
  { title: 'Scripts', href: scripts.index().url || "/scripts" },
];

export default function ActivitiesIndex({ scripts, papers, filters }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [showModalOpen, setShowModalOpen] = useState(false);
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [editingScript, setEditingScript] = useState<Script | null>(null);

  const { confirm } = useConfirm();

  const openAddModal = () => {
    setEditingScript(null);
    setModalOpen(true);
  };

  const handleView = (script: Script) => {
    setSelectedScript(script);
    setShowModalOpen(true);
  };

  const openEditModal = (script: Script) => {
    setEditingScript(script);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    confirm({
      title: "Delete Script",
      description: "Are you sure you want to delete this script? This action cannot be undone.",
      onConfirm: async () => {
        const promise = new Promise((resolve, reject) => {
          router.delete(destroy(id), {
            preserveScroll: true,
            onSuccess: resolve,
            onError: reject,
          });
        });

        toast.promise(promise, {
          loading: "Deleting paper...",
          success: "Paper deleted successfully ✅",
          error: "Failed to delete paper ❌",
        });

        await promise;
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs()}>
      <Head title="Scripts" />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Scripts</h1>
          <Button onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Script
          </Button>
        </div>

        <DataTable
          columns={columns({
            onView: handleView,
            onEdit: openEditModal,
            onDelete: handleDelete,
          })}
          data={scripts.data}
          links={scripts.links} 
          total={scripts.total}
          pageSize={scripts.per_page}
          currentRoute="/scripts"
          filters={filters}
          searchPlaceholder="Search scripts..."
        />
      </div>

      {/* Add/Edit Form Modal */}
      <ScriptForm
        initialData={editingScript || undefined}
        papers={papers}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      {/* View Details Modal */}
      <ScriptShowModal
        open={showModalOpen}
        onClose={() => setShowModalOpen(false)}
        script={selectedScript}
      />
    </AppLayout>
  );
}