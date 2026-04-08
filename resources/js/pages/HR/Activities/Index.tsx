"use client";

import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from "react";
import { toast } from 'sonner';
import { ActivitiesForm } from "@/components/activities/ActivitiesForm";
import ActivitiesShowModal from '@/components/activities/ActivitiesShowModal';
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/ui/confirm-provider";
import { DataTable } from "@/components/ui/data-table";
import AppLayout from "@/layouts/app-layout";
import { destroy } from '@/routes/activities';
import { columns } from './columns';

interface Activity {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  type: string;
  venue: string;
  address: string;
  budget: number;
  actual_cost: number;
  lead?: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
}

interface PaginatedActivities {
  data: Activity[];
  links: { url: string | null; label: string; active: boolean }[];
  total: number;
  per_page: number;
}

interface Props {
  activities: PaginatedActivities;
  employees: { id: string; first_name: string; last_name: string }[];
  filters?: Record<string, string | number | undefined>;
}

export default function ActivitiesIndex({ activities, employees, filters }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [showModalOpen, setShowModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const { confirm } = useConfirm();

  const openAddModal = () => {
    setEditingActivity(null);
    setModalOpen(true);
  };

  const handleView = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowModalOpen(true);
  };

  const openEditModal = (activity: Activity) => {
    setEditingActivity(activity);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    confirm({
      title: "Delete Activity",
      description: "Are you sure you want to delete this activity? This action cannot be undone.",
      onConfirm: async () => {
        const promise = new Promise((resolve, reject) => {
          router.delete(destroy(id), {
            preserveScroll: true,
            onSuccess: resolve,
            onError: reject,
          });
        });

        toast.promise(promise, {
          loading: "Deleting activity...",
          success: "Activity deleted successfully ✅",
          error: "Failed to delete activity ❌",
        });

        await promise;
      },
    });
  };

  return (
    <AppLayout>
      <Head title="Activities" />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Activities</h1>
          <Button onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Activity
          </Button>
        </div>

        <DataTable
          columns={columns({
            onView: handleView,
            onEdit: openEditModal,
            onDelete: handleDelete,
          })}
          data={activities.data}
          links={activities.links} 
          total={activities.total}
          pageSize={activities.per_page}
          currentRoute="/activities"
          filters={filters}
          searchPlaceholder="Search activities..."
        />
      </div>

      {/* Add/Edit Form Modal */}
      <ActivitiesForm
        initialData={editingActivity || undefined}
        employees={employees}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      {/* View Details Modal */}
      <ActivitiesShowModal
        open={showModalOpen}
        onClose={() => setShowModalOpen(false)}
        activity={selectedActivity}
      />
    </AppLayout>
  );
}