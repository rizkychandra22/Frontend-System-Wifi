import { useState, type FormEvent } from "react";
import { type WifiPackage } from "@/lib/api/wifi_package";
import { useWifiPackages } from "@/features/wifi-package/hooks/use-wifi-packages";
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
import { WifiPackageForm, type WifiPackageFormData } from "./form";

export type ActionState = {
  type: 'add' | 'edit' | 'delete' | null;
  package: WifiPackage | null;
};

interface WifiPackageActionsProps {
  actionState: ActionState;
  onClose: () => void;
}

export function WifiPackageActions({ actionState, onClose }: WifiPackageActionsProps) {
  const { createMutation, updateMutation, deleteMutation } = useWifiPackages();

  const [formData, setFormData] = useState<WifiPackageFormData>({
    name: "",
    price: 0,
  });

  const [prevActionState, setPrevActionState] = useState(actionState);
  if (actionState !== prevActionState) {
    setPrevActionState(actionState);
    if (actionState.type === 'edit' && actionState.package) {
      setFormData({
        name: actionState.package.name,
        price: actionState.package.price,
      });
    } else if (actionState.type === 'add') {
      setFormData({
        name: "",
        price: 0,
      });
    }
  }

  const handleAddSubmit = (e: FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  const handleEditSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!actionState.package) return;
    updateMutation.mutate({ id: actionState.package.id, data: formData }, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  const handleDelete = () => {
    if (!actionState.package) return;
    deleteMutation.mutate(actionState.package.id, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <>
      {/* Dialog Add Package */}
      <Dialog open={actionState.type === 'add'} onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Paket Baru</DialogTitle>
          </DialogHeader>
          <WifiPackageForm 
            initialData={formData}
            onChange={setFormData}
            onSubmit={handleAddSubmit}
            isSubmitting={createMutation.isPending}
            submitLabel="Simpan"
          />
        </DialogContent>
      </Dialog>

      {/* Dialog Edit Package */}
      <Dialog open={actionState.type === 'edit'} onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Paket</DialogTitle>
          </DialogHeader>
          <WifiPackageForm 
            initialData={formData}
            onChange={setFormData}
            onSubmit={handleEditSubmit}
            isSubmitting={updateMutation.isPending}
            submitLabel="Simpan Perubahan"
          />
        </DialogContent>
      </Dialog>

      {/* Alert Dialog Delete */}
      <AlertDialog open={actionState.type === 'delete'} onOpenChange={(open) => !open && onClose()}>
        <AlertDialogContent className="w-[90%] max-w-[360px] rounded-md p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-lg font-semibold">Hapus Paket?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-[15px] mt-2 mb-4 text-foreground/80">
              Tindakan ini tidak dapat dibatalkan. <strong>{actionState.package?.name}</strong> akan dihapus secara permanen dari sistem.
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
