import { Link } from "@inertiajs/react"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
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
import subDepartments from "@/wayfinder/routes/sub-departments"

interface Department {
  id: string;
  name: string;
  code: string; // keep null here
  description: string | null;
  parent?: { id: string; name: string };
  head?: { id: string; first_name: string; last_name: string };
  is_active: boolean;
}

interface ColumnActions {
  onView: (department: Department) => void;
  onEdit: (department: Department) => void;
  onDelete: (id: string) => void;
}

export const columns = (actions: ColumnActions): ColumnDef<Department>[] => [
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

  { accessorKey: "name", header: "Name" },
  { accessorKey: "code", header: "Code" },
  {
    id: "parent",
    header: "Parent Department",
    cell: ({ row }) => row.original.parent?.name || "—",
  },
  {
    id: "head",
    header: "Head",
    cell: ({ row }) =>
      row.original.head
        ? `${row.original.head.first_name} ${row.original.head.last_name}`
        : "—",
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className={row.original.is_active ? "text-green-600" : "text-red-600"}>
        {row.original.is_active ? "Active" : "Inactive"}
      </span>
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
            <DropdownMenuItem asChild>
              <Link href={subDepartments.index()}>Sub Department</Link>
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