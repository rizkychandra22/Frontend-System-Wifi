import { useState } from "react";
import { type Payment, paymentApi } from "@/lib/api/payment";
import { Button } from "@/components/ui/button";
import { Download, ReceiptText } from "lucide-react";

interface PaymentUserTableProps {
  payments: Payment[];
}

export function PaymentUserTable({ payments }: PaymentUserTableProps) {
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const handleDownloadInvoice = async (paymentId: number, invoiceNumber: string | undefined) => {
    try {
      setDownloadingId(paymentId);
      const filename = invoiceNumber ? `invoice-${invoiceNumber}.pdf` : `invoice-${paymentId}.pdf`;
      await paymentApi.downloadPaymentPDF(paymentId, filename);
    } catch (err) {
      console.error("Gagal mengunduh invoice", err);
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "lunas":
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-700 border-green-200">Lunas</span>;
      case "unpaid":
      case "belum lunas":
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-red-100 text-red-700 border-red-200">Belum Lunas</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-700 border-gray-200">{status}</span>;
    }
  };

  return (
    <div className="bg-card rounded-xl border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground border-b">
            <tr>
              <th className="px-6 py-4 font-medium">No. Invoice</th>
              <th className="px-6 py-4 font-medium">Tanggal</th>
              <th className="px-6 py-4 font-medium">Paket</th>
              <th className="px-6 py-4 font-medium">Total Tagihan</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  <ReceiptText className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  Belum ada riwayat tagihan
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {payment.invoice_number || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(payment.created_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.wifi_package?.name || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    Rp {payment.total_amount.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-xs flex items-center gap-1.5"
                      disabled={downloadingId === payment.id}
                      onClick={() => handleDownloadInvoice(payment.id, payment.invoice_number)}
                    >
                      {downloadingId === payment.id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      Invoice
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
