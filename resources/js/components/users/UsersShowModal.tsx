import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { User } from '@/types/auth';
import { Badge } from '../ui/badge';




interface UserShowModalProps {
  open: boolean;
  onClose: () => void;
  user: User;
}

export default function UserShowModal({
  open,
  onClose,
  user,
}: UserShowModalProps) {
  if (!user) return null;
  const defaultCover = "/images/cover.png";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            User Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">

          <div className="relative h-40 w-full rounded-xl overflow-hidden bg-muted">
            <img
              src={typeof user.cover === 'string' ? user.cover : defaultCover}
              alt="cover"
              className="h-full w-full object-cover"
            />

            <div className="absolute -bottom-8 left-6">
              <Avatar className="h-16 w-16 border-4 border-background">
                <AvatarImage src={user.avatar || ""} alt={user.name} />
                <AvatarFallback className="text-xl">
                  {user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="pt-5 px-2">
            <h2 className="text-lg font-bold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>

            <div className="flex gap-2 mt-2 flex-wrap">
              {Array.isArray(user.roles) && user.roles.length ? (
                user.roles.map((role, i) => (
                  <Badge key={i} variant="secondary" className="capitalize">
                    {role}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline">No Role</Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            <div>
              <h4 className="text-sm text-muted-foreground">Email Status</h4>
              <Badge variant="secondary">
                {user.email_verified_at ? "Verified" : "Not Verified"}
              </Badge>
            </div>

            <div>
              <h4 className="text-sm text-muted-foreground">Last Login</h4>
              <p className="font-medium">
                {user.last_login_at
                  ? new Date(user.last_login_at as string | number | Date).toLocaleString()
                  : "Never"}
              </p>
            </div>

            <div>
              <h4 className="text-sm text-muted-foreground">Member Since</h4>
              <p className="font-medium">
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : "-"}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}