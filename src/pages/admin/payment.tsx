import { useState } from "react";
import { useAllPayments } from "@/features/payment/hooks/use-payments";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { PaymentTable } from "@/features/payment/components/table";
import { PaymentActions, type ActionState } from "@/features/payment/components/actions";
import { Button as UIButton } from "@/components/ui/button";

export function PaymentsPage() {
  const { data: payments = [] } = useAllPayments();
  const [searchQuery, setSearchQuery] = useState("");
  const [actionState, setActionState] = useState<ActionState>({ type: null, payment: null });

  const filteredPayments = payments.filter((payment) => {
    const customerName = payment.customer?.name || "";
    const customerMatch = customerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const invoiceNumber = payment.invoice_number || `INV-${payment.id.toString().padStart(4, '0')}`;
    const invoiceIdMatch = invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    return customerMatch || invoiceIdMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Data Pembayaran</h2>
          <p className="text-muted-foreground text-sm">
            Kelola data tagihan dan pembayaran bulanan pelanggan.
          </p>
        </div>
      </div>

      <div className="w-full">
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3 mt-4 mb-4">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Cari pelanggan atau invoice..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 bg-muted/50 border border-border/60 rounded-lg text-[13px] shadow-none focus:bg-background transition-colors"
            />
          </div>
          
          <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto">
            <UIButton 
              size="sm" 
              onClick={() => setActionState({ type: 'add', payment: null })} 
              className="h-8 px-3.5 rounded-lg text-[13px] font-medium shrink-0 shadow-sm w-full sm:w-auto flex-none"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Tambah Pembayaran
            </UIButton>
          </div>
        </div>

        <PaymentTable 
          payments={filteredPayments} 
          onView={(payment) => setActionState({ type: 'view', payment })}
          onEdit={(payment) => setActionState({ type: 'edit', payment })}
          onDelete={(payment) => setActionState({ type: 'delete', payment })}
        />
      </div>

      <PaymentActions 
        actionState={actionState} 
        onClose={() => setActionState({ type: null, payment: null })} 
      />
    </div>
  );
}
