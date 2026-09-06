import { type Allowance } from "@/lib/api/allowance";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Users, User as UserIcon } from "lucide-react";

interface AllowanceTableProps {
  allowances: Allowance[];
  onView: (item: Allowance) => void;
  onEdit?: (item: Allowance) => void;
  onDelete?: (item: Allowance) => void;
  isAdmin?: boolean;
  employeeCount?: number;
}

export function AllowanceTable({
  allowances,
  onView,
  onEdit,
  onDelete,
  isAdmin = true,
  employeeCount,
}: AllowanceTableProps) {
  const getMonthLabel = (monthStr: string) => {
    if (!monthStr) return "-";
    const [year, month] = monthStr.split("-");
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  };

  return (
    <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead>Nama Tunjangan / Bonus</TableHead>
            <TableHead>Penerima</TableHead>
            <TableHead>Periode</TableHead>
            <TableHead>Nominal</TableHead>
            <TableHead>Keterangan</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allowances.length === 0 ? (
            <TableRow className="hover:bg-muted/50 transition-colors">
              <TableCell colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                Belum ada data tunjangan atau bonus yang ditambahkan.
              </TableCell>
            </TableRow>
          ) : (
            allowances.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                {/* Nama / Judul */}
                <TableCell className="font-medium text-foreground">
                  {item.title}
                </TableCell>

                {/* Penerima */}
                <TableCell>
                  {item.target_type === "global" ? (
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100/80 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900">
                        <Users className="w-3 h-3" />
                        Global
                      </span>
                      <span className="text-xs font-medium text-foreground">
                        {employeeCount !== undefined && employeeCount > 0
                          ? `${employeeCount} Karyawan`
                          : "Semua Karyawan"}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100/80 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900">
                        <UserIcon className="w-3 h-3" />
                        Personal
                      </span>
                      <span className="text-xs font-medium text-foreground">
                        {item.user?.name || "Karyawan"}
                      </span>
                    </div>
                  )}
                </TableCell>

                {/* Periode Bulan */}
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  {getMonthLabel(item.month)}
                </TableCell>

                {/* Nominal */}
                <TableCell className="font-semibold text-foreground whitespace-nowrap">
                  Rp {item.amount.toLocaleString("id-ID")}
                </TableCell>

                {/* Keterangan */}
                <TableCell className="text-xs text-muted-foreground max-w-[220px] truncate">
                  {item.description || "-"}
                </TableCell>

                {/* Aksi */}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onView(item)}
                      title="Lihat Detail"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {isAdmin && onEdit && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                        onClick={() => onEdit(item)}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}

                    {isAdmin && onDelete && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onDelete(item)}
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
