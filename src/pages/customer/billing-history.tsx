import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth-utils";
import { paymentApi, type Payment } from "@/lib/api/payment";
import { parseErrorMessage, type ApiErrorResponse } from "@/lib/api-error";
import { Download, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AxiosError } from "axios";

export function CustomerBillingHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const user = getUser();
        if (!user) {
          setError("Silakan login kembali");
          setIsLoading(false);
          return;
        }

        const data = await paymentApi.getCustomerPayments(user.id);
        setPayments(data);
      } catch (err) {
        setError(parseErrorMessage(err as AxiosError<ApiErrorResponse>));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Riwayat Tagihan</h1>
        <p className="text-muted-foreground">
          Daftar riwayat pembayaran paket WiFi Anda.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          {error}
        </div>
      ) : (
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
      )}
    </div>
  );
}
