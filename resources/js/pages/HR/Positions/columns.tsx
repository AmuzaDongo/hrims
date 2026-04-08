import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
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

interface ColumnActions {
  onView: (position: Position) => void;
  onEdit: (position: Position) => void;
  onDelete: (id: string) => void;
}

export const columns = (actions: ColumnActions): ColumnDef<Position>[] => [
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
  { accessorKey: "code", header: "Code" },
  {
    id: "department",
    header: "Department",
    cell: ({ row }) => row.original.department?.name || "—",
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge className={row.original.is_active ? "text-green-600" : "text-red-600"}>
        {row.original.is_active ? "Active" : "Inactive"}
      </Badge>
    ),
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