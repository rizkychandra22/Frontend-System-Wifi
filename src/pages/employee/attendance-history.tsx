import { useAttendanceHistory } from "@/features/attendance/hooks/use-attendance";

export function AttendanceHistoryPage() {
  const { history } = useAttendanceHistory();

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Hadir":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Selesai":
        return "bg-green-100 text-green-700 border-green-200";
      case "Libur":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "Izin":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "Disiplin":
      case "Tepat Waktu":
        return "text-green-600";
      case "Toleransi Terlambat":
        return "text-amber-600";
      case "Terlambat":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Riwayat Kehadiran</h1>
        <p className="text-muted-foreground">
          Daftar riwayat absensi Anda dari waktu ke waktu.
        </p>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Tanggal</th>
                <th className="px-6 py-4 font-medium">Jam Masuk</th>
                <th className="px-6 py-4 font-medium">Jam Keluar</th>
                <th className="px-6 py-4 font-medium">Grade</th>
                <th className="px-6 py-4 font-medium">Keterangan / Izin</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    Belum ada riwayat absen
                  </td>
                </tr>
              ) : (
                history.map((record) => (
                  <tr key={record.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(record.date).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {record.clock_in ? new Date(record.clock_in).toLocaleTimeString("id-ID") : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {record.clock_out ? new Date(record.clock_out).toLocaleTimeString("id-ID") : "-"}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap font-medium ${getGradeColor(record.grade)}`}>
                      {record.grade || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {record.notes ? (
                        <span className="text-muted-foreground">{record.notes}</span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
