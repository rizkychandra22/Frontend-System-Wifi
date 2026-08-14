import { useState, type FormEvent } from "react";
import { type Payment } from "@/lib/api/payment";
import { usePaymentMutations } from "@/features/payment/hooks/use-payments";
import { useCustomers } from "@/features/customer/hooks/use-customers";
import { useWifiPackages } from "@/features/wifi_package/hooks/use-wifi-packages";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PaymentForm, type PaymentFormData } from "./form";
import { PaymentDetail } from "./detail";

export type ActionState = {
  type: 'add' | 'edit' | 'delete' | 'view' | null;
  payment: Payment | null;
};

interface PaymentActionsProps {
  actionState: ActionState;
  onClose: () => void;
}

export function PaymentActions({ actionState, onClose }: PaymentActionsProps) {
  const { createMutation, updateMutation, deleteMutation } = usePaymentMutations();
  const { query: { data: customers = [] } } = useCustomers();
  const { query: { data: packages = [] } } = useWifiPackages();

  const [formData, setFormData] = useState<PaymentFormData>({
    customer_id: "",
    wifi_package_id: "",
  });

  const [prevActionState, setPrevActionState] = useState(actionState);
  if (actionState !== prevActionState) {
    setPrevActionState(actionState);
    if (actionState.type === 'edit' && actionState.payment) {
      setFormData({
        customer_id: actionState.payment.customer_id.toString(),
        wifi_package_id: actionState.payment.wifi_package_id.toString(),
      });
    } else if (actionState.type === 'add') {
      setFormData({
        customer_id: "",
        wifi_package_id: "",
      });
    }
  }

  const handleAddSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.customer_id || !formData.wifi_package_id) return;
    createMutation.mutate(
      { customer_id: Number(formData.customer_id), wifi_package_id: Number(formData.wifi_package_id) }, 
      {
        onSuccess: () => {
          onClose();
        }
      }
    );
  };

  const handleEditSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!actionState.payment || !formData.customer_id || !formData.wifi_package_id) return;
    updateMutation.mutate(
      { 
        id: actionState.payment.id, 
        data: { customer_id: Number(formData.customer_id), wifi_package_id: Number(formData.wifi_package_id) } 
      }, 
      {
        onSuccess: () => {
          onClose();
        }
      }
    );
  };

  const handleDelete = () => {
    if (!actionState.payment) return;
    deleteMutation.mutate(actionState.payment.id, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <>
      {/* Dialog Add Payment */}
      <Dialog open={actionState.type === 'add'} onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Invoice</DialogTitle>
          </DialogHeader>
          <PaymentForm 
            initialData={formData}
            onChange={setFormData}
            onSubmit={handleAddSubmit}
            isSubmitting={createMutation.isPending}
            submitLabel="Save & Generate Invoice"
            customers={customers}
            packages={packages}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog Edit Payment */}
      <Dialog open={actionState.type === 'edit'} onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
          </DialogHeader>
          <PaymentForm 
            initialData={formData}
            onChange={setFormData}
            onSubmit={handleEditSubmit}
            isSubmitting={updateMutation.isPending}
            submitLabel="Save Changes"
            customers={customers}
            packages={packages}
          />
        </DialogContent>
      </Dialog>

      {/* Sheet View Payment */}
      <PaymentDetail 
        payment={actionState.payment} 
        isOpen={actionState.type === 'view'} 
        onOpenChange={(open) => !open && onClose()} 
      />

      {/* Alert Dialog Delete */}
      <AlertDialog open={actionState.type === 'delete'} onOpenChange={(open) => !open && onClose()}>
        <AlertDialogContent className="w-[90%] max-w-[360px] rounded-md p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-lg font-semibold">Delete Invoice?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-[15px] mt-2 mb-4 text-foreground/80">
              This action cannot be undone. Invoice <strong>INV-{actionState.payment?.id.toString().padStart(4, '0')}</strong> will be permanently deleted from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-row justify-center gap-3 mt-2">
            <AlertDialogCancel className="w-24 mt-0 border border-border bg-background hover:bg-muted text-foreground rounded-lg h-8 text-[13px] font-medium">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteMutation.isPending} className="w-24 h-8 text-[13px] font-medium rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {deleteMutation.isPending ? "Deleting..." : "Yes, Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
