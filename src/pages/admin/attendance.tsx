import { AdminAttendanceTable } from "@/features/attendance/components/admin-table-history";
import { useAllAttendance } from "@/features/attendance/hooks/use-attendance";

export function AdminAttendancePage() {
  const { attendances, errorMessage } = useAllAttendance();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Data Kehadiran</h2>
          <p className="text-muted-foreground text-sm">
            Lihat riwayat absensi seluruh karyawan.
          </p>
        </div>
      </div>

      {errorMessage ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          {errorMessage}
        </div>
      ) : (
        <AdminAttendanceTable attendances={attendances} />
      )}
    </div>
  );
}
