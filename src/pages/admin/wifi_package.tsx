import { useState } from "react";
import { useWifiPackages } from "@/features/wifi_package/hooks/use-wifi-packages";
import type { WifiPackage } from "@/lib/api/wifi_package";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";

export function WifiPackagesPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const { query: { data: services = [], isLoading }, createMutation, deleteMutation } = useWifiPackages();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    createMutation.mutate({ name, price: Number(price) }, {
      onSuccess: () => {
        setName("");
        setPrice("");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Layanan Paket WiFi</h1>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nama Paket</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>
              ) : services.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center">Belum ada layanan paket wifi</TableCell></TableRow>
              ) : (
                services.map((svc: WifiPackage) => (
                  <TableRow key={svc.id}>
                    <TableCell>{svc.id}</TableCell>
                    <TableCell>{svc.name}</TableCell>
                    <TableCell>Rp {svc.price.toLocaleString("id-ID")}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="destructive" size="icon" onClick={() => deleteMutation.mutate(svc.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
