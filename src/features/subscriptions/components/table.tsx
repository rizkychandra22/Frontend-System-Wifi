import { type Subscription } from "@/lib/api/subscription";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { getUserData } from "@/lib/auth-utils";

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (subscription: Subscription) => void;
}

export function SubscriptionTable({ subscriptions, onEdit, onDelete }: SubscriptionTableProps) {
  const currentUser = getUserData();
  const isEmployee = currentUser?.role === "employee";

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium border bg-green-50 text-green-700 border-green-200">Aktif</span>;
      case "suspended":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium border bg-amber-50 text-amber-700 border-amber-200">Tangguhkan</span>;
      case "cancelled":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium border bg-red-50 text-red-700 border-red-200">Berhenti</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium border bg-gray-50 text-gray-700 border-gray-200">{status || "-"}</span>;
    }
  };

  return (
    <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pelanggan</TableHead>
            <TableHead>Telepon</TableHead>
            <TableHead>Paket Layanan</TableHead>
            <TableHead>Hari Tagihan</TableHead>
            <TableHead>Jatuh Tempo Berikutnya</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                Belum ada data langganan terdaftar.
              </td>
            </tr>
          ) : (
            subscriptions.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell className="font-semibold text-foreground">{sub.customer?.name || "-"}</TableCell>
                <TableCell>{sub.customer?.phone || "-"}</TableCell>
                <TableCell>
                  <div className="font-medium text-foreground">{sub.wifi_package?.name || "-"}</div>
                  <div className="text-xs text-muted-foreground">Rp {sub.wifi_package?.price.toLocaleString("id-ID")}/bln</div>
                </TableCell>
                <TableCell>Tanggal {sub.billing_day} setiap bulan</TableCell>
                <TableCell className="font-medium text-foreground">
                  {sub.next_due_date ? format(new Date(sub.next_due_date), "dd MMMM yyyy") : "-"}
                </TableCell>
                <TableCell>{getStatusBadge(sub.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                      onClick={() => onEdit(sub)}
                      title="Edit Langganan"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    {!isEmployee && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onDelete(sub)}
                        title="Hapus Langganan"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
