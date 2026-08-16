import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Overtime } from "@/lib/api/overtime";
import { useAuth } from "@/features/auth/hooks/use-auth";

interface OvertimeTableProps {
  overtimes: Overtime[];
  onView: (overtime: Overtime) => void;
  onEdit: (overtime: Overtime) => void;
  onDelete: (overtime: Overtime) => void;
}

export function OvertimeTable({ overtimes, onView, onEdit, onDelete }: OvertimeTableProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div className="bg-card rounded-xl border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground border-b">
            <tr>
              {isAdmin && <th className="px-6 py-4 font-medium">Karyawan</th>}
              <th className="px-6 py-4 font-medium">Tanggal</th>
              <th className="px-6 py-4 font-medium">Pekerjaan</th>
              <th className="px-6 py-4 font-medium">Waktu</th>
              {isAdmin && <th className="px-6 py-4 font-medium">Tarif</th>}
              <th className="px-6 py-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {overtimes.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 6 : 4} className="px-6 py-8 text-center text-muted-foreground">
                  Belum ada data lembur
                </td>
              </tr>
            ) : (
              overtimes.map((ot) => (
                <tr key={ot.id} className="hover:bg-muted/30 transition-colors">
                  {isAdmin && (
                    <td className="px-6 py-4 font-medium">{ot.user?.name}</td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(parseISO(ot.date), "dd MMM yyyy", { locale: id })}
                  </td>
                  <td className="px-6 py-4 max-w-[200px] truncate" title={ot.title}>
                    {ot.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(parseISO(ot.start_time), "HH:mm")} - {format(parseISO(ot.end_time), "HH:mm")}
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 font-medium text-primary whitespace-nowrap">
                      Rp {ot.price.toLocaleString("id-ID")}
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => onView(ot)}
                        title="Lihat Detail"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50"
                          onClick={() => onEdit(ot)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => onDelete(ot)}
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
