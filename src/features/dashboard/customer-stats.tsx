import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth-utils";
import { customerApi } from "@/lib/api/customer";
import { paymentApi, type Payment } from "@/lib/api/payment";
import { type Subscription } from "@/lib/api/subscription";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, ReceiptText, CheckCircle2 } from "lucide-react";
import { CustomerPaymentMethods } from "./components/payment-methods";

export function CustomerDashboardStats() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = getUser();
        if (!user) return;
        
        const [subData, payData] = await Promise.all([
          customerApi.getCustomerSubscription(user.id).catch(() => null),
          paymentApi.getCustomerPayments(user.id).catch(() => [])
        ]);
        
        setSubscription(subData);
        setPayments(payData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const unpaidCount = payments.filter(p => p.status.toLowerCase() !== "paid" && p.status.toLowerCase() !== "lunas").length;
  const paidCount = payments.filter(p => p.status.toLowerCase() === "paid" || p.status.toLowerCase() === "lunas").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-t-4 border-t-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paket Aktif</CardTitle>
            <Wifi className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold truncate">{subscription ? subscription.wifi_package?.name : "Belum Berlangganan"}</div>
            <p className="text-xs text-muted-foreground">{subscription ? `Rp ${subscription.wifi_package?.price.toLocaleString("id-ID")} / bulan` : "Silakan pilih paket yang tersedia"}</p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tagihan Tertunda</CardTitle>
            <ReceiptText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unpaidCount} Tagihan</div>
            <p className="text-xs text-muted-foreground">{unpaidCount > 0 ? "Segera lunasi tagihan pembayaran Anda" : "Anda tidak memiliki tagihan yang tertunda"}</p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Riwayat Pembayaran</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidCount} Transaksi</div>
            <p className="text-xs text-muted-foreground">{paidCount > 0 ? "Pembayaran yang telah berhasil" : "Anda tidak memiliki riwayat pembayaran"}</p>
          </CardContent>
        </Card>
      </div>
      
      <CustomerPaymentMethods />
    </div>
  );
}
