import { Link } from "@inertiajs/react"
import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns";
import { MoreHorizontal, Clock, Play, CheckCircle, XCircle, Edit3 } from "lucide-react"
import { Badge } from "@/components/ui/badge";
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
import activities from "@/routes/activities";

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

interface ColumnActions {
  onView: (activity: Activity) => void;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
}

export const columns = (actions: ColumnActions): ColumnDef<Activity>[] => [
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

  { accessorKey: "title", header: "Title" },
  { accessorKey: "type", header: "Type" },
  {
    id: "start_date",
    header: "Start Date",
    cell: ({ row }) => format(new Date(row.original.start_date), "MM/dd/yyyy"),
  },
  {
    id: "end_date",
    header: "End Date",
    cell: ({ row }) => format(new Date(row.original.end_date), "MM/dd/yyyy"),
  },
  { accessorKey: "venue", header: "Venue" },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.original.status || "draft").toLowerCase();

      const configs: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
        draft:     { label: "Draft",     color: "gray",   icon: Edit3 },
        upcoming:  { label: "Upcoming",  color: "blue",   icon: Clock },
        ongoing:   { label: "Ongoing",   color: "amber",  icon: Play },
        completed: { label: "Completed", color: "green",  icon: CheckCircle },
        cancelled: { label: "Cancelled", color: "red",    icon: XCircle },
      };

      const config = configs[status] || configs.draft;

      return (
        <Badge 
          variant="secondary"
          className={`capitalize border-${config.color}-300 bg-${config.color}-100 text-${config.color}-700 flex items-center gap-1.5`}
        >
          <config.icon className="h-3.5 w-3.5" />
          {config.label}
        </Badge>
      );
    },
  },

  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => {
      const department = row.original

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
            <DropdownMenuItem onClick={() => actions.onView(department)}>View details</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={activities.participants.index(row.original.id)}>Participants</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => actions.onEdit(department)}>Edit</DropdownMenuItem>
            <DropdownMenuItem  onClick={() => actions.onDelete(department.id)} className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]