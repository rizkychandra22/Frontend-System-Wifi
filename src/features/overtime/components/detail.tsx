import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

import type { Overtime } from "@/lib/api/overtime";
import { getUserData } from "@/lib/auth-utils";
import { formatFullDate, formatLocalTime } from "@/lib/date-utils";

interface OvertimeDetailProps {
  overtime: Overtime | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OvertimeDetail({ overtime, isOpen, onOpenChange }: OvertimeDetailProps) {
  const user = getUserData();
  const isAdmin = user?.role === "admin";

  if (!overtime) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto no-scrollbar">
        <SheetHeader>
          <SheetTitle>Detail Kerja Lembur</SheetTitle>
          <SheetDescription>
            Informasi lengkap kerja lembur karyawan.
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          <div className="space-y-1">
            <Label className="text-muted-foreground">Karyawan</Label>
            <div className="font-medium text-lg">{overtime.user?.name || "Karyawan"}</div>
          </div>

          <div className="space-y-1">
            <Label className="text-muted-foreground">Judul Pekerjaan</Label>
            <div className="font-medium">{overtime.title}</div>
          </div>

          <div className="space-y-1">
            <Label className="text-muted-foreground">Deskripsi</Label>
            <div className="font-medium">{overtime.description || "-"}</div>
          </div>

          <div className="space-y-1">
            <Label className="text-muted-foreground">Waktu Lembur</Label>
            <div className="font-medium">
              {formatFullDate(overtime.date)}
            </div>
            <div className="font-medium">
              {formatLocalTime(overtime.start_time)} - {formatLocalTime(overtime.end_time)}
            </div>
          </div>

          {isAdmin && (
            <div className="space-y-1">
              <Label className="text-muted-foreground">Tarif Lembur</Label>
              <div className="font-medium mt-1 break-all bg-primary/10 text-primary p-2 rounded text-sm">
                Rp {Math.round(overtime.price || 0).toLocaleString("id-ID")}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
