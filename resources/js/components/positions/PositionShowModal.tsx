import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';


interface PositionShowModalProps {
  open: boolean;
  onClose: () => void;
  position: any; // You can replace 'any' with a more specific type if you have one
}

export default function PositionShowModal({
  open,
  onClose,
  position,
}: PositionShowModalProps) {
  if (!position) return null;

  const status = position.status?.toLowerCase();

  const getStatusVariant = () => {
    if (status === 'true') return 'default';
    if (status === 'false') return 'destructive';
    return 'secondary';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-between pt-3">
            <span>Position Details</span>

            <motion.div
              key={status} // triggers animation when status changes
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Badge variant={getStatusVariant()} className="capitalize">
                {position.status}
              </Badge>
            </motion.div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm text-muted-foreground">Position Title</h4>
              <p className="text-lg font-semibold">
                {position.title}
              </p>
            </div>

            <div>
              <h4 className="text-sm text-muted-foreground">Code</h4>
              <p className="text-lg font-semibold">{position.code}</p>
            </div>

            <div>
              <h4 className="text-sm text-muted-foreground">Department Name</h4>
              <p className="text-lg font-semibold">{position.department?.name}</p>
            </div>
          </div>

          {/* Message */}
          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-muted-foreground leading-relaxed">
              {position.description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}