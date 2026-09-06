import { useState, type FormEvent } from "react";
import type { Allowance } from "@/lib/api/allowance";
import { useAllowanceMutations } from "@/features/allowance/hooks/use-allowances";
import { useUsers } from "@/features/user/hooks/use-users";
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
import { AllowanceForm, type AllowanceFormData } from "./form";
import { AllowanceDetail } from "./detail";

export type AllowanceActionState = {
  type: "add" | "edit" | "delete" | "view" | null;
  allowance: Allowance | null;
};

interface AllowanceActionsProps {
  actionState: AllowanceActionState;
  onClose: () => void;
}

export function AllowanceActions({ actionState, onClose }: AllowanceActionsProps) {
  const { createMutation, updateMutation, deleteMutation } = useAllowanceMutations();
  const { users } = useUsers(true);
  const employees = users.filter((u) => u.role === "employee");

  const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  const [formData, setFormData] = useState<AllowanceFormData>({
    target_type: "global",
    user_id: "",
    month: getCurrentMonth(),
    title: "",
    amount: "",
    description: "",
  });

  const [prevActionState, setPrevActionState] = useState(actionState);
  if (actionState !== prevActionState) {
    setPrevActionState(actionState);
    if (actionState.type === "edit" && actionState.allowance) {
      setFormData({
        target_type: actionState.allowance.target_type,
        user_id: actionState.allowance.user_id ? actionState.allowance.user_id.toString() : "",
        month: actionState.allowance.month,
        title: actionState.allowance.title,
        amount: actionState.allowance.amount.toString(),
        description: actionState.allowance.description || "",
      });
    } else if (actionState.type === "add") {
      setFormData({
        target_type: "global",
        user_id: "",
        month: getCurrentMonth(),
        title: "",
        amount: "",
        description: "",
      });
    }
  }

  const handleAddSubmit = (e: FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      {
        target_type: formData.target_type,
        user_id: formData.target_type === "personal" && formData.user_id ? Number(formData.user_id) : null,
        month: formData.month,
        title: formData.title,
        amount: Number(formData.amount),
        description: formData.description,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleEditSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!actionState.allowance) return;
    updateMutation.mutate(
      {
        id: actionState.allowance.id,
        data: {
          target_type: formData.target_type,
          user_id: formData.target_type === "personal" && formData.user_id ? Number(formData.user_id) : null,
          month: formData.month,
          title: formData.title,
          amount: Number(formData.amount),
          description: formData.description,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleDelete = () => {
    if (!actionState.allowance) return;
    deleteMutation.mutate(actionState.allowance.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <>
      {/* Dialog Add */}
      <Dialog open={actionState.type === "add"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-lg w-[95%] sm:w-full max-h-[90vh] overflow-y-auto no-scrollbar">
          <DialogHeader>
            <DialogTitle>Beri Tunjangan / Bonus Karyawan</DialogTitle>
          </DialogHeader>
          <AllowanceForm
            initialData={formData}
            onChange={setFormData}
            onSubmit={handleAddSubmit}
            isSubmitting={createMutation.isPending}
            submitLabel="Beri Tunjangan"
            employees={employees}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog Edit */}
      <Dialog open={actionState.type === "edit"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-lg w-[95%] sm:w-full max-h-[90vh] overflow-y-auto no-scrollbar">
          <DialogHeader>
            <DialogTitle>Edit Tunjangan / Bonus</DialogTitle>
          </DialogHeader>
          <AllowanceForm
            initialData={formData}
            onChange={setFormData}
            onSubmit={handleEditSubmit}
            isSubmitting={updateMutation.isPending}
            submitLabel="Simpan Perubahan"
            employees={employees}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog Detail (View) */}
      <Dialog open={actionState.type === "view"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-md w-[95%] sm:w-full max-h-[90vh] overflow-y-auto no-scrollbar">
          <DialogHeader>
            <DialogTitle>Detail Tunjangan / Bonus</DialogTitle>
          </DialogHeader>
          {actionState.allowance && (
            <AllowanceDetail allowance={actionState.allowance} employeeCount={employees.length} />
          )}
        </DialogContent>
      </Dialog>

      {/* Alert Dialog Delete */}
      <AlertDialog open={actionState.type === "delete"} onOpenChange={(open) => !open && onClose()}>
        <AlertDialogContent className="w-[90%] max-w-[380px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">Hapus Tunjangan / Bonus?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-sm mt-1">
              Apakah Anda yakin ingin menghapus <strong>"{actionState.allowance?.title}"</strong>?
              Data yang dihapus tidak akan lagi terhitung pada slip gaji karyawan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-row justify-center gap-3 mt-3">
            <AlertDialogCancel className="w-24 h-8 text-[13px] font-medium rounded-lg">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="w-24 h-8 text-[13px] font-medium rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
