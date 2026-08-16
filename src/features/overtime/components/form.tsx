import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { User } from "@/lib/api/users";
import { useAuth } from "@/features/auth/hooks/use-auth";

export interface OvertimeFormData {
  user_id: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
}

interface OvertimeFormProps {
  initialData: OvertimeFormData;
  onChange: (data: OvertimeFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  submitLabel: string;
  employees: User[];
}

export function OvertimeForm({
  initialData,
  onChange,
  onSubmit,
  isSubmitting,
  submitLabel,
  employees
}: OvertimeFormProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {isAdmin && (
        <div className="space-y-2">
          <Label htmlFor="user_id">Karyawan</Label>
          <Select
            value={initialData.user_id}
            onValueChange={(val) => onChange({ ...initialData, user_id: val })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Karyawan" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((emp) => (
                <SelectItem key={emp.id} value={emp.id.toString()}>
                  {emp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Judul Lembur</Label>
        <Input
          id="title"
          placeholder="Cth: Maintenance Jaringan"
          value={initialData.title}
          onChange={(e) => onChange({ ...initialData, title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi Pekerjaan</Label>
        <Textarea
          id="description"
          placeholder="Cth: Mengganti kabel fiber optik di area B..."
          value={initialData.description}
          onChange={(e) => onChange({ ...initialData, description: e.target.value })}
          required
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Tanggal Lembur</Label>
        <Input
          id="date"
          type="date"
          value={initialData.date}
          onChange={(e) => onChange({ ...initialData, date: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_time">Jam Mulai</Label>
          <Input
            id="start_time"
            type="time"
            value={initialData.start_time}
            onChange={(e) => onChange({ ...initialData, start_time: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_time">Jam Selesai</Label>
          <Input
            id="end_time"
            type="time"
            value={initialData.end_time}
            onChange={(e) => onChange({ ...initialData, end_time: e.target.value })}
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Menyimpan..." : submitLabel}
      </Button>
    </form>
  );
}
