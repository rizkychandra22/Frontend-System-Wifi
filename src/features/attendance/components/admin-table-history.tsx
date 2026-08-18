import { type AttendanceRecord } from "@/lib/api/attendance";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdminAttendanceTableProps {
  attendances: AttendanceRecord[];
}

export function AdminAttendanceTable({ attendances }: AdminAttendanceTableProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");

  const filteredAttendances = attendances.filter((record) => {
    if (startDate && record.date < startDate) return false;
    if (endDate && record.date > endDate) return false;
    if (statusFilter !== "Semua Status" && record.status !== statusFilter) return false;
    return true;
  });

  const getStatusBadgeColor = (rawStatus: string) => {
    const status = (rawStatus || "").trim().toLowerCase();
    switch (status) {
      case "proses":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "hadir":
        return "bg-green-100 text-green-700 border-green-200";
      case "libur":
        return "bg-red-100 text-red-700 border-red-200";
      case "izin":
        return "bg-amber-100 text-amber-700 border-amber-200";
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="w-full sm:w-40">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 text-xs w-full">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semua Status">Semua Status</SelectItem>
              <SelectItem value="Hadir">Hadir</SelectItem>
              <SelectItem value="Izin">Izin</SelectItem>
              <SelectItem value="Libur">Libur</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-9 w-full sm:w-36 text-xs flex-1"
          />
          <span className="text-muted-foreground text-sm shrink-0">-</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-9 w-full sm:w-36 text-xs flex-1"
          />
        </div>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Karyawan</th>
                <th className="px-6 py-4 font-medium">Tanggal</th>
                <th className="px-6 py-4 font-medium">Absen Masuk</th>
                <th className="px-6 py-4 font-medium">Absen Keluar</th>
                <th className="px-6 py-4 font-medium">Grade</th>
                <th className="px-6 py-4 font-medium min-w-[250px]">Keterangan</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendances.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                    Belum ada riwayat absen
                  </td>
                </tr>
              ) : (
                filteredAttendances.map((record) => (
                  <tr key={record.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-foreground">{record.user?.name || "Unknown"}</div>
                      <div className="text-xs text-muted-foreground">{record.user?.phone || "-"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(record.date).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {record.clock_in 
                        ? `Hadir (${new Date(record.clock_in).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })})` 
                        : record.status === "Libur" ? "Tidak Ada Absen" : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {record.clock_out 
                        ? `Pulang (${new Date(record.clock_out).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })})` 
                        : record.status === "Libur" ? "Tidak Ada Absen" : "-"}
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
