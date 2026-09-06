import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { User } from "@/lib/api/users";
import { Users, User as UserIcon } from "lucide-react";

export interface AllowanceFormData {
  target_type: "global" | "personal";
  user_id: string;
  month: string;
  title: string;
  amount: string;
  description: string;
}

interface AllowanceFormProps {
  initialData: AllowanceFormData;
  onChange: (data: AllowanceFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  submitLabel: string;
  employees: User[];
}

export function AllowanceForm({
  initialData,
  onChange,
  onSubmit,
  isSubmitting,
  submitLabel,
  employees,
}: AllowanceFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 no-scrollbar">
      {/* 1. Target Penerima (Global vs Personal) */}
      <div className="space-y-2">
        <Label htmlFor="target_type">Penerima Tunjangan / Bonus</Label>
        <Select
          value={initialData.target_type}
          onValueChange={(val: "global" | "personal") =>
            onChange({
              ...initialData,
              target_type: val,
              user_id: val === "global" ? "" : initialData.user_id,
            })
          }
        >
          <SelectTrigger id="target_type">
            <SelectValue placeholder="Pilih Jenis Penerima" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="global">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span>Global (Semua Karyawan)</span>
              </div>
            </SelectItem>
            <SelectItem value="personal">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-emerald-500" />
                <span>Personal (Karyawan Tertentu)</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 2. Jika Personal: Tampilkan dropdown Karyawan */}
      {initialData.target_type === "personal" && (
        <div className="space-y-2 animate-in fade-in-50 duration-200">
          <Label htmlFor="user_id">
            Pilih Karyawan <span className="text-destructive">*</span>
          </Label>
          <Select
            value={initialData.user_id}
            onValueChange={(val) => onChange({ ...initialData, user_id: val })}
            required
          >
            <SelectTrigger id="user_id">
              <SelectValue placeholder="Pilih Karyawan Penerima" />
            </SelectTrigger>
            <SelectContent>
              {employees.length === 0 ? (
                <div className="p-2 text-center text-xs text-muted-foreground">
                  Tidak ada data karyawan
                </div>
              ) : (
                employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id.toString()}>
                    {emp.name} ({emp.phone})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Jika Global: Tampilkan info notice */}
      {initialData.target_type === "global" && (
        <div className="rounded-lg bg-blue-50/70 border border-blue-200/80 p-3 text-xs text-blue-800 flex items-center gap-2 animate-in fade-in-50 duration-200">
          <Users className="w-4 h-4 shrink-0 text-blue-600" />
          <span>
            Tunjangan ini akan otomatis diberikan ke <strong>seluruh karyawan</strong> pada bulan penggajian yang dipilih.
          </span>
        </div>
      )}

      {/* 3. Input Bulan */}
      <div className="space-y-2">
        <Label htmlFor="month">
          Periode Bulan <span className="text-destructive">*</span>
        </Label>
        <Input
          id="month"
          type="month"
          value={initialData.month}
          onChange={(e) => onChange({ ...initialData, month: e.target.value })}
          required
        />
        <p className="text-[11px] text-muted-foreground">
          Berlaku untuk bulan ini saja. Untuk bulan berikutnya, inputkan kembali bila ada bonus.
        </p>
      </div>

      {/* 4. Nama Tunjangan / Bonus */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Nama Tunjangan / Bonus <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Cth: Bonus Kinerja Terbaik, Tunjangan Hari Raya"
          value={initialData.title}
          onChange={(e) => onChange({ ...initialData, title: e.target.value })}
          required
        />
      </div>

      {/* 5. Nominal (Rp) */}
      <div className="space-y-2">
        <Label htmlFor="amount">
          Nominal (Rp) <span className="text-destructive">*</span>
        </Label>
        <Input
          id="amount"
          type="number"
          min="1"
          placeholder="Cth: 500000"
          value={initialData.amount}
          onChange={(e) => onChange({ ...initialData, amount: e.target.value })}
          required
        />
      </div>

      {/* 6. Keterangan / Deskripsi (Opsional) */}
      <div className="space-y-2">
        <Label htmlFor="description">Keterangan / Alasan (Opsional)</Label>
        <Textarea
          id="description"
          placeholder="Cth: Diberikan atas pencapaian target kerja dan loyalitas..."
          value={initialData.description}
          onChange={(e) => onChange({ ...initialData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="flex justify-end pt-2 gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
