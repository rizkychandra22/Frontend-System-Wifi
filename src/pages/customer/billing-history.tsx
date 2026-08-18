import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth-utils";
import { paymentApi, type Payment } from "@/lib/api/payment";
import { parseErrorMessage, type ApiErrorResponse } from "@/lib/api-error";
import { PaymentUserTable } from "@/features/payment/components/user/table";
import { PaymentDetail } from "@/features/payment/components/detail";
import { AxiosError } from "axios";

export function CustomerBillingHistoryPage() {

  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const user = getUser();
        if (!user) {
          setError("Silakan login kembali");
          return;
        }

        const data = await paymentApi.getCustomerPayments(user.id);
        setPayments(data);
      } catch (err) {
        setError(parseErrorMessage(err as AxiosError<ApiErrorResponse>));
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Riwayat Pembayaran</h2>
          <p className="text-muted-foreground text-sm">
            Daftar riwayat tagihan & pembayaran paket WiFi Anda.
          </p>
        </div>
      </div>

      {error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          {error}
        </div>
      ) : (
        <PaymentUserTable payments={payments} onView={setSelectedPayment} />
      )}

      <PaymentDetail 
        payment={selectedPayment} 
        isOpen={!!selectedPayment} 
        onOpenChange={(open) => !open && setSelectedPayment(null)} 
      />
    </div>
  );
}
