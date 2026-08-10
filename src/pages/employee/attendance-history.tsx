import { AttendanceHistory } from "@/features/attendance/components/table-history";

export function AttendanceHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Riwayat Kehadiran</h1>
        <p className="text-muted-foreground">
          Daftar riwayat absensi Anda dari waktu ke waktu.
        </p>
      </div>

      <AttendanceHistory />
    </div>
  );
}
