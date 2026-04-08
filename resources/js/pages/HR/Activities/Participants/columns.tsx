import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, UserCheck, XCircle, Trash2, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ================= TYPES ================= */

export interface Participant {
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

interface ColumnActions {
  onView: (participant: Participant) => void;
  onEdit?: (participant: Participant) => void;
  onConfirm: (participant: Participant) => void;
  onCancel: (participant: Participant) => void;
  onDelete: (id: string) => void;
}

/* ================= HELPERS ================= */

const getFullName = (participant: Participant): string => {
  const emp = participant.employee;
  if (!emp) return "External Participant";

  const first = emp.first_name ?? "";
  const last = emp.last_name ?? "";

  return `${first} ${last}`.trim() || "Unnamed";
};

const getInitials = (participant: Participant): string => {
  const emp = participant.employee;
  if (!emp) return "EP";

  const first = emp.first_name?.[0] ?? "";
  const last = emp.last_name?.[0] ?? "";

  return (first + last).toUpperCase() || "NA";
};

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  invited: {
    label: "Invited",
    className: "bg-amber-100 text-amber-800",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-blue-100 text-blue-800",
  },
  attended: {
    label: "Attended",
    className: "bg-green-100 text-green-800",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800",
  },
};

/* ================= COLUMNS ================= */

export const columns = (
  actions: ColumnActions
): ColumnDef<Participant>[] => {
  const { onView, onEdit, onConfirm, onCancel, onDelete } = actions;

  return [
    /* -------- PARTICIPANT -------- */
    {
      id: "name",
      header: "Participant",
      accessorFn: (row) => row.employee,

      cell: ({ row }) => {
        const participant = row.original;
        const name = getFullName(participant);
        const initials = getInitials(participant);

        return (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-muted text-xs font-semibold">
              {initials}
            </div>

            <div className="font-medium">{name}</div>
          </div>
        );
      },
    },

    /* -------- ROLE -------- */
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role ?? "participant";

        return (
          <Badge variant="outline" className="capitalize">
            {role.replace("_", " ")}
          </Badge>
        );
      },
    },

    /* -------- STATUS -------- */
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const rawStatus = row.original.status ?? "invited";
        const status = rawStatus.toLowerCase();

        const config =
          statusConfig[status] || {
            label: rawStatus,
            className: "bg-gray-100 text-gray-800",
          };

        return (
          <Badge className={config.className} variant="secondary">
            {config.label}
          </Badge>
        );
      },
    },

    /* -------- ACTIONS -------- */
    {
      id: "actions",
      header: "Actions",

      cell: ({ row }) => {
        const participant = row.original;
        const status =
          participant.status?.toLowerCase() ?? "invited";

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                Participant Actions
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => onView(participant)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>

              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(participant)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Participant
                </DropdownMenuItem>
              )}

              {status === "invited" && onConfirm && (
                <DropdownMenuItem onClick={() => onConfirm(participant)}>
                  <UserCheck className="mr-2 h-4 w-4 text-green-600" />
                  Confirm Participation
                </DropdownMenuItem>
              )}

              {(status === "invited" || status === "confirmed") && onCancel && (
                <DropdownMenuItem
                  onClick={() => onCancel(participant)}
                  className="text-amber-700 focus:text-amber-700"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Participation
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => onDelete(participant.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove from Activity
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};