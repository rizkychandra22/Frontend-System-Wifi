import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { User } from "@/lib/api/users";
import type { WifiPackage } from "@/lib/api/wifi_package";
import { type FormEvent } from "react";

export interface SubscriptionFormData {
  customer_id: string;
  wifi_package_id: string;
  billing_day: string;
  next_due_date: string; // YYYY-MM-DD
  status: string;
}

interface SubscriptionFormProps {
  initialData: SubscriptionFormData;
  onChange: (data: SubscriptionFormData) => void;
  onSubmit: (e: FormEvent) => void;
  isSubmitting: boolean;
  submitLabel?: string;
  customers: User[];
  packages: WifiPackage[];
  isEdit?: boolean;
}

export function SubscriptionForm({
  initialData,
  onChange,
  onSubmit,
  isSubmitting,
  submitLabel = "Simpan Langganan",
  customers,
  packages,
  isEdit = false,
}: SubscriptionFormProps) {
  const selectedCustomer = customers.find(c => c.id.toString() === initialData.customer_id);

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Nama Pelanggan</label>
        {isEdit ? (
          <Input 
            value={selectedCustomer ? `${selectedCustomer.name} - ${selectedCustomer.phone}` : "Unknown"} 
            disabled 
            className="bg-muted text-muted-foreground"
          />
        ) : (
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
        )}
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Paket Layanan</label>
        <Select 
          value={initialData.wifi_package_id} 
          onValueChange={(val) => onChange({ ...initialData, wifi_package_id: val })} 
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih Paket Layanan" />
          </SelectTrigger>
          <SelectContent>
            {packages.map((s: WifiPackage) => (
              <SelectItem key={s.id} value={s.id.toString()}>
                {s.name} - Rp {s.price.toLocaleString("id-ID")}/bln
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Hari Jatuh Tempo</label>
          <Input 
            type="number"
            min="1"
            max="31"
            required
            value={initialData.billing_day}
            onChange={(e) => onChange({ ...initialData, billing_day: e.target.value })}
            placeholder="Contoh: 10"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Jatuh Tempo Pertama</label>
          <Input 
            type="date"
            required
            value={initialData.next_due_date}
            onChange={(e) => onChange({ ...initialData, next_due_date: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Status Layanan</label>
        <Select 
          value={initialData.status} 
          onValueChange={(val) => onChange({ ...initialData, status: val })} 
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="suspended">Tangguhkan (Late Payment/Isolasi)</SelectItem>
            <SelectItem value="cancelled">Berhenti Berlangganan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSubmitting || !initialData.customer_id || !initialData.wifi_package_id || !initialData.billing_day || !initialData.next_due_date}>
          {isSubmitting ? "Menyimpan..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
