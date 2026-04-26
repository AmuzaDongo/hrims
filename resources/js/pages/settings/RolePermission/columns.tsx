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

interface Role {
  id: number;
  name: string;
  permissions: { id: number; name: string }[];
}

interface ColumnActions {
  onView: (role: Role) => void;
  onEdit: (role: Role) => void;
  onAsignPermissions: (role: Role) => void;
  onDelete: (id: string) => void;
}

export const columns = (actions: ColumnActions): ColumnDef<Role>[] => [
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
  {
    accessorKey: "name",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original;

      return (
        <div className="flex items-center gap-2">
          <span>{role.name}</span>
        </div>
      );
    },
  },
  {
    id: "permissions",
    header: "Permissions",
    cell: ({ row }) => {
      const role = row.original;

      return (
        <div className="flex flex-wrap gap-1">
          {role.permissions.length ? (
            role.permissions.map((perm) => (
              <Badge key={perm.id} variant="secondary" className="text-xs">
                {perm.name}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground">No Permissions</span> 
          )}
        </div>
      );
    },
  },

  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => {
      const role = row.original;

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
            <DropdownMenuItem onClick={() => actions.onView(role)}>View details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => actions.onAsignPermissions(role)}>Assign Permissions</DropdownMenuItem>
            <DropdownMenuItem onClick={() => actions.onEdit(role)}>Edit</DropdownMenuItem>
            <DropdownMenuItem  onClick={() => actions.onDelete(role.id.toString())} className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]