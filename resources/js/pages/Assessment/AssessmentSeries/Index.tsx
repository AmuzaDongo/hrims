"use client";

import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from "react";
import { toast } from 'sonner';
import { AssessmentSeriesForm } from '@/components/assessment_series/AssessmentSeriesForm';
import AssessmentSeriesShowModal from '@/components/assessment_series/AssessmentSeriesShowModal';
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/ui/confirm-provider";
import { DataTable } from "@/components/ui/data-table";
import AppLayout from "@/layouts/app-layout";
import { dashboard } from '@/routes';
import assessmentSeries, { destroy } from '@/routes/assessment-series';
import type { BreadcrumbItem } from "@/types";
import { columns } from './columns';

interface AssessmentSeries {
  id: string;
  name: string;
  year: string;
  status: string;
}

interface PaginatedAssessmentSeries {
  data: AssessmentSeries[];
  links: { url: string | null; label: string; active: boolean }[];
  total: number;
  per_page: number;
}

interface Props {
  assessmentSeries: PaginatedAssessmentSeries;
  filters?: Record<string, string | number | undefined>;
}


const breadcrumbs = (): BreadcrumbItem[] => [
  { title: 'Dashboard', href: dashboard().url || "/" },
  { title: 'Assessment Series', href: assessmentSeries.index().url || "/assessment-series" },
];

export default function ActivitiesIndex({ assessmentSeries, filters }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [showModalOpen, setShowModalOpen] = useState(false);
  const [selectedAssessmentSeries, setSelectedAssessmentSeries] = useState<AssessmentSeries | null>(null);
  const [editingAssessmentSeries, setEditingAssessmentSeries] = useState<AssessmentSeries | null>(null);

  const { confirm } = useConfirm();

  const openAddModal = () => {
    setEditingAssessmentSeries(null);
    setModalOpen(true);
  };

  const handleView = (assessmentSeries: AssessmentSeries) => {
    setSelectedAssessmentSeries(assessmentSeries);
    setShowModalOpen(true);
  };

  const openEditModal = (assessmentSeries: AssessmentSeries) => {
    setEditingAssessmentSeries(assessmentSeries);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    confirm({
      title: "Delete Assessment Series",
      description: "Are you sure you want to delete this assessment series? This action cannot be undone.",
      onConfirm: async () => {
        const promise = new Promise((resolve, reject) => {
          router.delete(destroy(id), {
            preserveScroll: true,
            onSuccess: resolve,
            onError: reject,
          });
        });

        toast.promise(promise, {
          loading: "Deleting assessment series...",
          success: "Assessment series deleted successfully ✅",
          error: "Failed to delete assessment series ❌",
        });

        await promise;
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs()}>
      <Head title="Assessment Series" />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Assessment Series</h1>
          <Button onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Assessment Series
          </Button>
        </div>

        <DataTable
          columns={columns({
            onView: handleView,
            onEdit: openEditModal,
            onDelete: handleDelete,
          })}
          data={assessmentSeries.data}
          links={assessmentSeries.links} 
          total={assessmentSeries.total}
          pageSize={assessmentSeries.per_page}
          currentRoute="/assessment-series"
          filters={filters}
          searchPlaceholder="Search assessment series..."
        />
      </div>

      {/* Add/Edit Form Modal */}
      <AssessmentSeriesForm
        initialData={editingAssessmentSeries || undefined}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      {/* View Details Modal */}
      <AssessmentSeriesShowModal
        open={showModalOpen}
        onClose={() => setShowModalOpen(false)}
        assessmentSeries={selectedAssessmentSeries}
      />
    </AppLayout>
  );
}