import { useState } from "react";
import { useOvertimes } from "@/features/overtime/hooks/use-overtimes";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { OvertimeTable } from "@/features/overtime/components/table";
import { OvertimeActions, type ActionState } from "@/features/overtime/components/actions";
import { Button as UIButton } from "@/components/ui/button";

export function AdminOvertimePage() {
  const { data: overtimes = [] } = useOvertimes();
  const [searchQuery, setSearchQuery] = useState("");
  const [actionState, setActionState] = useState<ActionState>({ type: null, overtime: null });

  const filteredOvertimes = (overtimes || []).filter((ot) => {
    const titleMatch = ot.title.toLowerCase().includes(searchQuery.toLowerCase());
    const userMatch = ot.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    return titleMatch || userMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Data Lemburan</h2>
          <p className="text-muted-foreground text-sm">
            Kelola data pengajuan lembur karyawan.
          </p>
        </div>
      </div>

      <div className="w-full">
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3 mt-4 mb-4">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Cari berdasarkan judul atau nama..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 bg-muted/50 border border-border/60 rounded-lg text-[13px] shadow-none focus:bg-background transition-colors"
            />
          </div>
          
          <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto">
            <UIButton 
              size="sm" 
              onClick={() => setActionState({ type: 'add', overtime: null })} 
              className="h-8 px-3.5 rounded-lg text-[13px] font-medium shrink-0 shadow-sm w-full sm:w-auto flex-none"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Buat Lembur
            </UIButton>
          </div>
        </div>

        <OvertimeTable 
          overtimes={filteredOvertimes} 
          onView={(ot) => setActionState({ type: 'view', overtime: ot })}
          onEdit={(ot) => setActionState({ type: 'edit', overtime: ot })}
          onDelete={(ot) => setActionState({ type: 'delete', overtime: ot })}
        />
      </div>

      <OvertimeActions 
        actionState={actionState} 
        onClose={() => setActionState({ type: null, overtime: null })} 
      />
    </div>
  );
}
