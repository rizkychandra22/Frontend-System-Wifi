import { type AttendanceRecord } from "@/lib/api/attendance";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { useUpdateAttendance } from "@/features/attendance/hooks/use-attendance";

interface AdminAttendanceTableProps {
  attendances: AttendanceRecord[];
}

export function AdminAttendanceTable({ attendances }: AdminAttendanceTableProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [gradeFilter, setGradeFilter] = useState("Semua Grade");

  // Edit Modal State
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [clockInTime, setClockInTime] = useState("");
  const [clockOutTime, setClockOutTime] = useState("");
  const [status, setStatus] = useState("Hadir");
  const [grade, setGrade] = useState("auto");
  const [notes, setNotes] = useState("");

  const updateMutation = useUpdateAttendance();

  const formatTimeToInputValue = (isoStr: string | null) => {
    if (!isoStr) return "";
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return "";
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    } catch {
      return "";
    }
  };

  const handleOpenEdit = (record: AttendanceRecord) => {
    setEditingRecord(record);
    setClockInTime(formatTimeToInputValue(record.clock_in));
    setClockOutTime(formatTimeToInputValue(record.clock_out));
    setStatus(record.status || "Hadir");
    setGrade(record.grade || "auto");
    setNotes(record.notes || "");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    await updateMutation.mutateAsync({
      id: editingRecord.id,
      data: {
        clock_in: clockInTime.trim() || null,
        clock_out: clockOutTime.trim() || null,
        status,
        grade: grade === "auto" ? "" : grade,
        notes: notes.trim() || null,
      },
    });

    setEditingRecord(null);
  };

  const filteredAttendances = attendances.filter((record) => {
    if (startDate && record.date < startDate) return false;
    if (endDate && record.date > endDate) return false;
    if (statusFilter !== "Semua Status" && record.status !== statusFilter) return false;
    if (gradeFilter !== "Semua Grade" && record.grade !== gradeFilter) return false;
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
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
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

          <div className="w-full sm:w-40">
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="h-9 text-xs w-full">
                <SelectValue placeholder="Semua Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua Grade">Semua Grade</SelectItem>
                <SelectItem value="Disiplin">Disiplin</SelectItem>
                <SelectItem value="Tepat Waktu">Tepat Waktu</SelectItem>
                <SelectItem value="Toleransi Terlambat">Toleransi Terlambat</SelectItem>
                <SelectItem value="Terlambat">Terlambat</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
                <th className="px-4 py-2.5 font-medium text-sm">Karyawan</th>
                <th className="px-4 py-2.5 font-medium text-sm">Tanggal</th>
                <th className="px-4 py-2.5 font-medium text-sm">Absen Masuk</th>
                <th className="px-4 py-2.5 font-medium text-sm">Absen Keluar</th>
                <th className="px-4 py-2.5 font-medium text-sm">Grade</th>
                <th className="px-4 py-2.5 font-medium text-sm min-w-[250px]">Keterangan</th>
                <th className="px-4 py-2.5 font-medium text-sm">Status</th>
                <th className="px-4 py-2.5 font-medium text-sm text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendances.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">
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
                      {record.status === "Izin"
                        ? (!record.clock_in ? "Fullday Permission" : `Hadir (${new Date(record.clock_in).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })})`)
                        : record.clock_in 
                          ? `Hadir (${new Date(record.clock_in).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })})` 
                          : record.status === "Libur" ? "Tidak Ada Absen" : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {record.status === "Izin"
                        ? (!record.clock_in ? "Fullday Permission" : "Halfday Permission")
                        : record.clock_out 
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
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
                        onClick={() => handleOpenEdit(record)}
                        title="Ubah Jam Kehadiran"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog Edit Jam Kehadiran */}
      <Dialog open={!!editingRecord} onOpenChange={(open) => !open && setEditingRecord(null)}>
        <DialogContent className="max-w-lg w-[95%] sm:w-full max-h-[90vh] overflow-y-auto no-scrollbar">
          <DialogHeader>
            <DialogTitle>Ubah Jam Kehadiran Karyawan</DialogTitle>
            <DialogDescription>
              Sesuaikan jam absen masuk dan pulang karyawan jika terjadi server down atau kendala teknis.
            </DialogDescription>
          </DialogHeader>

          {editingRecord && (
            <form onSubmit={handleSaveEdit} className="space-y-4 py-2">
              {/* Employee & Date Info Card */}
              <div className="bg-muted/40 border border-border/60 rounded-xl p-3.5 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Karyawan:</span>
                  <span className="font-bold text-foreground">{editingRecord.user?.name || "Unknown"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">No. Telepon:</span>
                  <span className="font-medium text-foreground">{editingRecord.user?.phone || "-"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tanggal Absensi:</span>
                  <span className="font-bold text-foreground">
                    {new Date(editingRecord.date).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Jam Masuk & Jam Keluar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="clockIn" className="text-xs font-semibold">
                    Jam Absen Masuk
                  </Label>
                  <Input
                    id="clockIn"
                    type="time"
                    value={clockInTime}
                    onChange={(e) => setClockInTime(e.target.value)}
                    className="h-9 text-xs"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Format: HH:mm (contoh: 08:00)
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="clockOut" className="text-xs font-semibold">
                    Jam Absen Keluar (Pulang)
                  </Label>
                  <Input
                    id="clockOut"
                    type="time"
                    value={clockOutTime}
                    onChange={(e) => setClockOutTime(e.target.value)}
                    className="h-9 text-xs"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Format: HH:mm (contoh: 17:00)
                  </p>
                </div>
              </div>

              {/* Status & Grade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="statusSelect" className="text-xs font-semibold">
                    Status Kehadiran
                  </Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="statusSelect" className="h-9 text-xs w-full">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hadir" className="text-xs">Hadir</SelectItem>
                      <SelectItem value="Proses" className="text-xs">Proses (Belum Pulang)</SelectItem>
                      <SelectItem value="Izin" className="text-xs">Izin</SelectItem>
                      <SelectItem value="Libur" className="text-xs">Libur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="gradeSelect" className="text-xs font-semibold">
                    Grade Kehadiran
                  </Label>
                  <Select value={grade} onValueChange={setGrade}>
                    <SelectTrigger id="gradeSelect" className="h-9 text-xs w-full">
                      <SelectValue placeholder="Pilih grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto" className="text-xs">Otomatis (Sesuai Jam Masuk)</SelectItem>
                      <SelectItem value="Disiplin" className="text-xs">Disiplin (s/d 07:50)</SelectItem>
                      <SelectItem value="Tepat Waktu" className="text-xs">Tepat Waktu (07:51 - 08:00)</SelectItem>
                      <SelectItem value="Toleransi Terlambat" className="text-xs">Toleransi Terlambat (08:01 - 08:10)</SelectItem>
                      <SelectItem value="Terlambat" className="text-xs">Terlambat (&gt; 08:10)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <Label htmlFor="editNotes" className="text-xs font-semibold">
                  Keterangan / Catatan Penyesuaian
                </Label>
                <Textarea
                  id="editNotes"
                  placeholder="Contoh: Server down, jam masuk disesuaikan admin ke 08:00"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="text-xs min-h-[70px] resize-none"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingRecord(null)}
                  disabled={updateMutation.isPending}
                  className="h-8 text-xs px-3"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={updateMutation.isPending}
                  className="h-8 text-xs px-4"
                >
                  {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
