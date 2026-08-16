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
  isEmployeeView?: boolean;
}

export function UserDetail({ user, isOpen, onOpenChange, isEmployeeView = false }: UserDetailProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Detail Pengguna</SheetTitle>
          <SheetDescription>
            Informasi lengkap pengguna.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="space-y-1">
            <Label className="text-muted-foreground">Nama</Label>
            <div className="font-medium text-lg">{user?.name}</div>
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground">No. Telp</Label>
            <div className="font-medium">{user?.phone}</div>
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground">Role</Label>
            <div className="font-medium capitalize">{user?.role}</div>
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground">Alamat</Label>
            <div className="font-medium">{user?.address || "-"}</div>
          </div>
          {!isEmployeeView && (
            <div className="space-y-1">
              <Label className="text-muted-foreground">ID Perangkat</Label>
              <div className="font-medium mt-1 break-all bg-muted p-2 rounded text-xs">
                {user?.device_id || "-"}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
