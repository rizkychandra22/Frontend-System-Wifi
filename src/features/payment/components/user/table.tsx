import { type Payment } from "@/lib/api/payment";
import { Button } from "@/components/ui/button";
import { ReceiptText } from "lucide-react";

interface PaymentUserTableProps {
  payments: Payment[];
  onView: (payment: Payment) => void;
}

export function PaymentUserTable({ payments, onView }: PaymentUserTableProps) {

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

  const getPaymentMethodBadge = (method?: string) => {
    switch (method?.toLowerCase()) {
      case "cash":
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-700 border-green-200">Cash</span>;
      case "bca":
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-blue-100 text-blue-800 border-blue-200">BCA</span>;
      case "qris":
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-red-100 text-red-700 border-red-200">Qris</span>;
      case "dana":
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-blue-50 text-blue-500 border-blue-200">Dana</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-700 border-gray-200">{method || "-"}</span>;
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
              <th className="px-6 py-4 font-medium">Tagihan</th>
              <th className="px-6 py-4 font-medium">Metode Bayar</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
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
                    {getPaymentMethodBadge(payment.payment_method)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-xs flex items-center gap-1.5"
                      onClick={() => onView(payment)}
                    >
                      <ReceiptText className="w-3.5 h-3.5" />
                      Detail
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
