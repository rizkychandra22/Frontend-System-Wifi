import { useState } from "react";
import { useAllPayments } from "@/features/payment/hooks/use-payments";
import { useAllSubscriptions } from "@/features/subscriptions/hooks/use-subscriptions";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { PaymentTable } from "@/features/payment/components/table";
import { PaymentActions, type ActionState } from "@/features/payment/components/actions";
import { SubscriptionTable } from "@/features/subscriptions/components/table";
import { SubscriptionActions, type SubscriptionActionState } from "@/features/subscriptions/components/actions";
import { Button as UIButton } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PaymentsPage() {
  const { data: payments = [] } = useAllPayments();
  const { subscriptions = [] } = useAllSubscriptions();

  const [activeTab, setActiveTab] = useState("subscriptions"); // Default ke Data Langganan
  const [searchQuery, setSearchQuery] = useState("");
  
  const [paymentAction, setPaymentAction] = useState<ActionState>({ type: null, payment: null });
  const [subAction, setSubAction] = useState<SubscriptionActionState>({ type: null, subscription: null });

  // Filter Data Langganan
  const filteredSubscriptions = subscriptions.filter((sub) => {
    const customerName = sub.customer?.name || "";
    const customerPhone = sub.customer?.phone || "";
    const query = searchQuery.toLowerCase();
    return customerName.toLowerCase().includes(query) || customerPhone.includes(query);
  });

  // Filter Riwayat Pembayaran
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
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Menu Pembayaran & Langganan</h2>
          <p className="text-muted-foreground text-sm">
            Kelola langganan paket WiFi aktif pelanggan dan riwayat pencatatan transaksi bulanan.
          </p>
        </div>
      </div>

      <div className="w-full">
        <div className="w-full border-b border-border">
          <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setSearchQuery(""); }} className="w-full sm:w-auto relative">
            <TabsList className="grid grid-cols-2 w-full sm:flex sm:w-auto h-auto p-0 bg-transparent sm:gap-6 justify-start rounded-none border-none">
              <TabsTrigger 
                value="subscriptions"
                className="rounded-none border-b-2 border-transparent px-1 pb-2.5 pt-1.5 font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground text-[13px]"
              >
                Data Langganan ({filteredSubscriptions.length})
              </TabsTrigger>
              <TabsTrigger 
                value="history"
                className="rounded-none border-b-2 border-transparent px-1 pb-2.5 pt-1.5 font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground text-[13px]"
              >
                Riwayat Pembayaran ({filteredPayments.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3 mt-4 mb-4">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder={activeTab === "subscriptions" ? "Cari nama atau nomor HP..." : "Cari pelanggan atau invoice..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 bg-muted/50 border border-border/60 rounded-lg text-[13px] shadow-none focus:bg-background transition-colors"
            />
          </div>
          
          <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto">
            {activeTab === "subscriptions" ? (
              <UIButton 
                size="sm" 
                onClick={() => setSubAction({ type: 'add', subscription: null })} 
                className="h-8 px-3.5 rounded-lg text-[13px] font-medium shrink-0 shadow-sm w-full sm:w-auto flex-none"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Tambah Langganan
              </UIButton>
            ) : (
              <UIButton 
                size="sm" 
                onClick={() => setPaymentAction({ type: 'add', payment: null })} 
                className="h-8 px-3.5 rounded-lg text-[13px] font-medium shrink-0 shadow-sm w-full sm:w-auto flex-none"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Tambah Pembayaran
              </UIButton>
            )}
          </div>
        </div>

        <Tabs value={activeTab} className="w-full">
          <TabsContent value="subscriptions" className="mt-0">
            <SubscriptionTable 
              subscriptions={filteredSubscriptions}
              onEdit={(subscription) => setSubAction({ type: 'edit', subscription })}
              onDelete={(subscription) => setSubAction({ type: 'delete', subscription })}
            />
          </TabsContent>
          <TabsContent value="history" className="mt-0">
            <PaymentTable 
              payments={filteredPayments} 
              onView={(payment) => setPaymentAction({ type: 'view', payment })}
              onEdit={(payment) => setPaymentAction({ type: 'edit', payment })}
              onDelete={(payment) => setPaymentAction({ type: 'delete', payment })}
            />
          </TabsContent>
        </Tabs>
      </div>

      <PaymentActions 
        actionState={paymentAction} 
        onClose={() => setPaymentAction({ type: null, payment: null })} 
      />

      <SubscriptionActions 
        actionState={subAction}
        onClose={() => setSubAction({ type: null, subscription: null })}
      />
    </div>
  );
}
