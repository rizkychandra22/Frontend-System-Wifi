import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customerApi } from "@/lib/api/customer";
import type { Customer } from "@/lib/api/customer";
import { paymentApi } from "@/lib/api/payment";
import type { Payment } from "@/lib/api/payment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Download } from "lucide-react";

export function CustomersPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: customerApi.getCustomers,
  });

  const { data: payments = [], isLoading: isPaymentsLoading } = useQuery({
    queryKey: ["payments", selectedCustomerId],
    queryFn: () => paymentApi.getCustomerPayments(selectedCustomerId!),
    enabled: !!selectedCustomerId,
  });

  const createMutation = useMutation({
    mutationFn: customerApi.createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer berhasil ditambahkan");
      setName("");
      setPhone("");
      setAddress("");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err?.response?.data?.error || "Gagal menambahkan customer");
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    createMutation.mutate({ name, phone, address });
  };
  
  // Need to get role from local storage or claims to see if admin
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
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nama</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Telepon</th>
                {isAdmin && <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Diinput Oleh</th>}
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {isLoading ? (
                <tr><td colSpan={isAdmin ? 5 : 4} className="p-4 text-center">Loading...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={isAdmin ? 5 : 4} className="p-4 text-center">Belum ada customer</td></tr>
              ) : (
                customers.map((c: Customer) => (
                  <tr key={c.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle">{c.id}</td>
                    <td className="p-4 align-middle">{c.name}</td>
                    <td className="p-4 align-middle">{c.phone}</td>
                    {isAdmin && <td className="p-4 align-middle">{c.registered_by?.name || "-"}</td>}
                    <td className="p-4 align-middle text-right">
                      <Button variant="outline" size="sm" onClick={() => setSelectedCustomerId(c.id)}>
                        Riwayat Tagihan
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCustomerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-xl border bg-card p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Riwayat Pembayaran</h2>
              <Button variant="ghost" onClick={() => setSelectedCustomerId(null)}>Tutup</Button>
            </div>
            
            <div className="max-h-[60vh] overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="border-b">
                  <tr>
                    <th className="py-2">Tanggal</th>
                    <th className="py-2">Paket</th>
                    <th className="py-2">Total</th>
                    <th className="py-2 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {isPaymentsLoading ? (
                    <tr><td colSpan={4} className="py-4 text-center">Loading...</td></tr>
                  ) : payments.length === 0 ? (
                    <tr><td colSpan={4} className="py-4 text-center">Belum ada riwayat</td></tr>
                  ) : (
                    payments.map((p: Payment) => (
                      <tr key={p.id} className="border-b">
                        <td className="py-3">{new Date(p.created_at).toLocaleDateString("id-ID")}</td>
                        <td className="py-3">{p.wifi_service?.name}</td>
                        <td className="py-3">Rp {p.total_amount.toLocaleString("id-ID")}</td>
                        <td className="py-3 text-right">
                          <Button size="sm" onClick={() => paymentApi.downloadPaymentPDF(p.id)}>
                            <Download className="w-4 h-4 mr-2" /> Download
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
      )}
    </div>
  );
}
