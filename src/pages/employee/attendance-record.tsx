import { AttendanceRecord } from "@/features/attendance/components/record";

export function AttendanceRecordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Catat Kehadiran</h1>
        <p className="text-muted-foreground">
          Pastikan Anda berada di area kantor saat melakukan absen.
        </p>
      </div>

      <AttendanceRecord />
    </div>
  );
}
