import { useState } from "react";
import { useAllAttendance, useAttendanceHistory } from "@/features/attendance/hooks/use-attendance";
import { useOvertimes } from "@/features/overtime/hooks/use-overtimes";
import { getUserData } from "@/lib/auth-utils";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Eye, Download } from "lucide-react";
import { generatePayrollSlipPDF, type PayrollSlipPDFData } from "@/features/attendance/utils/generate-payroll-slip-pdf";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PayrollSlipData {
  userId: number;
  employeeName: string;
  monthStr: string; // e.g. "2026-08"
  monthLabel: string; // e.g. "Agustus 2026"
  dailyworkCount: number;
  dailyworkPrice: number;
  overtimeHours: number;
  overtimePrice: number;
  halfdayCount: number;
  halfdayPrice: number;
  izinCount: number;
  grandPrice: number;
  fulldayPermissions: string[];
  halfdayPermissions: string[];
}

export function PayrollSlipPage() {
  const currentUser = getUserData();
  const isAdmin = currentUser?.role === "admin";

  const { attendances: adminAttendances = [], isLoading: isAdminAttendanceLoading } = useAllAttendance();
  const { history: employeeAttendances = [], isLoading: isEmployeeAttendanceLoading } = useAttendanceHistory();
  const { data: overtimes = [], isLoading: isOvertimeLoading } = useOvertimes();

  const [selectedSlip, setSelectedSlip] = useState<PayrollSlipData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");

  const rawAttendances = isAdmin ? adminAttendances : employeeAttendances;
  const isLoading = isOvertimeLoading || (isAdmin ? isAdminAttendanceLoading : isEmployeeAttendanceLoading);

  // Check if today is the 1st of the month
  const isDateOne = new Date().getDate() === 1;

  // Helper date conversions
  const getMonthStr = (dateVal: string) => {
    if (!dateVal) return "";
    const datePart = dateVal.split("T")[0];
    const [year, month] = datePart.split("-");
    return `${year}-${month}`;
  };

  const getMonthLabel = (monthStr: string) => {
    if (!monthStr) return "-";
    const [year, month] = monthStr.split("-");
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  };

  // Aggregate slips
  const slipsMap: Record<string, PayrollSlipData> = {};

  const getOrCreateEntry = (userId: number, employeeName: string, monthStr: string) => {
    const key = `${userId}_${monthStr}`;
    if (!slipsMap[key]) {
      slipsMap[key] = {
        userId,
        employeeName,
        monthStr,
        monthLabel: getMonthLabel(monthStr),
        dailyworkCount: 0,
        dailyworkPrice: 0,
        overtimeHours: 0,
        overtimePrice: 0,
        halfdayCount: 0,
        halfdayPrice: 0,
        izinCount: 0,
        grandPrice: 0,
        fulldayPermissions: [],
        halfdayPermissions: [],
      };
    }
    return slipsMap[key];
  };

  // Group attendance records
  rawAttendances.forEach((att) => {
    if (!att.user) return;
    const userId = att.user_id;
    const employeeName = att.user.name;
    const monthStr = getMonthStr(att.date);
    if (!monthStr) return;

    const entry = getOrCreateEntry(userId, employeeName, monthStr);

    if (att.status === "Hadir") {
      entry.dailyworkCount += 1;
      entry.dailyworkPrice += 70000;
    } else if (att.status === "Izin") {
      if (att.clock_in !== null) {
        entry.halfdayCount += 1;
        entry.halfdayPrice += 35000;
        if (att.notes) {
          entry.halfdayPermissions.push(att.notes);
        }
      } else {
        entry.izinCount += 1;
        if (att.notes) {
          entry.fulldayPermissions.push(att.notes);
        }
      }
    }
  });

  // Group overtime records
  overtimes.forEach((ot) => {
    const userId = ot.user_id;
    const employeeName = ot.user?.name || "Karyawan";
    const monthStr = getMonthStr(ot.date);
    if (!monthStr) return;

    const entry = getOrCreateEntry(userId, employeeName, monthStr);

    if (ot.start_time && ot.end_time) {
      const start = new Date(ot.start_time);
      const end = new Date(ot.end_time);
      const diffMs = end.getTime() - start.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      const roundedHours = Math.round(diffHours * 10) / 10;
      entry.overtimeHours += roundedHours;
    }
    entry.overtimePrice += ot.price;
  });

  // Convert map to list and calculate grand total
  const allSlips = Object.values(slipsMap).map((entry) => {
    entry.grandPrice = entry.dailyworkPrice + entry.overtimePrice + entry.halfdayPrice;
    return entry;
  });

  // Get unique months list for filtering dropdown (only unique values, sorted descending)
  const uniqueMonths = Array.from(new Set(allSlips.map((s) => s.monthStr))).sort((a, b) =>
    b.localeCompare(a)
  );

  // Filter slips based on search query and selected month
  const filteredSlips = allSlips.filter((slip) => {
    if (searchQuery.trim()) {
      const nameMatch = slip.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
      if (!nameMatch) return false;
    }
    if (selectedMonth !== "all") {
      if (slip.monthStr !== selectedMonth) return false;
    }
    return true;
  });

  // Sort: month descending, then employee name
  filteredSlips.sort((a, b) => b.monthStr.localeCompare(a.monthStr) || a.employeeName.localeCompare(b.employeeName));

  // Determine what slips to display
  // If employee: only show slips if today is the 1st of the month.
  const displaySlips = isAdmin ? filteredSlips : isDateOne ? filteredSlips : [];

  const handleDownloadPDF = async (slip: PayrollSlipData) => {
    if (!isDateOne) {
      toast.error("Unduh slip gaji hanya dapat dilakukan pada tanggal 1 setiap awal bulan.");
      return;
    }

    setIsDownloading(true);
    const operatorName = currentUser
      ? `${currentUser.role === "admin" ? "Admin" : "Karyawan"} - ${currentUser.name}`
      : "Administrator";

    try {
      const pdfData: PayrollSlipPDFData = {
        employeeName: slip.employeeName,
        monthStr: slip.monthStr,
        monthLabel: slip.monthLabel,
        dailyworkCount: slip.dailyworkCount,
        dailyworkPrice: slip.dailyworkPrice,
        overtimeHours: slip.overtimeHours,
        overtimePrice: slip.overtimePrice,
        halfdayCount: slip.halfdayCount,
        halfdayPrice: slip.halfdayPrice,
        izinCount: slip.izinCount,
        grandPrice: slip.grandPrice,
        fulldayPermissions: slip.fulldayPermissions,
        halfdayPermissions: slip.halfdayPermissions,
      };

      await generatePayrollSlipPDF(pdfData, operatorName);
      toast.success("Slip gaji PDF berhasil diunduh");
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengunduh slip gaji PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          Laporan Slip Gaji
        </h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          {isAdmin
            ? "Kelola slip gaji bulanan karyawan, lihat rincian pendapatan harian, lembur, dan izin."
            : "Lihat slip gaji bulanan Anda beserta rincian pendapatan kerja dan lembur."}
        </p>
      </div>

      <div className="space-y-4">
        {/* Admin Filters: Search and Select Month */}
        {isAdmin && (
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            {/* Search by Name (Left) */}
            <div className="w-full sm:w-72">
              <Input
                placeholder="Cari nama karyawan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 bg-muted/50 border border-border/60 rounded-lg text-[13px] shadow-none focus:bg-background transition-colors w-full"
              />
            </div>

            {/* Select Month (Right) */}
            <div className="w-full sm:w-48">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="h-8 bg-muted/50 border border-border/60 rounded-lg text-[13px] shadow-none focus:bg-background transition-colors w-full">
                  <SelectValue placeholder="Pilih Bulan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-[13px]">Semua Bulan</SelectItem>
                  {uniqueMonths.map((m) => (
                    <SelectItem key={m} value={m} className="text-[13px]">
                      {getMonthLabel(m)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Table Data Container */}
        <div className="border border-border/60 rounded-xl bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border">
                {isAdmin && <TableHead className="font-semibold text-foreground py-3.5">Karyawan</TableHead>}
                <TableHead className="font-semibold text-foreground py-3.5">Bulan</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Dailywork</TableHead>
                <TableHead className="font-semibold text-foreground text-right">Price Dailywork</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Overtime (Jam)</TableHead>
                <TableHead className="font-semibold text-foreground text-right">Price Overtime</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Halfday</TableHead>
                <TableHead className="font-semibold text-foreground text-right">Price Halfday</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Izin</TableHead>
                <TableHead className="font-semibold text-foreground text-right">Grand Price</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <td colSpan={isAdmin ? 11 : 10} className="px-6 py-8 text-center text-muted-foreground italic">
                    Sedang memuat data slip gaji...
                  </td>
                </TableRow>
              ) : displaySlips.length === 0 ? (
                <TableRow>
                  <td colSpan={isAdmin ? 11 : 10} className="px-6 py-10 text-center text-muted-foreground italic">
                    {!isAdmin && !isDateOne
                      ? "Slip gaji bulanan Anda akan terbit dan dapat diunduh pada tanggal 1 setiap awal bulan."
                      : "Tidak ada data slip gaji yang tersedia."}
                  </td>
                </TableRow>
              ) : (
                displaySlips.map((slip) => (
                  <TableRow key={`${slip.userId}_${slip.monthStr}`} className="border-b border-border/50 hover:bg-muted/20">
                    {isAdmin && <TableCell className="font-semibold text-foreground py-3.5">{slip.employeeName}</TableCell>}
                    <TableCell className={isAdmin ? "" : "font-semibold py-3.5"}>{slip.monthLabel}</TableCell>
                    <TableCell className="text-center font-medium">{slip.dailyworkCount} Hari</TableCell>
                    <TableCell className="text-right font-bold text-foreground">
                      Rp {slip.dailyworkPrice.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-center font-medium">{slip.overtimeHours} Jam</TableCell>
                    <TableCell className="text-right font-bold text-foreground">
                      Rp {slip.overtimePrice.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-center font-medium">{slip.halfdayCount} Hari</TableCell>
                    <TableCell className="text-right font-bold text-foreground">
                      Rp {slip.halfdayPrice.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-center font-medium">{slip.izinCount} Hari</TableCell>
                    <TableCell className="text-right font-bold text-blue-600 dark:text-blue-400">
                      Rp {slip.grandPrice.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSelectedSlip(slip)}
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Slip Detail Sheet Preview */}
      <Sheet open={!!selectedSlip} onOpenChange={(open) => !open && setSelectedSlip(null)}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader className="pb-4 border-b border-border">
            <SheetTitle className="text-lg font-bold flex items-center gap-2">
              Rincian Slip Gaji
            </SheetTitle>
            <SheetDescription className="text-xs">
              Preview slip gaji formal NetVerse Fiber Staff Portal.
            </SheetDescription>
          </SheetHeader>

          {selectedSlip && (
            <div className="py-6 space-y-6">
              {/* Slip Metadata Card */}
              <div className="bg-muted/40 border border-border/50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Karyawan:</span>
                  <span className="font-bold text-foreground">{selectedSlip.employeeName}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Bulan Penggajian:</span>
                  <span className="font-bold text-foreground">{selectedSlip.monthLabel}</span>
                </div>
              </div>

              {/* Earnings Breakdown */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Rincian Pendapatan</h4>
                <div className="border border-border/60 rounded-xl overflow-hidden bg-card">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/40 border-b border-border">
                        <th className="p-3 font-semibold text-foreground">Deskripsi Pekerjaan</th>
                        <th className="p-3 font-semibold text-foreground text-center">Kuantitas</th>
                        <th className="p-3 font-semibold text-foreground text-right">Tarif</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/40">
                        <td className="p-3 text-muted-foreground">Kehadiran Harian (Dailywork)</td>
                        <td className="p-3 text-center font-medium">{selectedSlip.dailyworkCount} Hari</td>
                        <td className="p-3 text-right font-bold text-foreground">
                          Rp {selectedSlip.dailyworkPrice.toLocaleString("id-ID")}
                        </td>
                      </tr>
                      <tr className="border-b border-border/40">
                        <td className="p-3 text-muted-foreground">Kerja Lembur (Overtime)</td>
                        <td className="p-3 text-center font-medium">{selectedSlip.overtimeHours} Jam</td>
                        <td className="p-3 text-right font-bold text-foreground">
                          Rp {selectedSlip.overtimePrice.toLocaleString("id-ID")}
                        </td>
                      </tr>
                      <tr className="border-b border-border/40">
                        <td className="p-3 text-muted-foreground">Setengah Hari (Halfday)</td>
                        <td className="p-3 text-center font-medium">{selectedSlip.halfdayCount} Hari</td>
                        <td className="p-3 text-right font-bold text-foreground">
                          Rp {selectedSlip.halfdayPrice.toLocaleString("id-ID")}
                        </td>
                      </tr>
                      <tr className="border-b border-border/40">
                        <td className="p-3 text-muted-foreground">Izin Penuh (Fullday)</td>
                        <td className="p-3 text-center font-medium">{selectedSlip.izinCount} Hari</td>
                        <td className="p-3 text-right"><span className="italic text-muted-foreground">Tidak ada</span></td>
                      </tr>
                      <tr className="font-bold bg-muted/20">
                        <td colSpan={2} className="p-3 text-foreground uppercase">Grand Total Penerimaan</td>
                        <td className="p-3 text-right text-blue-600 dark:text-blue-400 text-sm">
                          Rp {selectedSlip.grandPrice.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Permission Notes Section */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Daftar Keterangan Izin</h4>
                <div className="border border-border/60 bg-muted/25 rounded-xl">
                  <div className="p-4 space-y-4 text-xs">
                    {/* A. Fullday Permissions */}
                    <div>
                      <div className="font-bold text-foreground">A. Fullday Permission (Izin Satu Hari Penuh):</div>
                      {selectedSlip.fulldayPermissions.length > 0 ? (
                        <ol className="list-decimal pl-4 mt-1.5 space-y-1 text-muted-foreground leading-relaxed">
                          {selectedSlip.fulldayPermissions.map((note, index) => (
                            <li key={index}>{note}</li>
                          ))}
                        </ol>
                      ) : (
                        <p className="italic text-muted-foreground/60 mt-1 pl-4">Tidak ada izin fullday</p>
                      )}
                    </div>

                    {/* B. Halfday Permissions */}
                    <div>
                      <div className="font-bold text-foreground">B. Halfday Permission (Izin Setengah Hari Kerja):</div>
                      {selectedSlip.halfdayPermissions.length > 0 ? (
                        <ol className="list-decimal pl-4 mt-1.5 space-y-1 text-muted-foreground leading-relaxed">
                          {selectedSlip.halfdayPermissions.map((note, index) => (
                            <li key={index}>{note}</li>
                          ))}
                        </ol>
                      ) : (
                        <p className="italic text-muted-foreground/60 mt-1 pl-4">Tidak ada izin halfday</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button inside Sheet */}
              <div className="pt-4 border-t border-border space-y-2">
                <Button
                  onClick={() => handleDownloadPDF(selectedSlip)}
                  disabled={isDownloading || !isDateOne}
                  className="w-full h-10 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {isDownloading ? "Proses Download..." : "Download Slip Gaji (PDF)"}
                </Button>
                
                {!isDateOne && (
                  <p className="text-[11px] text-center text-amber-600 dark:text-amber-400 font-medium">
                    ⚠️ Download Slip Gaji hanya dapat dilakukan pada tanggal 1 setiap awal bulan.
                  </p>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}