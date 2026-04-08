"use client";

import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from "react";
import { toast } from 'sonner';
import ParticipantFormModal from '@/components/activities/participants/ParticipantFormModal';
import ParticipantShowModal from '@/components/activities/participants/ParticipantShowModal';
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/ui/confirm-provider";
import { DataTable } from "@/components/ui/data-table";
import AppLayout from "@/layouts/app-layout";
import { dashboard } from '@/routes';
import activities from '@/routes/activities';
import type { BreadcrumbItem } from "@/types";
import { columns } from './columns';

interface Participant {
  id: string;
  role: string;
  status: string;
  notes: string;
  employee?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  activity?: {
    id: string;
    title: string;
  };
}

interface PaginatedParticipants {
  data: Participant[];
  links: { url: string | null; label: string; active: boolean }[];
  total: number;
  per_page: number;
}

interface Props {
  activity: {
    id: string;
    title: string;
  };
  participants: PaginatedParticipants;
  employees: { id: string; first_name: string; last_name: string }[];
  filters?: Record<string, string | number | undefined>;
}

const breadcrumbs = (activity: { id: string; title: string }): BreadcrumbItem[] => [
  { title: 'Dashboard', href: dashboard().url || "/" },
  { title: 'Activities', href: activities.index().url || "/activities" },
  { title: 'Participants', href: activities.participants.index({ activity: activity.id }).url || `/activities/${activity.id}/participants` },
];

export default function ParticipantsIndex({ activity, participants, employees, filters }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [showModalOpen, setShowModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);

  const { confirm } = useConfirm();

  const openAddModal = () => {
    setEditingParticipant(null);
    setModalOpen(true);
  };

  const handleView = (activity: Participant) => {
    setSelectedParticipant(activity);
    setShowModalOpen(true);
  };

  const openEditModal = (activity: Participant) => {
    setEditingParticipant(activity);
    setModalOpen(true);
  };

 const handleDelete = (participantId: string) => {
  confirm({
    title: "Delete Participant",
    description: "Are you sure you want to delete this participant? This action cannot be undone.",
    onConfirm: async () => {
      const promise = new Promise((resolve, reject) => {
        router.delete(
          `/activities/${activity.id}/participants/${participantId}`,
          {
            preserveScroll: true,
            onSuccess: resolve,
            onError: reject,
          }
        );
      });

      toast.promise(promise, {
        loading: "Deleting participant...",
        success: "Participant deleted successfully ✅",
        error: "Failed to delete participant ❌",
      });

      await promise;
    },
  });
};

  return (
    <AppLayout breadcrumbs={breadcrumbs(activity)}>
      <Head title={activity.title} />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">{activity.title}</h1>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.visit(activities.index().url || "/activities")}
            >
              ← Back
            </Button>
            <Button size="sm" onClick={openAddModal}>
              <Plus className="mr-2 h-4 w-4" />
              Participant
            </Button>
          </div>
        </div>

        <DataTable
          columns={columns({
            onView: handleView,
            onEdit: openEditModal,
            onConfirm: () => {}, // Implement confirm logic
            onCancel: () => {}, // Implement cancel logic
            onDelete: handleDelete,
          })}
          data={participants.data}
          links={participants.links} 
          total={participants.total}
          pageSize={participants.per_page}
          currentRoute={activities.participants.index({ activity: activity.id }).url || `/activities/${activity.id}/participants`}
          filters={filters}
          searchPlaceholder="Search participants..."
        />
      </div>

      <ParticipantFormModal
        initialData={
          editingParticipant
            ? {
                id: editingParticipant.id,
                employee_id: editingParticipant.employee?.id ?? "",
                employee_ids: [],
                role: editingParticipant.role,
                status: editingParticipant.status,
                notes: editingParticipant.notes || "",
              }
            : undefined
        }
        employees={employees}
        activityId={activity.id}
        activityTitle={activity.title}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      {/* View Details Modal */}
      <ParticipantShowModal
        open={showModalOpen}
        onClose={() => setShowModalOpen(false)}
        participant={selectedParticipant}
      />
    </AppLayout>
  );
}