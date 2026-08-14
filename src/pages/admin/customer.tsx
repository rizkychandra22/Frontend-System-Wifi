import { useState } from "react";
import { useCustomers } from "@/features/customer/hooks/use-customers";
import { useCustomerPayments } from "@/features/payment/hooks/use-payments";
import { paymentApi } from "@/lib/api/payment";
import type { Customer } from "@/lib/api/customer";
import type { Payment } from "@/lib/api/payment";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download } from "lucide-react";

export function CustomersPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

  const { query: { data: customers = [], isLoading }, createMutation } = useCustomers();
  const { data: payments = [], isLoading: isPaymentsLoading } = useCustomerPayments(selectedCustomerId);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    createMutation.mutate({ name, phone, address }, {
      onSuccess: () => {
        setName("");
        setPhone("");
        setAddress("");
      }
    });
  };
  
  const userStr = localStorage.getItem("user");
  const userObj = userStr ? JSON.parse(userStr) : null;
  const isAdmin = userObj?.role === "admin";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Data Customer</h1>
        <p className="text-muted-foreground">Manajemen data customer untuk layanan WiFi.</p>
      </div>
      
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Tambah Customer Baru</h2>
        <form onSubmit={handleAdd} className="flex flex-col gap-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Nama</label>
              <Input value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">No. Telepon</label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} required />
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Alamat</label>
              <Input value={address} onChange={e => setAddress(e.target.value)} />
            </div>
          </div>
          <Button type="submit" className="w-fit" disabled={createMutation.isPending}>Tambah Customer</Button>
        </form>

        <div className="relative w-full overflow-auto mt-8">
          <h2 className="text-lg font-semibold mb-4">Daftar Customer</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Telepon</TableHead>
                {isAdmin && <TableHead>Diinput Oleh</TableHead>}
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={isAdmin ? 5 : 4} className="text-center">Loading...</TableCell></TableRow>
              ) : customers.length === 0 ? (
                <TableRow><TableCell colSpan={isAdmin ? 5 : 4} className="text-center">Belum ada customer</TableCell></TableRow>
              ) : (
                customers.map((c: Customer) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.id}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.phone}</TableCell>
                    {isAdmin && (
                      <TableCell>
                        {c.registered_by 
                          ? `${c.registered_by.role === 'admin' ? 'Admin' : 'Employee'} - ${c.registered_by.name}` 
                          : "-"}
                      </TableCell>
                    )}
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => setSelectedCustomerId(c.id)}>
                        Riwayat Tagihan
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={selectedCustomerId !== null} onOpenChange={(open) => !open && setSelectedCustomerId(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Riwayat Pembayaran</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Paket</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPaymentsLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>
              ) : payments.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center">Belum ada riwayat</TableCell></TableRow>
              ) : (
                payments.map((p: Payment) => (
                  <TableRow key={p.id}>
                    <TableCell>{new Date(p.created_at).toLocaleDateString("id-ID")}</TableCell>
                    <TableCell>{p.wifi_package?.name}</TableCell>
                    <TableCell>Rp {p.total_amount.toLocaleString("id-ID")}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => paymentApi.downloadPaymentPDF(p.id, `invoice-${p.id}.pdf`)}>
                        <Download className="w-4 h-4 mr-2" /> Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  );
}
