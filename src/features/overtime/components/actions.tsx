import { useState, type FormEvent } from "react";
import type { Overtime } from "@/lib/api/overtime";
import { useOvertimeMutations } from "@/features/overtime/hooks/use-overtimes";
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
import { OvertimeForm, type OvertimeFormData } from "./form";
import { OvertimeDetail } from "./detail";

export type ActionState = {
  type: 'add' | 'edit' | 'delete' | 'view' | null;
  overtime: Overtime | null;
};

interface OvertimeActionsProps {
  actionState: ActionState;
  onClose: () => void;
}

export function OvertimeActions({ actionState, onClose }: OvertimeActionsProps) {
  const { createMutation, updateMutation, deleteMutation } = useOvertimeMutations();
  const { users } = useUsers(true);
  const employees = users.filter((u) => u.role === "employee");

  const [formData, setFormData] = useState<OvertimeFormData>({
    user_id: "",
    title: "",
    description: "",
    date: "",
    start_time: "",
    end_time: "",
  });

  const [prevActionState, setPrevActionState] = useState(actionState);
  if (actionState !== prevActionState) {
    setPrevActionState(actionState);
    if (actionState.type === 'edit' && actionState.overtime) {
      setFormData({
        user_id: actionState.overtime.user_id.toString(),
        title: actionState.overtime.title,
        description: actionState.overtime.description,
        date: actionState.overtime.date.substring(0, 10),
        start_time: actionState.overtime.start_time.substring(11, 16),
        end_time: actionState.overtime.end_time.substring(11, 16),
      });
    } else if (actionState.type === 'add') {
      setFormData({
        user_id: "",
        title: "",
        description: "",
        date: "",
        start_time: "",
        end_time: "",
      });
    }
  }

  const handleAddSubmit = (e: FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { 
        user_id: formData.user_id ? Number(formData.user_id) : undefined,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time
      }, 
      {
        onSuccess: () => {
          onClose();
        }
      }
    );
  };

  const handleEditSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!actionState.overtime) return;
    updateMutation.mutate(
      { 
        id: actionState.overtime.id, 
        data: { 
          user_id: formData.user_id ? Number(formData.user_id) : undefined,
          title: formData.title,
          description: formData.description,
          date: formData.date,
          start_time: formData.start_time,
          end_time: formData.end_time
        } 
      }, 
      {
        onSuccess: () => {
          onClose();
        }
      }
    );
  };

  const handleDelete = () => {
    if (!actionState.overtime) return;
    deleteMutation.mutate(actionState.overtime.id, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <>
      <Dialog open={actionState.type === 'add'} onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajukan Lembur Baru</DialogTitle>
          </DialogHeader>
          <OvertimeForm 
            initialData={formData}
            onChange={setFormData}
            onSubmit={handleAddSubmit}
            isSubmitting={createMutation.isPending}
            submitLabel="Simpan"
            employees={employees}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={actionState.type === 'edit'} onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Data Lembur</DialogTitle>
          </DialogHeader>
          <OvertimeForm 
            initialData={formData}
            onChange={setFormData}
            onSubmit={handleEditSubmit}
            isSubmitting={updateMutation.isPending}
            submitLabel="Simpan Perubahan"
            employees={employees}
          />
        </DialogContent>
      </Dialog>

      <OvertimeDetail 
        overtime={actionState.overtime} 
        isOpen={actionState.type === 'view'} 
        onOpenChange={(open) => !open && onClose()} 
      />

      <AlertDialog open={actionState.type === 'delete'} onOpenChange={(open) => !open && onClose()}>
        <AlertDialogContent className="w-[90%] max-w-[360px] rounded-md p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-lg font-semibold">Hapus Data Lembur?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-[15px] mt-2 mb-4 text-foreground/80">
              Data lembur ini akan dihapus secara permanen.
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
