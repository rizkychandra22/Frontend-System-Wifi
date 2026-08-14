import { type User } from "@/lib/api/users";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface UserDetailProps {
  user: User | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetail({ user, isOpen, onOpenChange }: UserDetailProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Detail User</SheetTitle>
          <SheetDescription>Complete Information User.</SheetDescription>
        </SheetHeader>
        <div className="space-y-5 mt-6">
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs">Name</Label>
            <div className="font-medium">{user?.name}</div>
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs">Phone Number</Label>
            <div className="font-medium">{user?.phone}</div>
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs">Role</Label>
            <div className="font-medium capitalize">{user?.role === "employee" ? "Employee" : "Customer"}</div>
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs">Address</Label>
            <div className="font-medium">{user?.address || "-"}</div>
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs">Status Device (IP)</Label>
            <div className="font-medium">
              {user?.ip_address || "-"}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
