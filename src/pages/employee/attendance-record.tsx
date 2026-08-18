import { AttendanceRecord } from "@/features/attendance/components/record";

export function AttendanceRecordPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Catat Kehadiran</h2>
          <p className="text-muted-foreground text-sm">
            Pastikan Anda berada di area kantor saat melakukan absen.
          </p>
        </div>
      </div>

      <AttendanceRecord />
    </div>
  );
}
