import { useState } from "react";
import { Plus, Search } from "lucide-react";

import { useUsers } from "@/features/user/hooks/use-users";
import { UserTable } from "@/features/user/components/table";
import { UserActions, type ActionState } from "@/features/user/components/actions";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const EmployeeCustomersPage = () => {
  const { users } = useUsers();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [actionState, setActionState] = useState<ActionState>({ type: null, user: null });

  // Employee hanya melihat customer yang didaftarkannya (ini sudah difilter dari backend)
  // Tapi untuk keamanan ekstra di frontend, kita pastikan hanya merender customer
  const filteredCustomers = users.filter((user) => {
    const matchSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       user.phone.includes(searchQuery);
    const isCustomer = user.role === "customer";
    return matchSearch && isCustomer;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pelanggan Saya</h2>
          <p className="text-muted-foreground text-sm">
            Kelola daftar pelanggan yang Anda tambahkan ke dalam sistem.
          </p>
        </div>
      </div>

      <div className="w-full">
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3 mt-4 mb-4">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau nomor HP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 bg-muted/50 border border-border/60 rounded-lg text-[13px] shadow-none focus:bg-background transition-colors"
            />
          </div>

          <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto">
            <Button size="sm" onClick={() => setActionState({ type: 'add', user: null, role: 'customer' })} className="h-8 px-3.5 rounded-lg text-[13px] font-medium shrink-0 shadow-sm w-full sm:w-auto flex-none">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Tambah Pelanggan
            </Button>
          </div>
        </div>

        <UserTable 
          users={filteredCustomers} 
          onView={(user) => setActionState({ type: 'view', user })}
          onEdit={(user) => setActionState({ type: 'edit', user })}
          onResetIP={() => {}} // Disabled via isEmployeeView
          onDelete={() => {}} // Disabled via isEmployeeView
          isEmployeeView={true}
        />
      </div>

      <UserActions 
        actionState={actionState} 
        onClose={() => setActionState({ type: null, user: null })} 
        isEmployeeView={true}
      />
    </div>
  );
};
