import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Role } from '@/types/role';
import { Badge } from '../ui/badge';




interface RoleShowModalProps {
  open: boolean;
  onClose: () => void;
  role: Role;
}

export default function RoleShowModal({
  open,
  onClose,
  role,
}: RoleShowModalProps) {
  if (!role) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Role Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="pt-5 px-2">
            <h2 className="text-lg font-bold">{role.name}</h2>

            <div className="flex gap-2 mt-2 flex-wrap">
              {Array.isArray(role.permissions) && role.permissions.length ? (
                role.permissions.map((permission, i) => (
                  <Badge key={i} variant="secondary" className="capitalize">
                    {permission.name}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline">No Role</Badge>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}