import { useState, type FormEvent } from "react";
import { type Subscription } from "@/lib/api/subscription";
import { useSubscriptionMutations } from "@/features/subscriptions/hooks/use-subscriptions";
import { useUsers } from "@/features/user/hooks/use-users";
import { useWifiPackages } from "@/features/wifi-package/hooks/use-wifi-packages";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { SubscriptionForm, type SubscriptionFormData } from "./form";

export type SubscriptionActionState = {
  type: 'add' | 'edit' | 'delete' | null;
  subscription: Subscription | null;
};

interface SubscriptionActionsProps {
  actionState: SubscriptionActionState;
  onClose: () => void;
}

export function SubscriptionActions({ actionState, onClose }: SubscriptionActionsProps) {
  const { createOrUpdateMutation, deleteMutation, isPending } = useSubscriptionMutations();
  const { users } = useUsers(true);
  const customers = users.filter((u) => u.role === "customer");
  const { query: { data: packages = [] } } = useWifiPackages();

  const [formData, setFormData] = useState<SubscriptionFormData>({
    customer_id: "",
    wifi_package_id: "",
    billing_day: "",
    next_due_date: "",
    status: "active",
  });

  const [prevActionState, setPrevActionState] = useState(actionState);
  if (actionState !== prevActionState) {
    setPrevActionState(actionState);
    if (actionState.type === 'edit' && actionState.subscription) {
      // Format ISO string to YYYY-MM-DD for standard html date input
      const rawDate = actionState.subscription.next_due_date;
      const formattedDate = rawDate ? rawDate.substring(0, 10) : "";

      setFormData({
        customer_id: actionState.subscription.customer_id.toString(),
        wifi_package_id: actionState.subscription.wifi_package_id.toString(),
        billing_day: actionState.subscription.billing_day.toString(),
        next_due_date: formattedDate,
        status: actionState.subscription.status || "active",
      });
    } else if (actionState.type === 'add') {
      setFormData({
        customer_id: "",
        wifi_package_id: "",
        billing_day: "",
        next_due_date: "",
        status: "active",
      });
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.customer_id || !formData.wifi_package_id || !formData.billing_day || !formData.next_due_date) return;
    
    // Parse next_due_date into standard ISO 8601 string time.Time expects in backend
    const isoDueDate = new Date(formData.next_due_date).toISOString();

    createOrUpdateMutation.mutate(
      {
        customer_id: Number(formData.customer_id),
        wifi_package_id: Number(formData.wifi_package_id),
        billing_day: Number(formData.billing_day),
        next_due_date: isoDueDate,
        status: formData.status,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleDelete = () => {
    if (!actionState.subscription) return;
    deleteMutation.mutate(actionState.subscription.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <>
      {/* Dialog Add Subscription */}
      <Dialog open={actionState.type === 'add'} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="w-[90%] max-w-[420px] rounded-xl p-6">
          <DialogHeader>
            <DialogTitle>Buat Langganan Baru</DialogTitle>
          </DialogHeader>
          <SubscriptionForm 
            initialData={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            submitLabel="Buat Langganan"
            customers={customers}
            packages={packages}
            isEdit={false}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog Edit Subscription */}
      <Dialog open={actionState.type === 'edit'} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="w-[90%] max-w-[420px] rounded-xl p-6">
          <DialogHeader>
            <DialogTitle>Edit Paket & Jatuh Tempo</DialogTitle>
          </DialogHeader>
          <SubscriptionForm 
            initialData={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            submitLabel="Simpan Perubahan"
            customers={customers}
            packages={packages}
            isEdit={true}
          />
        </DialogContent>
      </Dialog>

      {/* Alert Dialog Delete */}
      <AlertDialog open={actionState.type === 'delete'} onOpenChange={(open) => !open && onClose()}>
        <AlertDialogContent className="w-[90%] max-w-[360px] rounded-md p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-lg font-semibold">Hapus Langganan?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-[15px] mt-2 mb-4 text-foreground/80">
              Tindakan ini tidak dapat dibatalkan. Data langganan aktif milik pelanggan <strong>{actionState.subscription?.customer?.name}</strong> akan dihapus secara permanen dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-row justify-center gap-3 mt-2">
            <AlertDialogCancel className="w-24 mt-0 border border-border bg-background hover:bg-muted text-foreground rounded-lg h-8 text-[13px] font-medium">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteMutation.isPending} className="w-24 h-8 text-[13px] font-medium rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {deleteMutation.isPending ? "Menghapus..." : "Ya, Hapus"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
