import { AttendanceHistory } from "@/features/attendance/components/table-history";

export function AttendanceHistoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Riwayat Kehadiran</h2>
          <p className="text-muted-foreground text-sm">
            Daftar riwayat absensi Anda dari waktu ke waktu.
          </p>
        </div>
      </div>

      <AttendanceHistory />
    </div>
  );
}
