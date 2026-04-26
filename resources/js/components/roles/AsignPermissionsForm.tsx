"use client";

import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import roles_permissions from "@/routes/roles-permissions";

interface Permission {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

interface Props {
  initialData?: Role;
  permissions: Permission[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignPermissionsForm({
  initialData,
  permissions,
  open,
  onOpenChange,
}: Props) {
  const roleId = initialData?.id;

  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    if (open) {
      setSelected(initialData?.permissions?.map(p => p.id) || []);
    }
  }, [open, initialData]);

  const syncPermissions = (newPermissions: number[]) => {
    if (!roleId) return;

    setSelected(newPermissions); // optimistic UI

    router.post(
      roles_permissions.sync(),
      {
        role_id: roleId,
        permissions: newPermissions,
      },
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          toast.success("Permissions updated");
        },
        onError: () => {
          toast.error("Failed to update permissions");
        },
      }
    );
  };

  const togglePermission = (id: number) => {
    const exists = selected.includes(id);

    const updated = exists
      ? selected.filter(p => p !== id)
      : [...selected, id];

    syncPermissions(updated);
  };

  const toggleAll = () => {
    const allIds = permissions.map(p => p.id);

    const allSelected = selected.length === permissions.length;

    syncPermissions(allSelected ? [] : allIds);
  };

  const isChecked = (id: number) => selected.includes(id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">

        <DialogHeader>
          <DialogTitle>
            Manage Permissions - {initialData?.name}
          </DialogTitle>
          <DialogDescription>
            Changes are saved instantly.
          </DialogDescription>
        </DialogHeader>

        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-2">
          <Label>Permissions</Label>
          <div className="flex items-center gap-2">
            
            <span className="text-sm text-muted-foreground">
              {selected.length} of {permissions.length} selected
            </span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={toggleAll}
            >
              {selected.length === permissions.length
                ? "Unselect All"
                : "Select All"}
            </Button>
          </div>
        </div>

        {/* CHECKBOXES */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {permissions.map((permission) => (
            <label
              key={permission.id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={isChecked(permission.id)}
                onChange={() => togglePermission(permission.id)}
              />
              <span className={isChecked(permission.id) ? "font-semibold" : ""}>
                {permission.name}
              </span>
            </label>
          ))}
        </div>

      </DialogContent>
    </Dialog>
  );
}