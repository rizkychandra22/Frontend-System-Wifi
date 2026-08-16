import { type Payment } from "@/lib/api/payment";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { getUserData } from "@/lib/auth-utils";

interface PaymentTableProps {
  payments: Payment[];
  onView: (payment: Payment) => void;
  onEdit: (payment: Payment) => void;
  onDelete: (payment: Payment) => void;
}

export function PaymentTable({ payments, onView, onEdit, onDelete }: PaymentTableProps) {
  const currentUser = getUserData();
  const isEmployee = currentUser?.role === "employee";

  return (
    <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice ID</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Pelanggan</TableHead>
            <TableHead>Paket</TableHead>
            <TableHead>Tagihan</TableHead>
            <TableHead>Dibuat Oleh</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                Belum ada data pembayaran.
              </td>
            </tr>
          ) : (
            payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.invoice_number || `INV-${payment.id.toString().padStart(4, '0')}`}</TableCell>
                <TableCell>{format(new Date(payment.created_at), "dd MMM yyyy HH:mm")}</TableCell>
                <TableCell>{payment.customer?.name || "-"}</TableCell>
                <TableCell>{payment.wifi_package?.name || "-"}</TableCell>
                <TableCell>Rp {payment.total_amount.toLocaleString("id-ID")}</TableCell>
                <TableCell>
                  {payment.created_by 
                    ? `${payment.created_by.role === 'admin' ? 'Admin' : 'Karyawan'} - ${payment.created_by.name}` 
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-slate-500 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                      onClick={() => onView(payment)}
                      title="Lihat Detail"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                      onClick={() => onEdit(payment)}
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    {!isEmployee && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onDelete(payment)}
                        title="Hapus"
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
