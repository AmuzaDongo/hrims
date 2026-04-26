import type { ColumnDef } from "@tanstack/react-table"
import { CheckCircle2, MoreHorizontal, XCircle } from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
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
import type { User } from "@/types/user";


interface ColumnActions {
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

export const columns = (actions: ColumnActions): ColumnDef<User>[] => [
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
    header: "User",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar || ""} alt={user.name} />
            <AvatarFallback>
              {user.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{user.name}</span>
        </div>
      );
    },
  },
  { accessorKey: "email", header: "Email" },

  {
    id: "status",
    header: "Email Verification",
    cell: ({ row }) => {
      const isVerified = !!row.original.email_verified_at;

    const configs = {
      active: {
        label: "Verified",
        color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30",
        icon: CheckCircle2,
      },
      inactive: {
        label: "Not Verified",
        color: "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800",
        icon: XCircle,
      },
    };

    const config = isVerified ? configs.active : configs.inactive;

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
      const user = row.original

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
            <DropdownMenuItem onClick={() => actions.onView(user)}>View details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => actions.onEdit(user)}>Edit</DropdownMenuItem>
            <DropdownMenuItem  onClick={() => actions.onDelete(user.id.toString())} className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]