import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Overtime } from "@/lib/api/overtime";
import { getUserData } from "@/lib/auth-utils";

interface OvertimeTableProps {
  overtimes: Overtime[];
  onView: (overtime: Overtime) => void;
  onEdit: (overtime: Overtime) => void;
  onDelete: (overtime: Overtime) => void;
}

export function OvertimeTable({ overtimes, onView, onEdit, onDelete }: OvertimeTableProps) {
  const user = getUserData();
  const isAdmin = user?.role === "admin";

  return (
    <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            {isAdmin && <TableHead>Karyawan</TableHead>}
            <TableHead>Tanggal</TableHead>
            <TableHead>Pekerjaan</TableHead>
            <TableHead>Waktu</TableHead>
            {isAdmin && <TableHead>Tarif</TableHead>}
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {overtimes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isAdmin ? 6 : 4} className="text-center py-6 text-muted-foreground">
                Belum ada data lembur
              </TableCell>
            </TableRow>
          ) : (
            overtimes.map((ot) => (
              <TableRow key={ot.id}>
                {isAdmin && (
                  <TableCell className="font-medium">{ot.user?.name}</TableCell>
                )}
                <TableCell className="whitespace-nowrap">
                  {format(parseISO(ot.date.substring(0, 10)), "dd MMM yyyy", { locale: id })}
                </TableCell>
                <TableCell className="max-w-[200px] truncate" title={ot.title}>
                  {ot.title}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {ot.start_time.substring(11, 16)} - {ot.end_time.substring(11, 16)}
                </TableCell>
                {isAdmin && (
                  <TableCell className="font-medium text-primary whitespace-nowrap">
                    Rp {ot.price.toLocaleString("id-ID")}
                  </TableCell>
                )}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-slate-500 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                      onClick={() => onView(ot)}
                      title="Lihat Detail"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                        onClick={() => onEdit(ot)}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(ot)}
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
