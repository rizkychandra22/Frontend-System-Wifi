import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wifiServiceApi } from "@/lib/api/wifi_service";
import type { WifiService } from "@/lib/api/wifi_service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export function WifiServicesPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["wifi-services"],
    queryFn: wifiServiceApi.getWifiServices,
  });

  const createMutation = useMutation({
    mutationFn: wifiServiceApi.createWifiService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wifi-services"] });
      toast.success("Layanan WiFi berhasil ditambahkan");
      setName("");
      setPrice("");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err?.response?.data?.error || "Gagal menambahkan layanan");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: wifiServiceApi.deleteWifiService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wifi-services"] });
      toast.success("Layanan WiFi berhasil dihapus");
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    createMutation.mutate({ name, price: Number(price) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Layanan WiFi</h1>
        <p className="text-muted-foreground">Manajemen paket langganan WiFi.</p>
      </div>
      
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <form onSubmit={handleAdd} className="flex gap-4 items-end mb-6">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Nama Paket</label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Contoh: 15Mbps" required />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Harga (Rp)</label>
            <Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Contoh: 150000" required />
          </div>
          <Button type="submit" disabled={createMutation.isPending}>Tambah Paket</Button>
        </form>

        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nama Paket</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Harga</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {isLoading ? (
                <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr>
              ) : services.length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-center">Belum ada layanan</td></tr>
              ) : (
                services.map((svc: WifiService) => (
                  <tr key={svc.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle">{svc.id}</td>
                    <td className="p-4 align-middle">{svc.name}</td>
                    <td className="p-4 align-middle">Rp {svc.price.toLocaleString("id-ID")}</td>
                    <td className="p-4 align-middle text-right">
                      <Button variant="destructive" size="icon" onClick={() => deleteMutation.mutate(svc.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
