import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminAttendanceTable } from "@/features/attendance/components/admin-table-history";
import { useAllAttendance } from "@/features/attendance/hooks/use-attendance";

import { useOvertimes } from "@/features/overtime/hooks/use-overtimes";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { OvertimeTable } from "@/features/overtime/components/table";
import { OvertimeActions, type ActionState as OvertimeActionState } from "@/features/overtime/components/actions";
import { Button as UIButton } from "@/components/ui/button";

export function AdminAttendancePage() {
  const [activeTab, setActiveTab] = useState("kehadiran");

  // --- Attendance State ---
  const { attendances, errorMessage: attendanceError } = useAllAttendance();

  // --- Overtime State ---
  const { data: overtimes = [] } = useOvertimes();
  const [otSearchQuery, setOtSearchQuery] = useState("");
  const [otActionState, setOtActionState] = useState<OvertimeActionState>({ type: null, overtime: null });

  const filteredOvertimes = (overtimes || []).filter((ot) => {
    const titleMatch = ot.title.toLowerCase().includes(otSearchQuery.toLowerCase());
    const userMatch = ot.user?.name?.toLowerCase().includes(otSearchQuery.toLowerCase()) ?? false;
    return titleMatch || userMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Data Absensi & Lembur</h2>
          <p className="text-muted-foreground text-sm">
            Kelola riwayat absensi dan data lembur karyawan.
          </p>
        </div>
      </div>

      {attendanceError && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          {attendanceError}
        </div>
      )}

      <div className="w-full">
        <div className="w-full border-b border-border">
          <div className="flex flex-col sm:flex-row gap-4 w-full items-start sm:items-center">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto relative">
              <TabsList className="grid grid-cols-2 w-full sm:flex sm:w-auto h-auto p-0 bg-transparent sm:gap-6 justify-start rounded-none border-none">
                <TabsTrigger 
                  value="kehadiran"
                  className="rounded-none border-b-2 border-transparent px-1 pb-2.5 pt-1.5 font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground text-[13px]"
                >
                  Kehadiran
                </TabsTrigger>
                <TabsTrigger 
                  value="lemburan"
                  className="rounded-none border-b-2 border-transparent px-1 pb-2.5 pt-1.5 font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground text-[13px]"
                >
                  Lemburan
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <Tabs value={activeTab} className="w-full mt-6">
          <TabsContent value="kehadiran" className="mt-0">
            <AdminAttendanceTable attendances={attendances} />
          </TabsContent>
          
          <TabsContent value="lemburan" className="mt-0">
            <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3 mb-4">
              <div className="relative w-full lg:w-80">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Cari berdasarkan judul atau nama..." 
                  value={otSearchQuery}
                  onChange={(e) => setOtSearchQuery(e.target.value)}
                  className="pl-9 h-8 bg-muted/50 border border-border/60 rounded-lg text-[13px] shadow-none focus:bg-background transition-colors"
                />
              </div>
              
              <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto">
                <UIButton 
                  size="sm" 
                  onClick={() => setOtActionState({ type: 'add', overtime: null })} 
                  className="h-8 px-3.5 rounded-lg text-[13px] font-medium shrink-0 shadow-sm w-full sm:w-auto flex-none"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Buat Lembur
                </UIButton>
              </div>
            </div>

            <OvertimeTable 
              overtimes={filteredOvertimes} 
              onView={(ot) => setOtActionState({ type: 'view', overtime: ot })}
              onEdit={(ot) => setOtActionState({ type: 'edit', overtime: ot })}
              onDelete={(ot) => setOtActionState({ type: 'delete', overtime: ot })}
            />
          </TabsContent>
        </Tabs>
      </div>

      <OvertimeActions 
        actionState={otActionState} 
        onClose={() => setOtActionState({ type: null, overtime: null })} 
      />
    </div>
  );
}
