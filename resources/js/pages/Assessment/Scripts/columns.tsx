import type { ColumnDef } from "@tanstack/react-table"
import { CheckCircle2, Inbox, MoreHorizontal, ShieldCheck, Truck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

interface ColumnActions {
  onView: (script: Script) => void;
  onEdit: (script: Script) => void;
  onDelete: (id: string) => void;
}

export const columns = (actions: ColumnActions): ColumnDef<Script>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  { accessorKey: "paper.code", header: "Paper Code" },
  { accessorKey: "paper.name", header: "Paper Name" },
  { accessorKey: "center_origin", header: "Center Origin" },
  { accessorKey: "current_location", header: "Current Location" },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.original.status || "draft").toLowerCase();

      const configs: Record<
        string,
        {
          label: string;
          color: string;
          icon: React.ComponentType<{ className?: string }>;
        }
      > = {
        received: {
          label: "Received",
          color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30",
          icon: Inbox,
        },

        allocated: {
          label: "In Transit",
          color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30",
          icon: Truck,
        },

        marked: {
          label: "Marked",
          color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30",
          icon: CheckCircle2,
        },

        checked: {
          label: "Checked",
          color: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30",
          icon: ShieldCheck,
        },
      };

      const config = configs[status] || configs.draft;

      return (
        <Badge 
          variant="secondary"
          className={`capitalize border-${config.color}-300 bg-${config.color}-100 text-${config.color}-700 flex items-center gap-1.5`}
        >
          <config.icon className="h-3 w-3" />
          {config.label}
        </Badge>
      );
    },
  },

  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => {
      const script = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => actions.onView(script)}>View details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => actions.onEdit(script)}>Edit</DropdownMenuItem>
            <DropdownMenuItem  onClick={() => actions.onDelete(script.id)} className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]