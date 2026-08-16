import { useState } from "react";
import { type User } from "@/lib/api/users";
import { useUsers } from "@/features/user/hooks/use-users";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { UserTable } from "@/features/user/components/table";
import { UserActions, type ActionState } from "@/features/user/components/actions";

export function UsersPage() {
  const { users, errorMessage } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("employee");

  const [actionState, setActionState] = useState<ActionState>({ type: null, user: null });

  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(query) ||
      u.phone.toLowerCase().includes(query)
    );
  });

  const employees = filteredUsers.filter((u) => u.role === "employee");
  const customers = filteredUsers.filter((u) => u.role === "customer");

  const renderTable = (dataList: User[]) => (
    <UserTable 
      users={dataList} 
      onView={(user) => setActionState({ type: 'view', user })}
      onEdit={(user) => setActionState({ type: 'edit', user })}
      onResetIP={(user) => setActionState({ type: 'reset', user })}
      onDelete={(user) => setActionState({ type: 'delete', user })}
    />
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Pengguna</h2>
          <p className="text-muted-foreground text-sm">
            Kelola data karyawan dan pelanggan untuk sistem WiFi.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-200">
          Error Backend: {errorMessage}. (Hint: Pastikan Golang Backend sudah di-restart agar Endpoint & Database Migration terbaru berjalan!)
        </div>
      )}

      <div className="w-full">
        <div className="w-full border-b border-border">
          <div className="flex flex-col sm:flex-row gap-4 w-full items-start sm:items-center">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto relative">
              <TabsList className="grid grid-cols-2 w-full sm:flex sm:w-auto h-auto p-0 bg-transparent sm:gap-6 justify-start rounded-none border-none">
                <TabsTrigger 
                  value="employee"
                  className="rounded-none border-b-2 border-transparent px-1 pb-2.5 pt-1.5 font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground text-[13px]"
                >
                  Karyawan ({employees.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="customer"
                  className="rounded-none border-b-2 border-transparent px-1 pb-2.5 pt-1.5 font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground text-[13px]"
                >
                  Pelanggan ({customers.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3 mt-4 mb-4">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Cari nama atau nomor telepon..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 bg-muted/50 border border-border/60 rounded-lg text-[13px] shadow-none focus:bg-background transition-colors"
            />
          </div>
          
          <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto">
            <Button size="sm" onClick={() => setActionState({ type: 'add', user: null, role: activeTab })} className="h-8 px-3.5 rounded-lg text-[13px] font-medium shrink-0 shadow-sm w-full sm:w-auto flex-none">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Tambah {activeTab === "employee" ? "Karyawan" : "Pelanggan"}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} className="w-full">
          <TabsContent value="employee" className="mt-0">{renderTable(employees)}</TabsContent>
          <TabsContent value="customer" className="mt-0">{renderTable(customers)}</TabsContent>
        </Tabs>
      </div>

      <UserActions 
        actionState={actionState} 
        onClose={() => setActionState({ type: null, user: null })} 
      />
    </div>
  );
}
