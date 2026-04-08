"use client";

import { format } from "date-fns";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ================= TYPES ================= */

interface Participant {
  id: string;
  employee?: {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
  } | null;

  role?: string | null;
  status?: string | null;
  notes?: string;
  created_at?: string;
}

interface ParticipantShowModalProps {
  open: boolean;
  onClose: () => void;
  participant: Participant | null;
}

/* ================= HELPERS ================= */

const getFullName = (participant: Participant) => {
  const emp = participant.employee;
  if (!emp) return "External Participant";

  const first = emp.first_name ?? "";
  const last = emp.last_name ?? "";

  return `${first} ${last}`.trim() || "Unnamed";
};

const getInitials = (participant: Participant) => {
  const emp = participant.employee;
  if (!emp) return "EP";

  const first = emp.first_name?.[0] ?? "";
  const last = emp.last_name?.[0] ?? "";

  return (first + last).toUpperCase() || "NA";
};

const statusColors: Record<string, string> = {
  invited: "bg-amber-100 text-amber-800 border-amber-300",
  confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  attended: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

/* ================= COMPONENT ================= */

export default function ParticipantShowModal({
  open,
  onClose,
  participant,
}: ParticipantShowModalProps) {
  if (!participant) return null;

  const name = getFullName(participant);
  const initials = getInitials(participant);

  const status = participant.status?.toLowerCase() ?? "invited";
  const role = participant.role ?? "participant";

  const createdAt = participant.created_at
    ? new Date(participant.created_at)
    : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-between">
            Participant Details

            <motion.div
              key={status}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              <Badge
                className={`capitalize ${
                  statusColors[status] ||
                  "bg-gray-100 text-gray-800 border-gray-300"
                }`}
                variant="outline"
              >
                {status}
              </Badge>
            </motion.div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-6">

          {/* PARTICIPANT INFO */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-lg font-semibold">
              {initials}
            </div>

            <div>
              <h3 className="text-2xl font-semibold">{name}</h3>
              <p className="text-muted-foreground capitalize">
                {role.replace("_", " ")}
              </p>
            </div>
          </div>

          {/* ROLE & STATUS */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium capitalize text-lg">
                {role.replace("_", " ")}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={statusColors[status] || ""}>
                {status}
              </Badge>
            </div>
          </div>

          {/* NOTES */}
          {participant.notes && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Notes</p>
              <p className="text-muted-foreground leading-relaxed border-l-4 border-muted pl-4">
                {participant.notes}
              </p>
            </div>
          )}

          {/* METADATA */}
          <div className="pt-6 border-t text-sm text-muted-foreground">
            <p>
              {createdAt
                ? `Added on ${format(createdAt, "PPP")}`
                : "Date not available"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}