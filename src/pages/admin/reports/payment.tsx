import { useState } from "react";
import { useAllPayments } from "@/features/payment/hooks/use-payments";
import { getUserData } from "@/lib/auth-utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp, DollarSign, Percent, TrendingUp, Receipt } from "lucide-react";
import { format } from "date-fns";
import { generatePaymentsReportPDF } from "@/features/payment/utils/generate-report-pdf";
import { toast } from "sonner";

export function PaymentsReportPage() {
  const { data: payments = [], isLoading } = useAllPayments();
  const currentUser = getUserData();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // Filter payments based on date range
  const filteredPayments = payments.filter((payment) => {
    if (!startDate || !endDate) return false; // Jangan berikan data dulu jika belum memilih tanggal nya

    const paymentDate = new Date(payment.created_at);
    
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return paymentDate >= start && paymentDate <= end;
  });

  // Calculate totals
  const totalPackagePrice = filteredPayments.reduce((sum, p) => sum + p.package_price, 0);
  const totalPpn = filteredPayments.reduce((sum, p) => sum + p.ppn, 0);
  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.total_amount, 0);
  const totalTransactions = filteredPayments.length;

  const isFilterActive = !!startDate && !!endDate;

  const handleExportPDF = async () => {
    if (!isFilterActive) return;
    
    setIsExporting(true);
    const operatorName = currentUser
      ? `${currentUser.role === "admin" ? "Admin" : "Karyawan"} - ${currentUser.name}`
      : "Administrator";

    try {
      await generatePaymentsReportPDF(filteredPayments, startDate, endDate, operatorName);
      toast.success("Laporan PDF berhasil diunduh");
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengekspor laporan PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const getPaymentMethodBadge = (method?: string) => {
    switch (method?.toLowerCase()) {
      case "cash":
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">Cash</span>;
      case "bca":
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-blue-50 text-blue-700 border-blue-200">BCA</span>;
      case "qris":
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-rose-50 text-rose-700 border-rose-200">QRIS</span>;
      case "dana":
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-sky-50 text-sky-600 border-sky-200">DANA</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-gray-50 text-gray-600 border-gray-200">{method || "-"}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Laporan Transaksi Pembayaran</h2>
          <p className="text-muted-foreground text-sm">
            Analisis data transaksi bulanan pelanggan, filter rentang tanggal, dan ekspor laporan PDF.
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
              disabled={!isFilterActive || isExporting || isLoading || filteredPayments.length === 0}
              className="h-8 px-3.5 rounded-lg text-[13px] font-medium shrink-0 shadow-sm w-full sm:w-auto flex-none flex items-center justify-center gap-1.5"
            >
              <FileUp className="h-3.5 w-3.5" />
              {isExporting ? "Mengekspor..." : "Ekspor PDF"}
            </Button>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card className="border-t-4 border-t-blue-500 shadow-sm rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Transaksi</CardTitle>
              <Receipt className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalTransactions}</div>
              <p className="text-xs text-muted-foreground mt-0.5">Total transaksi bulanan</p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-green-500 shadow-sm rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Hasil Bersih</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">Rp {totalPackagePrice.toLocaleString("id-ID")}</div>
              <p className="text-xs text-muted-foreground mt-0.5">Sesudah potongan PPN</p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-orange-500 shadow-sm rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total PPN</CardTitle>
              <Percent className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">Rp {totalPpn.toLocaleString("id-ID")}</div>
              <p className="text-xs text-muted-foreground mt-0.5">Potongan pajak 11%</p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-purple-500 shadow-sm rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Hasil Kotor</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">Rp {totalAmount.toLocaleString("id-ID")}</div>
              <p className="text-xs text-muted-foreground mt-0.5">Total pembayaran</p>
            </CardContent>
          </Card>
        </div>

        {/* Table Data */}
        <div className="border border-border/60 rounded-xl bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border">
                <TableHead className="font-semibold text-foreground py-3.5">Invoice</TableHead>
                <TableHead className="font-semibold text-foreground">Tanggal</TableHead>
                <TableHead className="font-semibold text-foreground">Pelanggan</TableHead>
                <TableHead className="font-semibold text-foreground">Paket Layanan</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Metode</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Status</TableHead>
                <TableHead className="font-semibold text-foreground text-right">PPN (11%)</TableHead>
                <TableHead className="font-semibold text-foreground text-right">Total Bayar</TableHead>
                <TableHead className="font-semibold text-foreground">Dibuat Oleh</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <td colSpan={9} className="px-6 py-8 text-center text-muted-foreground italic">
                    Sedang memuat data transaksi pembayaran...
                  </td>
                </TableRow>
              ) : !isFilterActive ? (
                <TableRow>
                  <td colSpan={9} className="px-6 py-10 text-center text-muted-foreground italic">
                    Silakan pilih tanggal mulai dan tanggal akhir terlebih dahulu untuk melihat data laporan.
                  </td>
                </TableRow>
              ) : filteredPayments.length === 0 ? (
                <TableRow>
                  <td colSpan={9} className="px-6 py-10 text-center text-muted-foreground italic">
                    Tidak ada data transaksi pembayaran pada rentang tanggal yang dipilih.
                  </td>
                </TableRow>
              ) : (
                <>
                  {filteredPayments.map((p) => {
                    const invoiceNumber = p.invoice_number || `INV-${p.id.toString().padStart(4, "0")}`;
                    return (
                      <TableRow key={p.id} className="border-b border-border/50 hover:bg-muted/20">
                        <TableCell className="font-semibold text-foreground py-3.5">{invoiceNumber}</TableCell>
                        <TableCell>{format(new Date(p.created_at), "dd MMM yyyy")}</TableCell>
                        <TableCell>
                          <div className="font-semibold text-foreground">{p.customer?.name || "-"}</div>
                          <div className="text-xs text-muted-foreground">{p.customer?.phone || "-"}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-foreground">{p.wifi_package?.name || "-"}</div>
                          <div className="text-xs text-muted-foreground">Rp {p.package_price.toLocaleString("id-ID")}</div>
                        </TableCell>
                        <TableCell className="text-center">{getPaymentMethodBadge(p.payment_method)}</TableCell>
                        <TableCell className="text-center">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200 uppercase">
                            {p.status || "paid"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-bold text-foreground">Rp {p.ppn.toLocaleString("id-ID")}</TableCell>
                        <TableCell className="text-right font-bold text-blue-600 dark:text-blue-400">Rp {p.total_amount.toLocaleString("id-ID")}</TableCell>
                        <TableCell className="text-xs">
                          {p.created_by
                            ? `${p.created_by.role === "admin" ? "Admin" : "Karyawan"} - ${p.created_by.name}`
                            : "-"}
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {/* Grand Total Row at the very bottom */}
                  <TableRow className="bg-muted/30 border-t-2 border-border font-bold hover:bg-muted/30">
                    <TableCell colSpan={6} className="py-4 text-foreground uppercase tracking-wide">
                      Grand Total ({totalTransactions} Transaksi)
                    </TableCell>
                    <TableCell className="text-right text-foreground">
                      Rp {totalPpn.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-right text-blue-600 dark:text-blue-400">
                      Rp {totalAmount.toLocaleString("id-ID")}
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