"use client";

import { Head, Link, router } from "@inertiajs/react";
import type { ColumnDef } from "@tanstack/react-table";
import { Circle, MoreHorizontal, Plane, Plus, PowerOff, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AppLayout from "@/layouts/app-layout";
import { destroy, edit, show } from "@/wayfinder/routes/employees";



// Employee type
interface Employee {
  id: string;
  employee_number: string | null;
  first_name: string;
  last_name: string;
  department: { id: string; name: string } | null;
  position: { id: string; title: string } | null;
  employment_type: string | null;
  status: string;
}

// Props passed from the backend
interface Props {
  employees: {
    data: Employee[];
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    total: number; // total rows returned by backend
  };
  filters: {
    search?: string;
    per_page?: number;
    [key: string]: any;
  };
}

export default function EmployeeIndex({ employees, filters }: Props) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Delete handler
  const confirmDelete = () => {
    if (!deleteId) return;

    const loading = toast.loading("Deleting...");

    router.delete(destroy(deleteId), {
      preserveScroll: true,
      onSuccess: () => toast.success("Deleted", { id: loading }),
      onError: () => toast.error("Failed", { id: loading }),
      onFinish: () => setDeleteId(null),
    });
  };

  // Table columns
  const columns: ColumnDef<Employee>[] = [
    {
      accessorFn: (row) => `${row.first_name} ${row.last_name}`,
      id: "name",
      header: "Name",
    },
    {
      accessorKey: "employee_number",
      header: "Number",
    },
    {
      id: "department",
      header: "Department",
      accessorFn: (row) => row.department?.name || "—",
    },
    {
      id: "position",
      header: "Position",
      accessorFn: (row) => row.position?.title || "—",
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = (row.original.status || "draft").toLowerCase();

        const configs: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
          inactive:  { label: "Inactive",  color: "yellow",   icon: PowerOff },
          on_leave:   { label: "on Leave",   color: "amber",  icon: Plane },
          active: { label: "Active", color: "green",  icon: Circle },
          terminated: { label: "Terminated", color: "red",    icon: XCircle },
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
      header: "",
      cell: ({ row }) => {
        const e = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href={show(e.id)}>View</Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href={edit(e.id)}>Edit</Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-600"
                onClick={() => setDeleteId(e.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <AppLayout>
      <Head title="Employees" />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Employees</h1>

          <Button asChild>
            <Link href="/employees/create" className="flex items-center">
              <Plus size={16} className="mr-2" />
              Add
            </Link>
          </Button>
        </div>

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={employees.data}
          links={employees.links}
          total={employees.total}
          pageSize={filters.per_page || 10}
          currentRoute="/employees"
          filters={filters}
        />
      </div>
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the employee record.
              <br />
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}