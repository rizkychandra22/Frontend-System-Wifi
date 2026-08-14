import { useState } from "react";
import { useCustomers } from "@/features/customer/hooks/use-customers";
import { useWifiPackages } from "@/features/wifi_package/hooks/use-wifi-packages";
import { usePaymentMutations } from "@/features/payment/hooks/use-payments";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Customer } from "@/lib/api/customer";
import type { WifiPackage } from "@/lib/api/wifi_package";

export function PaymentsPage() {
  const [customerId, setCustomerId] = useState<string>("");
  const [wifiPackageId, setWifiPackageId] = useState<string>("");

  const { query: { data: customers = [] } } = useCustomers();
  const { query: { data: services = [] } } = useWifiPackages();
  const { createMutation } = usePaymentMutations();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !wifiPackageId) return;
    createMutation.mutate({ customer_id: Number(customerId), wifi_package_id: Number(wifiPackageId) }, {
      onSuccess: () => {
        setCustomerId("");
        setWifiPackageId("");
      }
    });
  };

  const selectedService = services.find(s => s.id.toString() === wifiPackageId);
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
            <Select value={customerId} onValueChange={setCustomerId} required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c: Customer) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.name} - {c.phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Layanan Paket WiFi</label>
            <Select value={wifiPackageId} onValueChange={setWifiPackageId} required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Layanan" />
              </SelectTrigger>
              <SelectContent>
                {services.map((s: WifiPackage) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {s.name} - Rp {s.price.toLocaleString("id-ID")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedService && (
            <div className="p-4 rounded-lg bg-muted/50 space-y-2 text-sm border">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Harga Paket Dasar:</span>
                <span>Rp {packagePrice.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">PPN 11%:</span>
                <span>Rp {ppn.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                <span>Total Bayar:</span>
                <span>Rp {totalAmount.toLocaleString("id-ID")}</span>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={createMutation.isPending || !customerId || !wifiPackageId}>
            Simpan Pembayaran & Cetak Invoice
          </Button>
        </form>
      </div>
    </div>
  );
}
