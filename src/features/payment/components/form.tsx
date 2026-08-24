import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { User } from "@/lib/api/users";
import type { WifiPackage } from "@/lib/api/wifi_package";
import { type FormEvent, useEffect } from "react";
import { useCustomerSubscription } from "@/features/subscriptions/hooks/use-subscriptions";
import { useCustomerPayments } from "@/features/payment/hooks/use-payments";

export interface PaymentFormData {
  customer_id: string;
  wifi_package_id: string;
  payment_method: string;
}

interface PaymentFormProps {
  initialData: PaymentFormData;
  onChange: (data: PaymentFormData) => void;
  onSubmit: (e: FormEvent) => void;
  isSubmitting: boolean;
  submitLabel?: string;
  customers: User[];
  packages: WifiPackage[];
  isEdit?: boolean;
}

export function PaymentForm({
  initialData,
  onChange,
  onSubmit,
  isSubmitting,
  submitLabel = "Simpan Pembayaran",
  customers,
  packages,
  isEdit = false,
}: PaymentFormProps) {
  const customerId = initialData.customer_id ? Number(initialData.customer_id) : null;

  // Fetch subscription dan payments secara dinamis saat customer_id dipilih
  const { subscription, isLoading: isSubLoading } = useCustomerSubscription(customerId ?? undefined);
  const { data: customerPayments = [], isLoading: isPaymentsLoading } = useCustomerPayments(customerId);

  // Auto-fill paket WiFi berdasarkan langganan aktif pelanggan
  useEffect(() => {
    if (subscription && subscription.wifi_package_id && !isEdit) {
      onChange({
        ...initialData,
        wifi_package_id: subscription.wifi_package_id.toString(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscription, isEdit]);

  const selectedService = packages.find(s => s.id.toString() === initialData.wifi_package_id);
  const totalAmount = selectedService ? selectedService.price : 0;
  const ppn = totalAmount * 0.11;
  const packagePrice = totalAmount - ppn;

  // Logika Sistem Lock 14 Hari & Status Langganan
  let lockMessage = "";
  let isLocked = false;

  if (customerId && !isEdit) {
    if (isSubLoading || isPaymentsLoading) {
      lockMessage = "Memeriksa status pelanggan...";
      isLocked = true;
    } else if (!subscription) {
      lockMessage = "Pelanggan ini belum terdaftar di langganan aktif. Silakan tambahkan data langganan pelanggan terlebih dahulu.";
      isLocked = true;
    } else if (subscription.status !== "active") {
      lockMessage = `Langganan pelanggan saat ini ditangguhkan/berhenti (Status: ${subscription.status}). Aktifkan kembali langganan di tab Data Langganan.`;
      isLocked = true;
    } else if (customerPayments && customerPayments.length > 0) {
      const latestPayment = customerPayments[0];
      const latestPaymentDate = new Date(latestPayment.created_at);
      const now = new Date();
      
      const diffTime = now.getTime() - latestPaymentDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays < 14) {
        isLocked = true;
        const nextInputDate = new Date(latestPaymentDate.getTime() + 14 * 24 * 60 * 60 * 1000);
        lockMessage = `Pembayaran terkunci. Pembayaran terakhir baru diinput pada ${latestPaymentDate.toLocaleDateString("id-ID")}. Penginputan kembali baru dapat dilakukan setelah 14 hari (mulai ${nextInputDate.toLocaleDateString("id-ID")}).`;
      }
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Nama Pelanggan</label>
        {isEdit ? (
          <Input 
            value={customers.find(c => c.id.toString() === initialData.customer_id)?.name || "Unknown"} 
            readOnly 
            className="bg-muted text-foreground cursor-default"
          />
        ) : (
          <Select 
            value={initialData.customer_id} 
            onValueChange={(val) => {
              onChange({ ...initialData, customer_id: val, wifi_package_id: "" });
            }} 
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Pelanggan" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((c: User) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.name} - {c.phone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Paket Langganan</label>
        {!isEdit ? (
          <Input 
            value={isSubLoading ? "Memuat paket langganan..." : selectedService ? `${selectedService.name} - Rp ${selectedService.price.toLocaleString("id-ID")}` : "Belum Berlangganan"} 
            readOnly 
            className="bg-muted text-foreground cursor-default"
          />
        ) : (
          <Select 
            value={initialData.wifi_package_id} 
            onValueChange={(val) => onChange({ ...initialData, wifi_package_id: val })} 
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Paket Langganan" />
            </SelectTrigger>
            <SelectContent>
              {packages.map((s: WifiPackage) => (
                <SelectItem key={s.id} value={s.id.toString()}>
                  {s.name} - Rp {s.price.toLocaleString("id-ID")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Metode Bayar</label>
        <Select 
          value={initialData.payment_method} 
          onValueChange={(val) => onChange({ ...initialData, payment_method: val })} 
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih Metode Bayar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Cash">Cash</SelectItem>
            <SelectItem value="BCA">BCA</SelectItem>
            <SelectItem value="Dana">Dana</SelectItem>
            <SelectItem value="Qris">Qris</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {lockMessage && (
        <div className={`p-4 rounded-lg text-xs border ${isLocked && !isSubLoading && !isPaymentsLoading ? "bg-red-50 text-red-700 border-red-200" : "bg-muted/50 text-muted-foreground"}`}>
          {lockMessage}
        </div>
      )}

      {selectedService && !isLocked && (
        <div className="p-4 rounded-lg bg-muted/50 space-y-2 text-sm border">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tagihan:</span>
            <span>Rp {packagePrice.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">PPN 11%:</span>
            <span>Rp {ppn.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
            <span>Total Pembayaran:</span>
            <span>Rp {totalAmount.toLocaleString("id-ID")}</span>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSubmitting || isLocked || !initialData.customer_id || !initialData.wifi_package_id || !initialData.payment_method}>
          {isSubmitting ? "Loading..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
