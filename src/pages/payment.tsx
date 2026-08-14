import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customerApi } from "@/lib/api/customer";
import type { Customer } from "@/lib/api/customer";
import { wifiServiceApi } from "@/lib/api/wifi_service";
import type { WifiService } from "@/lib/api/wifi_service";
import { paymentApi } from "@/lib/api/payment";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function PaymentsPage() {
  const queryClient = useQueryClient();
  const [customerId, setCustomerId] = useState<number | "">("");
  const [wifiServiceId, setWifiServiceId] = useState<number | "">("");

  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: customerApi.getCustomers,
  });

  const { data: services = [] } = useQuery({
    queryKey: ["wifi-services"],
    queryFn: wifiServiceApi.getWifiServices,
  });

  const createMutation = useMutation({
    mutationFn: paymentApi.createPayment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Pembayaran berhasil dicatat");
      setCustomerId("");
      setWifiServiceId("");
      paymentApi.downloadPaymentPDF(data.id);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err?.response?.data?.error || "Gagal mencatat pembayaran");
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !wifiServiceId) return;
    createMutation.mutate({ customer_id: Number(customerId), wifi_service_id: Number(wifiServiceId) });
  };

  const selectedService = services.find(s => s.id === Number(wifiServiceId));
  const totalAmount = selectedService ? selectedService.price : 0;
  const ppn = totalAmount * 0.11;
  const packagePrice = totalAmount - ppn;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Input Pembayaran WiFi</h1>
        <p className="text-muted-foreground">Catat tagihan pembayaran bulanan customer.</p>
      </div>
      
      <div className="rounded-xl border bg-card p-6 shadow-sm max-w-2xl">
        <form onSubmit={handleAdd} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Customer</label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={customerId} 
              onChange={e => setCustomerId(Number(e.target.value) || "")} 
              required
            >
              <option value="" disabled>Pilih Customer</option>
              {customers.map((c: Customer) => (
                <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Layanan WiFi</label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={wifiServiceId} 
              onChange={e => setWifiServiceId(Number(e.target.value) || "")} 
              required
            >
              <option value="" disabled>Pilih Layanan</option>
              {services.map((s: WifiService) => (
                <option key={s.id} value={s.id}>{s.name} - Rp {s.price.toLocaleString("id-ID")}</option>
              ))}
            </select>
          </div>

          {selectedService && (
            <div className="p-4 rounded-lg bg-muted/50 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Harga Paket Dasar:</span>
                <span>Rp {packagePrice.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span>PPN 11%:</span>
                <span>Rp {ppn.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                <span>Total Bayar:</span>
                <span>Rp {totalAmount.toLocaleString("id-ID")}</span>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={createMutation.isPending || !customerId || !wifiServiceId}>
            Simpan Pembayaran & Cetak Invoice
          </Button>
        </form>
      </div>
    </div>
  );
}
