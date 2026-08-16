import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import type { Overtime } from "@/lib/api/overtime";
import { getUserData } from "@/lib/auth-utils";

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
      <SheetContent className="overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl">Detail Kerja Lembur</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">Karyawan</h3>
            <p className="font-medium text-base">{overtime.user?.name || "Karyawan"}</p>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">Judul Pekerjaan</h3>
            <p className="font-medium text-base">{overtime.title}</p>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">Deskripsi</h3>
            <div className="p-3 bg-muted/50 rounded-lg text-sm border">
              {overtime.description}
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">Waktu Lembur</h3>
            <p className="font-medium">
              {format(parseISO(overtime.date), "dd MMMM yyyy", { locale: id })}
            </p>
            <p className="text-sm text-muted-foreground">
              {format(parseISO(overtime.start_time), "HH:mm")} - {format(parseISO(overtime.end_time), "HH:mm")}
            </p>
          </div>

          {isAdmin && (
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-2 mt-4">
              <h3 className="text-sm font-medium text-primary">Informasi Tarif (Admin Only)</h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tarif Lembur:</span>
                <span className="font-bold text-lg text-primary">Rp {overtime.price.toLocaleString("id-ID")}</span>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
