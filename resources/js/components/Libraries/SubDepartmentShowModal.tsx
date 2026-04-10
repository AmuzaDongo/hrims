import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SubDepartmentShowModalProps {
  open: boolean;
  onClose: () => void;
  subDepartment: any;
}

export default function SubDepartmentShowModal({
  open,
  onClose,
  subDepartment,
}: SubDepartmentShowModalProps) {

  if (!subDepartment) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-between pt-3">
            <span>Sub Department Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm text-muted-foreground">Name</h4>
              <p className="text-lg font-semibold">
                {subDepartment.name}
              </p>
            </div>

            <div>
              <h4 className="text-sm text-muted-foreground">Code</h4>
              <p className="text-lg font-semibold">{subDepartment.code}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Parent Department</h4>
            <p className="text-muted-foreground leading-relaxed">
              {subDepartment.department?.name}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-muted-foreground leading-relaxed">
              {subDepartment.description}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}