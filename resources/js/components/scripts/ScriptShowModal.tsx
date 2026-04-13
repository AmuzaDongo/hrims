import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Script {
  id: number;
  center_origin: string;
  current_location: string;
  status: string;
  paper?: {
    name: string;
    code: string;
  };
  update: (id: number) => string;
}

interface ScriptShowModalProps {
  open: boolean;
  onClose: () => void;
  script: Script | null;
}

export default function ScriptShowModal({
  open,
  onClose,
  script,
}: ScriptShowModalProps) {

  if (!script) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-between pt-3">
            <span>Script Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div>
              <h4 className="text-sm text-muted-foreground">Paper Name</h4>
              <p className="text-lg font-semibold">
                {script.paper?.code} - ({script.paper?.name})
              </p>
            </div>

            <div>
              <h4 className="text-sm text-muted-foreground">Center Origin</h4>
              <p className="text-lg font-semibold">{script.center_origin}</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Current Location</h4>
            <p className="text-muted-foreground leading-relaxed">
              {script.current_location}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Status</h4>
            <Badge variant="outline" className="text-sm">
              {script.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}