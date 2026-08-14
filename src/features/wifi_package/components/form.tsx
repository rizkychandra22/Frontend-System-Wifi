import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type FormEvent } from "react";

export interface WifiPackageFormData {
  name: string;
  price: number;
}

interface WifiPackageFormProps {
  initialData: WifiPackageFormData;
  onChange: (data: WifiPackageFormData) => void;
  onSubmit: (e: FormEvent) => void;
  isSubmitting: boolean;
  submitLabel?: string;
}

export function WifiPackageForm({
  initialData,
  onChange,
  onSubmit,
  isSubmitting,
  submitLabel = "Save",
}: WifiPackageFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Package Name</Label>
        <Input
          id="name"
          required
          placeholder="Example: 15Mbps"
          value={initialData.name}
          onChange={(e) => onChange({ ...initialData, name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Price (Rp)</Label>
        <Input
          id="price"
          type="number"
          required
          placeholder="Example: 150000"
          value={initialData.price || ""}
          onChange={(e) => onChange({ ...initialData, price: Number(e.target.value) })}
        />
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
