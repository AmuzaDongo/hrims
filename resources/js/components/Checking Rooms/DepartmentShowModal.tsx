import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useConfirm } from '@/components/ui/confirm-provider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Department {
  id: number;
  status: string;
  name: string;
  code: string;
  head?: {
    first_name: string;
    last_name: string;
  };
  description: string;
  update: (id: number) => string;
}

interface DepartmentShowModalProps {
  open: boolean;
  onClose: () => void;
  department: Department;
}

export default function DepartmentShowModal({
  open,
  onClose,
  department,
}: DepartmentShowModalProps) {
  const { confirm } = useConfirm();

  if (!department) return null;

  const status = department.status?.toLowerCase();

  const getStatusVariant = () => {
    if (status === 'completed') return 'default';
    if (status === 'approved' || status === 'in_progress') return 'default';
    if (status === 'rejected') return 'destructive';
    return 'secondary';
  };

  const updateStatus = (newStatus: string) => {
    confirm({
      title: `Mark as ${newStatus.replace('_', ' ')}`,
      description: `Are you sure you want to mark this consultation as ${newStatus}?`,
      onConfirm: async () => {
        const promise = new Promise((resolve, reject) => {
          router.put(
            department.update(department.id),
            { status: newStatus },
            {
              onSuccess: (page) => {
                onClose(); // Auto-close modal
                resolve(page);
              },
              onError: reject,
            }
          );
        });

        toast.promise(promise, {
          loading: 'Updating status...',
          success: `Status updated to ${newStatus} ✅`,
          error: 'Failed to update status ❌',
        });

        await promise;
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-between pt-3">
            <span>Department Details</span>

            <motion.div
              key={status} // triggers animation when status changes
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Badge variant={getStatusVariant()} className="capitalize">
                {status}
              </Badge>
            </motion.div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm text-muted-foreground">Department Name</h4>
              <p className="text-lg font-semibold">
                {department.name}
              </p>
            </div>

            <div>
              <h4 className="text-sm text-muted-foreground">Code</h4>
              <p className="text-lg font-semibold">{department.code}</p>
            </div>

            <div>
              <h4 className="text-sm text-muted-foreground">Head</h4>
              <p className="text-lg font-semibold">{department.head?.first_name} {department.head?.last_name}</p>
            </div>
          </div>

          {/* Message */}
          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-muted-foreground leading-relaxed">
              {department.description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            {status === 'approved' && (
              <Button onClick={() => updateStatus('in_progress')}>Start Service</Button>
            )}

            {status === 'in_progress' && (
              <Button
                variant="default"
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={() => updateStatus('completed')}
              >
                Mark as Completed
              </Button>
            )}

            {status === 'pending' && (
              <Button
                variant="destructive"
                onClick={() => updateStatus('rejected')}
              >
                Reject
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}