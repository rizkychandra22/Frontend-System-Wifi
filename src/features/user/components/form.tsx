import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export interface UserFormData {
  name: string;
  phone: string;
  role: string;
  address: string;
}

interface UserFormProps {
  initialData: UserFormData;
  onChange: (data: UserFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  submitLabel?: string;
  showRoleSelect?: boolean;
}

export function UserForm({
  initialData,
  onChange,
  onSubmit,
  isSubmitting,
  submitLabel = "Simpan",
  showRoleSelect = false,
}: UserFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Lengkap</Label>
        <Input
          id="name"
          required
          value={initialData.name}
          onChange={(e) => onChange({ ...initialData, name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Nomor HP</Label>
        <Input
          id="phone"
          required
          value={initialData.phone}
          onChange={(e) => onChange({ ...initialData, phone: e.target.value })}
        />
      </div>
      {showRoleSelect && (
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            value={initialData.role}
            onValueChange={(val) => onChange({ ...initialData, role: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="employee">Karyawan</SelectItem>
              <SelectItem value="customer">Pelanggan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="address">Alamat (Opsional)</Label>
        <Textarea
          id="address"
          rows={3}
          value={initialData.address}
          onChange={(e) => onChange({ ...initialData, address: e.target.value })}
        />
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
