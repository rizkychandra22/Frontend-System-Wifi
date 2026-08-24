import { useState } from "react";
import { useWifiPackages } from "@/features/wifi_package/hooks/use-wifi-packages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { WifiPackageTable } from "@/features/wifi_package/components/table";
import { WifiPackageActions, type ActionState } from "@/features/wifi_package/components/actions";

export function WifiPackagesPage() {
  const { query: { data: services = [] } } = useWifiPackages();
  const [searchQuery, setSearchQuery] = useState("");
  const [actionState, setActionState] = useState<ActionState>({ type: null, package: null });

  const filteredServices = services.filter((svc) =>
    svc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Data Paket WiFi</h2>
          <p className="text-muted-foreground text-sm">
            Kelola paket layanan WiFi.
          </p>
        </div>
      </div>

      <div className="w-full">
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3 mt-4 mb-4">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Cari nama paket..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 bg-muted/50 border border-border/60 rounded-lg text-[13px] shadow-none focus:bg-background transition-colors"
            />
          </div>
          
          <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto">
            <Button 
              size="sm" 
              onClick={() => setActionState({ type: 'add', package: null })} 
              className="h-8 px-3.5 rounded-lg text-[13px] font-medium shrink-0 shadow-sm w-full sm:w-auto flex-none"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Tambah Paket
            </Button>
          </div>
        </div>

        <WifiPackageTable 
          packages={filteredServices} 
          onEdit={(pkg) => setActionState({ type: 'edit', package: pkg })}
          onDelete={(pkg) => setActionState({ type: 'delete', package: pkg })}
        />
      </div>

      <WifiPackageActions 
        actionState={actionState} 
        onClose={() => setActionState({ type: null, package: null })} 
      />
    </div>
  );
}
