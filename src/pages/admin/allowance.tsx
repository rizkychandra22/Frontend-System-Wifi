import { useState } from "react";
import { useAllowances } from "@/features/allowance/hooks/use-allowances";
import { useUsers } from "@/features/user/hooks/use-users";
import { AllowanceTable } from "@/features/allowance/components/table";
import { AllowanceActions, type AllowanceActionState } from "@/features/allowance/components/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";

export function AdminAllowancePage() {
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionState, setActionState] = useState<AllowanceActionState>({
    type: null,
    allowance: null,
  });

  const { data: allowances = [], isLoading } = useAllowances(selectedMonth);
  const { users } = useUsers(true);
  const employeeCount = users.filter((u) => u.role === "employee").length;

  // Generate unique months for filtering dropdown
  const uniqueMonths = Array.from(new Set(allowances.map((a) => a.month))).sort((a, b) =>
    b.localeCompare(a)
  );

  const filteredAllowances = allowances.filter((item) => {
    const titleMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const employeeMatch = item.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    const descMatch = item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    if (!titleMatch && !employeeMatch && !descMatch) return false;

    if (selectedType !== "all" && item.target_type !== selectedType) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Data Tunjangan & Bonus</h2>
          <p className="text-muted-foreground text-sm">
            Kelola data tunjangan atau bonus karyawan.
          </p>
        </div>
      </div>

      <div className="w-full">
        {/* Search & Actions Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3 mt-4 mb-4">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nama tunjangan atau karyawan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 bg-muted/50 border border-border/60 rounded-lg text-[13px] shadow-none focus:bg-background transition-colors"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
            {/* Selects: Kiri Kanan di Mobile (grid-cols-2) */}
            <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
              <div className="w-full sm:w-40">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="h-8 bg-muted/50 border border-border/60 rounded-lg text-[13px] shadow-none focus:bg-background transition-colors w-full">
                    <SelectValue placeholder="Pilih Bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-[13px]">Semua Bulan</SelectItem>
                    {uniqueMonths.map((m) => {
                      const [year, month] = m.split("-");
                      const date = new Date(Number(year), Number(month) - 1, 1);
                      const label = date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
                      return (
                        <SelectItem key={m} value={m} className="text-[13px]">
                          {label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-36">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="h-8 bg-muted/50 border border-border/60 rounded-lg text-[13px] shadow-none focus:bg-background transition-colors w-full">
                    <SelectValue placeholder="Semua Tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-[13px]">Semua Tipe</SelectItem>
                    <SelectItem value="personal" className="text-[13px]">Personal</SelectItem>
                    <SelectItem value="global" className="text-[13px]">Global</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => setActionState({ type: "add", allowance: null })}
              className="h-8 px-3.5 rounded-lg text-[13px] font-medium shrink-0 shadow-sm w-full sm:w-auto flex-none"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Tambah Tunjangan
            </Button>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="h-40 rounded-xl border bg-card flex items-center justify-center text-sm text-muted-foreground">
            Memuat data tunjangan & bonus...
          </div>
        ) : (
          <AllowanceTable
            allowances={filteredAllowances}
            onView={(item) => setActionState({ type: "view", allowance: item })}
            onEdit={(item) => setActionState({ type: "edit", allowance: item })}
            onDelete={(item) => setActionState({ type: "delete", allowance: item })}
            isAdmin={true}
            employeeCount={employeeCount}
          />
        )}
      </div>

      {/* Actions Modals */}
      <AllowanceActions
        actionState={actionState}
        onClose={() => setActionState({ type: null, allowance: null })}
      />
    </div>
  );
}
