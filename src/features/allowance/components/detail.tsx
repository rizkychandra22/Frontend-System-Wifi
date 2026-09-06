import type { Allowance } from "@/lib/api/allowance";
import { Users, User as UserIcon, Calendar, DollarSign, FileText, UserCheck } from "lucide-react";

interface AllowanceDetailProps {
  allowance: Allowance;
  employeeCount?: number;
}

export function AllowanceDetail({ allowance, employeeCount }: AllowanceDetailProps) {
  const getMonthLabel = (monthStr: string) => {
    if (!monthStr) return "-";
    const [year, month] = monthStr.split("-");
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  };

  return (
    <div className="space-y-4 py-2 text-sm">
      {/* Judul & Status Penerima */}
      <div className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-muted/40 border border-border/60">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Nama Tunjangan / Bonus
          </span>
          <h3 className="text-base font-bold text-foreground mt-0.5">{allowance.title}</h3>
        </div>
        <div>
          {allowance.target_type === "global" ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
              <Users className="w-3.5 h-3.5" />
              {employeeCount !== undefined && employeeCount > 0
                ? `Global (${employeeCount} Karyawan)`
                : "Global (Semua Karyawan)"}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
              <UserIcon className="w-3.5 h-3.5" />
              Personal
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Nominal */}
        <div className="p-3 rounded-lg border border-border/50 bg-card space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
            <DollarSign className="w-3.5 h-3.5 text-primary" />
            <span>Besaran Nominal</span>
          </div>
          <div className="text-base font-bold text-primary">
            Rp {allowance.amount.toLocaleString("id-ID")}
          </div>
        </div>

        {/* Bulan */}
        <div className="p-3 rounded-lg border border-border/50 bg-card space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>Periode Bulan</span>
          </div>
          <div className="font-semibold text-foreground">
            {getMonthLabel(allowance.month)} ({allowance.month})
          </div>
        </div>
      </div>

      {/* Penerima Karyawan jika Personal */}
      {allowance.target_type === "personal" && allowance.user && (
        <div className="p-3 rounded-lg border border-border/50 bg-card space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
            <UserCheck className="w-3.5 h-3.5 text-primary" />
            <span>Karyawan Penerima</span>
          </div>
          <div className="font-semibold text-foreground">{allowance.user.name}</div>
          <div className="text-xs text-muted-foreground">{allowance.user.phone}</div>
        </div>
      )}

      {/* Deskripsi */}
      <div className="p-3 rounded-lg border border-border/50 bg-card space-y-1">
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
          <FileText className="w-3.5 h-3.5 text-primary" />
          <span>Keterangan / Alasan Pemberian</span>
        </div>
        <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
          {allowance.description || "Tidak ada keterangan tambahan"}
        </p>
      </div>

      {/* Footer Info */}
      <div className="pt-2 text-xs text-muted-foreground flex justify-between border-t border-border/40">
        <span>Dibuat oleh: {allowance.created_by?.name || "Admin"}</span>
        <span>
          {new Date(allowance.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
