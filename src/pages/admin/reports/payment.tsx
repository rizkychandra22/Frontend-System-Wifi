import { useState } from "react";
import { useAllPayments } from "@/features/payment/hooks/use-payments";
import { getUserData } from "@/lib/auth-utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { FileDown, Calendar, DollarSign, Percent, TrendingUp, Receipt } from "lucide-react";
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
    if (!startDate || !endDate) return true; // Show all by default

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

      {/* Date Filtering Bar */}
      <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="space-y-1.5 flex-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tanggal Mulai</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/75" />
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-9 h-9 border border-border/80 rounded-lg text-sm bg-background/50 focus:bg-background shadow-none"
                />
              </div>
            </div>
            <div className="space-y-1.5 flex-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tanggal Akhir</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/75" />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="pl-9 h-9 border border-border/80 rounded-lg text-sm bg-background/50 focus:bg-background shadow-none"
                />
              </div>
            </div>
          </div>
          <div className="shrink-0">
            <Button
              onClick={handleExportPDF}
              disabled={!isFilterActive || isExporting || isLoading || filteredPayments.length === 0}
              className="h-9 w-full md:w-auto px-5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-sm shrink-0"
            >
              <FileDown className="h-4 w-4" />
              {isExporting ? "Mengekspor..." : "Ekspor PDF"}
            </Button>
          </div>
        </div>
        {!isFilterActive && (
          <p className="text-amber-600 dark:text-amber-400 text-[11px] font-medium mt-3 flex items-center gap-1.5">
            💡 Tentukan "Tanggal Mulai" dan "Tanggal Akhir" terlebih dahulu untuk mengaktifkan tombol ekspor PDF.
          </p>
        )}
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border/60 shadow-sm rounded-xl bg-card overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Transaksi</span>
              <h3 className="text-2xl font-bold text-foreground">{totalTransactions}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center border border-blue-100 dark:border-blue-900">
              <Receipt className="h-5 w-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 shadow-sm rounded-xl bg-card overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pendapatan Bersih</span>
              <h3 className="text-2xl font-bold text-foreground">Rp {totalPackagePrice.toLocaleString("id-ID")}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center border border-emerald-100 dark:border-emerald-900">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 shadow-sm rounded-xl bg-card overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">PPN Terkumpul</span>
              <h3 className="text-2xl font-bold text-foreground">Rp {totalPpn.toLocaleString("id-ID")}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950 flex items-center justify-center border border-amber-100 dark:border-amber-900">
              <Percent className="h-5 w-5 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 shadow-sm rounded-xl bg-card overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pendapatan Kotor</span>
              <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Rp {totalAmount.toLocaleString("id-ID")}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center border border-blue-200">
              <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
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
            ) : filteredPayments.length === 0 ? (
              <TableRow>
                <td colSpan={9} className="px-6 py-8 text-center text-muted-foreground italic">
                  Tidak ada data transaksi pembayaran yang terdaftar.
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
  );
}