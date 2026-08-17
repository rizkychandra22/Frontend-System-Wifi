import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { User } from "@/lib/api/users";
import type { WifiPackage } from "@/lib/api/wifi_package";
import { type FormEvent } from "react";

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
}

export function PaymentForm({
  initialData,
  onChange,
  onSubmit,
  isSubmitting,
  submitLabel = "Save Payment",
  customers,
  packages,
}: PaymentFormProps) {
  const selectedService = packages.find(s => s.id.toString() === initialData.wifi_package_id);
  const totalAmount = selectedService ? selectedService.price : 0;
  const ppn = totalAmount * 0.11;
  const packagePrice = totalAmount - ppn;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Nama Pelanggan</label>
        <Select 
          value={initialData.customer_id} 
          onValueChange={(val) => onChange({ ...initialData, customer_id: val })} 
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
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Paket Langganan</label>
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

      {selectedService && (
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
        <Button type="submit" disabled={isSubmitting || !initialData.customer_id || !initialData.wifi_package_id || !initialData.payment_method}>
          {isSubmitting ? "Loading..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
