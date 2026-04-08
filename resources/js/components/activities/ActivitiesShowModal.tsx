"use client";

import { router } from "@inertiajs/react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Calendar, MapPin, User, DollarSign, Tag } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/ui/confirm-provider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Activity {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  status: string;
  type: string;
  venue?: string;
  address?: string;
  budget?: number;
  actual_cost?: number;
  lead?: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
}

interface ActivityShowModalProps {
  open: boolean;
  onClose: () => void;
  activity: Activity | null;
}

export default function ActivityShowModal({
  open,
  onClose,
  activity,
}: ActivityShowModalProps) {
  const { confirm } = useConfirm();

  if (!activity) return null;

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800 border-gray-300",
    upcoming: "bg-blue-100 text-blue-800 border-blue-300",
    ongoing: "bg-amber-100 text-amber-800 border-amber-300",
    completed: "bg-green-100 text-green-800 border-green-300",
    cancelled: "bg-red-100 text-red-800 border-red-300",
  };

  const updateStatus = (newStatus: string) => {
    confirm({
      title: `Mark as ${newStatus.replace("_", " ")}`,
      description: `Are you sure you want to change this activity to "${newStatus}"?`,
      onConfirm: async () => {
        const promise = router.put(`/activities/${activity.id}`, { status: newStatus });

        toast.promise(promise, {
          loading: "Updating status...",
          success: `Activity marked as ${newStatus} successfully`,
          error: "Failed to update status",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-between pr-8">
            {activity.title}
            <motion.div
              key={activity.status}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Badge 
                className={`capitalize font-medium ${statusColors[activity.status] || "bg-gray-100 text-gray-800"}`}
                variant="outline"
              >
                {activity.status}
              </Badge>
            </motion.div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-6">
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-medium">{format(new Date(activity.start_date), "PPP")}</p>
              </div>
            </div>

            {activity.end_date && (
              <div className="flex gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-medium">{format(new Date(activity.end_date), "PPP")}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Lead Person</p>
                <p className="font-medium">
                  {activity.lead 
                    ? `${activity.lead.first_name} ${activity.lead.last_name}` 
                    : "No lead assigned"}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Tag className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium capitalize">{activity.type.replace("_", " ")}</p>
              </div>
            </div>

            {activity.venue && (
              <div className="flex gap-3 md:col-span-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Venue</p>
                  <p className="font-medium">{activity.venue}</p>
                  {activity.address && <p className="text-sm text-muted-foreground mt-1">{activity.address}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {activity.description && (
            <div>
              <h4 className="font-semibold mb-3">Description</h4>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {activity.description}
              </p>
            </div>
          )}

          {/* Financial Information */}
          {(activity.budget || activity.actual_cost) && (
            <div className="pt-6 border-t">
              <h4 className="font-semibold mb-4">Financial Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activity.budget && (
                  <div className="flex gap-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="font-medium text-lg">UGX {Number(activity.budget).toLocaleString()}</p>
                    </div>
                  </div>
                )}
                {activity.actual_cost && (
                  <div className="flex gap-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Actual Cost</p>
                      <p className="font-medium text-lg">UGX {Number(activity.actual_cost).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Status Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-8 border-t">
            {activity.status === "upcoming" && (
              <Button onClick={() => updateStatus("ongoing")} size="lg">
                Start Activity
              </Button>
            )}

            {activity.status === "ongoing" && (
              <Button 
                onClick={() => updateStatus("completed")} 
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                Mark as Completed
              </Button>
            )}

            {(activity.status === "upcoming" || activity.status === "ongoing") && (
              <Button 
                variant="destructive" 
                onClick={() => updateStatus("cancelled")}
                size="lg"
              >
                Cancel Activity
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}