import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fingerprint, CalendarCheck, FileText } from "lucide-react";
import { useTodayAttendance, useAttendanceHistory } from "@/features/attendance/hooks/use-attendance";

export function EmployeeDashboardStats() {
  const { todayAttendance } = useTodayAttendance();
  const { history } = useAttendanceHistory();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthHistory = history.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
  });

  const totalHadir = thisMonthHistory.filter(r => r.status === "Hadir" || r.status === "Proses").length;
  const totalIzin = thisMonthHistory.filter(r => r.status === "Izin").length;

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const liburRecords = [...history]
    .filter(r => r.status === "Libur")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const latestLibur = liburRecords.length > 0 ? liburRecords[0] : null;

  let liburText = "Kerja Aktif, Jangan lupa masuk!!";
  let liburSubtext = "Belum ada info libur dari sistem";

  if (latestLibur) {
    const liburDate = new Date(latestLibur.date);
    liburDate.setHours(0, 0, 0, 0);
    const diffTime = todayDate.getTime() - liburDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      liburText = "Hari ini dinyatakan libur";
      liburSubtext = latestLibur.notes || "Selamat beristirahat!";
    } else if (diffDays === 1) {
      liburText = "Telah libur 1 hari yang lalu";
      liburSubtext = latestLibur.notes || "Ditetapkan oleh sistem";
    } else if (diffDays > 1 && diffDays <= 5) {
      liburText = `Telah libur ${diffDays} hari yang lalu`;
      liburSubtext = latestLibur.notes || "Ditetapkan oleh sistem";
    }
  }

  const getTodayStatus = () => {
    let isLibur = false;
    if (latestLibur) {
      const liburDate = new Date(latestLibur.date);
      liburDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((todayDate.getTime() - liburDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) {
        isLibur = true;
      }
    }

    if (isLibur) {
      return { value: "Libur", subtext: "Selamat beristirahat!" };
    }

    if (!todayAttendance) {
      return { value: "Belum Absen", subtext: "Jangan lupa absen hari ini!" };
    }

    return { value: "Sudah Absen", subtext: "Selamat bekerja!" };
  };

  const todayStatus = getTodayStatus();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card className="border-t-4 border-t-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status Hari Ini</CardTitle>
          <Fingerprint className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayStatus.value}</div>
          <p className="text-xs text-muted-foreground">{todayStatus.subtext}</p>
        </CardContent>
      </Card>

      <Card className="border-t-4 border-t-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Riwayat Kehadiran</CardTitle>
          <CalendarCheck className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">{totalHadir} Hadir — {totalIzin} Izin</div>
          <p className="text-xs text-muted-foreground">Bulan ini</p>
        </CardContent>
      </Card>

      <Card className="border-t-4 border-t-orange-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pengumuman Libur</CardTitle>
          <FileText className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold truncate" title={liburText}>{liburText}</div>
          <p className="text-xs text-muted-foreground truncate" title={liburSubtext}>{liburSubtext}</p>
        </CardContent>
      </Card>
    </div>
  );
}
