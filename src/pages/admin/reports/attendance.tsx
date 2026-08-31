import { useState } from "react";
import { useAllAttendance } from "@/features/attendance/hooks/use-attendance";
import { useOvertimes } from "@/features/overtime/hooks/use-overtimes";
import { getUserData } from "@/lib/auth-utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, CalendarCheck, TrendingUp, DollarSign, Clock } from "lucide-react";
import { format } from "date-fns";
import { generateAttendanceReportPDF, type AttendanceReportItem } from "@/features/attendance/utils/generate-report-pdf";
import { toast } from "sonner";

export function AdminAttendanceReportPage() {
  const { attendances = [], isLoading: isAttendanceLoading } = useAllAttendance();
  const { data: overtimes = [], isLoading: isOvertimeLoading } = useOvertimes();
  const currentUser = getUserData();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const isLoading = isAttendanceLoading || isOvertimeLoading;
  const isFilterActive = !!startDate && !!endDate;

  // Filter and construct combined items
  const reportItems: AttendanceReportItem[] = [];

  if (isFilterActive) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // 1. Process dailywork (attendance)
    attendances.forEach((att) => {
      const attDate = new Date(att.date);
      attDate.setHours(0, 0, 0, 0);

      if (attDate >= start && attDate <= end) {
        if (att.status === "Hadir") {
          reportItems.push({
            id: `daily-${att.id}`,
            employeeName: att.user?.name || "-",
            dateStr: att.date,
            workType: "Dailywork",
            clockIn: att.clock_in ? format(new Date(att.clock_in), "HH:mm") : "-",
            clockOut: att.clock_out ? format(new Date(att.clock_out), "HH:mm") : "-",
            tariff: 70000,
            status: "Hadir",
          });
        } else if (att.status === "Izin" && att.clock_in !== null) {
          reportItems.push({
            id: `daily-${att.id}`,
            employeeName: att.user?.name || "-",
            dateStr: att.date,
            workType: "Dailywork",
            clockIn: att.clock_in ? format(new Date(att.clock_in), "HH:mm") : "-",
            clockOut: att.clock_out ? format(new Date(att.clock_out), "HH:mm") : "-",
            tariff: 35000,
            status: "Halfday",
          });
        }
      }
    });

    // 2. Process overtime
    overtimes.forEach((ot) => {
      const otDate = new Date(ot.date);
      otDate.setHours(0, 0, 0, 0);

      if (otDate >= start && otDate <= end) {
        const dateStr = ot.date.split("T")[0];
        reportItems.push({
          id: `overtime-${ot.id}`,
          employeeName: ot.user?.name || "-",
          dateStr: dateStr,
          workType: "Overtime",
          clockIn: ot.start_time ? format(new Date(ot.start_time), "HH:mm") : "-",
          clockOut: ot.end_time ? format(new Date(ot.end_time), "HH:mm") : "-",
          tariff: ot.price,
          status: "Hadir",
        });
      }
    });

    // Sort by date ascending, then employee name
    reportItems.sort((a, b) => {
      const dateA = new Date(a.dateStr).getTime();
      const dateB = new Date(b.dateStr).getTime();
      return dateA - dateB || a.employeeName.localeCompare(b.employeeName);
    });
  }

  // Calculate totals
  const totalDailywork = reportItems
    .filter((i) => i.workType === "Dailywork")
    .reduce((sum, i) => sum + i.tariff, 0);

  const totalOvertime = reportItems
    .filter((i) => i.workType === "Overtime")
    .reduce((sum, i) => sum + i.tariff, 0);

  const totalPayout = totalDailywork + totalOvertime;
  const totalRecords = reportItems.length;

  const handleExportPDF = async () => {
    if (!isFilterActive) return;

    setIsExporting(true);
    const operatorName = currentUser
      ? `${currentUser.role === "admin" ? "Admin" : "Karyawan"} - ${currentUser.name}`
      : "Administrator";

    try {
      await generateAttendanceReportPDF(reportItems, startDate, endDate, operatorName);
      toast.success("Laporan PDF berhasil diunduh");
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengekspor laporan PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const getWorkTypeBadge = (type: "Dailywork" | "Overtime") => {
    if (type === "Dailywork") {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-blue-50 text-blue-700 border-blue-200 uppercase">
          Dailywork
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-purple-50 text-purple-700 border-purple-200 uppercase">
        Overtime
      </span>
    );
  };

  const getStatusBadge = (status: string, workType: "Dailywork" | "Overtime") => {
    if (workType === "Overtime") {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-orange-50 text-orange-700 border-orange-200 uppercase">
          Hadir
        </span>
      );
    }
    switch (status.toLowerCase()) {
      case "hadir":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200 uppercase">
            Hadir
          </span>
        );
      case "halfday":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-amber-50 text-amber-700 border-amber-200 uppercase">
            Halfday
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-gray-50 text-gray-700 border-gray-200 uppercase">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Laporan Rekap Absensi & Lembur</h2>
          <p className="text-muted-foreground text-sm">
            Analisis rekap kehadiran harian (dailywork), lemburan (overtime) karyawan, dan ekspor laporan PDF.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Date Filtering Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3">
          {/* Date Inputs on the Left */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-8 bg-muted/50 border border-border/60 rounded-lg text-[13px] shadow-none focus:bg-background transition-colors w-full sm:w-36"
            />
            <span className="text-muted-foreground/60 text-sm shrink-0 font-medium">-</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              className="h-8 bg-muted/50 border border-border/60 rounded-lg text-[13px] shadow-none focus:bg-background transition-colors w-full sm:w-36"
            />
            {!isFilterActive && (
              <span className="hidden md:inline text-amber-600 dark:text-amber-400 text-[11px] font-medium ml-1">
                💡 Pilih rentang tanggal untuk memuat data laporan & mengaktifkan ekspor PDF
              </span>
            )}
          </div>

          {/* Button Export PDF on the Right */}
          <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto">
            <Button
              size="sm"
              onClick={handleExportPDF}
              disabled={!isFilterActive || isExporting || isLoading || reportItems.length === 0}
              className="h-8 px-3.5 rounded-lg text-[13px] font-medium shrink-0 shadow-sm w-full sm:w-auto flex-none flex items-center justify-center gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              {isExporting ? "Proses Download..." : "Download PDF"}
            </Button>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card className="border-t-4 border-t-blue-500 shadow-sm rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Kehadiran</CardTitle>
              <CalendarCheck className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalRecords}</div>
              <p className="text-xs text-muted-foreground mt-0.5">Kehadiran & Lemburan</p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-green-500 shadow-sm rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Dailywork</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">Rp {totalDailywork.toLocaleString("id-ID")}</div>
              <p className="text-xs text-muted-foreground mt-0.5">Total Gaji Harian</p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-orange-500 shadow-sm rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Overtime</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">Rp {totalOvertime.toLocaleString("id-ID")}</div>
              <p className="text-xs text-muted-foreground mt-0.5">Total Gaji Lemburan</p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-purple-500 shadow-sm rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Grand Total</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">Rp {totalPayout.toLocaleString("id-ID")}</div>
              <p className="text-xs text-muted-foreground mt-0.5">Total Penggajian Karyawan</p>
            </CardContent>
          </Card>
        </div>

        {/* Table Data */}
        <div className="border border-border/60 rounded-xl bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border">
                <TableHead className="font-semibold text-foreground py-3.5">Karyawan</TableHead>
                <TableHead className="font-semibold text-foreground">Tanggal</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Jenis Kerja</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Absen Masuk</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Absen Keluar</TableHead>
                <TableHead className="font-semibold text-foreground text-right">Tarif</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground italic">
                    Sedang memuat data rekap absensi...
                  </td>
                </TableRow>
              ) : !isFilterActive ? (
                <TableRow>
                  <td colSpan={7} className="px-6 py-10 text-center text-muted-foreground italic">
                    Silakan pilih tanggal mulai dan tanggal akhir terlebih dahulu untuk melihat data laporan.
                  </td>
                </TableRow>
              ) : reportItems.length === 0 ? (
                <TableRow>
                  <td colSpan={7} className="px-6 py-10 text-center text-muted-foreground italic">
                    Tidak ada data rekap absensi pada rentang tanggal yang dipilih.
                  </td>
                </TableRow>
              ) : (
                <>
                  {reportItems.map((item) => (
                    <TableRow key={item.id} className="border-b border-border/50 hover:bg-muted/20">
                      <TableCell className="font-semibold text-foreground py-3.5">{item.employeeName}</TableCell>
                      <TableCell>{format(new Date(item.dateStr), "dd MMM yyyy")}</TableCell>
                      <TableCell className="text-center">{getWorkTypeBadge(item.workType)}</TableCell>
                      <TableCell className="text-center font-medium">{item.clockIn}</TableCell>
                      <TableCell className="text-center font-medium">{item.clockOut}</TableCell>
                      <TableCell className="text-right font-bold text-blue-600 dark:text-blue-400">
                        Rp {item.tariff.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-center">{getStatusBadge(item.status, item.workType)}</TableCell>
                    </TableRow>
                  ))}

                  {/* Grand Total Row at the very bottom */}
                  <TableRow className="bg-muted/30 border-t-2 border-border font-bold hover:bg-muted/30">
                    <TableCell colSpan={5} className="py-4 text-foreground uppercase tracking-wide">
                      Grand Total ({totalRecords} Data)
                    </TableCell>
                    <TableCell className="text-right text-blue-600 dark:text-blue-400">
                      Rp {totalPayout.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}