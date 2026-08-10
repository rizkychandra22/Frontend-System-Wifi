import { useState, useEffect } from "react";
import { type User } from "@/lib/api/users";
import { useCreateUser, useUpdateUser, useDeleteUser, useResetUserIP } from "@/features/user/hooks/use-users";
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
import { UserForm, type UserFormData } from "./form";
import { UserDetail } from "./detail";

export type ActionState = {
  type: 'add' | 'edit' | 'view' | 'delete' | 'reset' | null;
  user: User | null;
  role?: string;
};

interface UserActionsProps {
  actionState: ActionState;
  onClose: () => void;
}

export function UserActions({ actionState, onClose }: UserActionsProps) {
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { mutate: resetIP, isPending: isResetting } = useResetUserIP();

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    phone: "",
    role: "employee",
    address: "",
  });

  useEffect(() => {
    if (actionState.type === 'edit' && actionState.user) {
      setFormData({
        name: actionState.user.name,
        phone: actionState.user.phone,
        role: actionState.user.role,
        address: actionState.user.address || "",
      });
    } else if (actionState.type === 'add') {
      setFormData({
        name: "",
        phone: "",
        role: actionState.role || "employee",
        address: "",
      });
    }
  }, [actionState]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser(formData, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionState.user) return;
    updateUser({ id: actionState.user.id, data: formData }, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  const handleDelete = () => {
    if (!actionState.user) return;
    deleteUser(actionState.user.id, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  const handleResetIP = () => {
    if (!actionState.user) return;
    resetIP(actionState.user.id, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <>
      {/* Dialog Tambah User */}
      <Dialog open={actionState.type === 'add'} onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah {formData.role === "employee" ? "Karyawan" : "Pelanggan"} Baru</DialogTitle>
          </DialogHeader>
          <UserForm 
            initialData={formData}
            onChange={setFormData}
            onSubmit={handleAddSubmit}
            isSubmitting={isCreating}
            submitLabel="Simpan"
            showRoleSelect={false}
          />
        </DialogContent>
      </Dialog>

      {/* Sheet Lihat Data User */}
      <UserDetail 
        user={actionState.user} 
        isOpen={actionState.type === 'view'} 
        onOpenChange={(open) => !open && onClose()} 
      />

      {/* Dialog Edit User */}
      <Dialog open={actionState.type === 'edit'} onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pengguna</DialogTitle>
          </DialogHeader>
          <UserForm 
            initialData={formData}
            onChange={setFormData}
            onSubmit={handleEditSubmit}
            isSubmitting={isUpdating}
            submitLabel="Simpan Perubahan"
            showRoleSelect={true}
          />
        </DialogContent>
      </Dialog>

      {/* Alert Dialog Delete */}
      <AlertDialog open={actionState.type === 'delete'} onOpenChange={(open) => !open && onClose()}>
        <AlertDialogContent className="w-[90%] max-w-[360px] rounded-md p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-lg font-semibold">Hapus Pengguna?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-[15px] mt-2 mb-4 text-foreground/80">
              Tindakan ini tidak dapat dibatalkan. Data {actionState.user?.name} akan dihapus secara permanen dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-row justify-center gap-3 mt-2">
            <AlertDialogCancel className="w-24 mt-0 border border-border bg-background hover:bg-muted text-foreground rounded-lg h-8 text-[13px] font-medium">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="w-24 h-8 text-[13px] font-medium rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {isDeleting ? "Menghapus..." : "Ya, Hapus"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert Dialog Reset IP */}
      <AlertDialog open={actionState.type === 'reset'} onOpenChange={(open) => !open && onClose()}>
        <AlertDialogContent className="w-[90%] max-w-[360px] rounded-md p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-lg font-semibold">Reset Device IP?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-[15px] mt-2 mb-4 text-foreground/80">
              Anda akan mereset kunci device untuk {actionState.user?.name}. Pengguna ini nantinya dapat login kembali dari perangkat baru.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-row justify-center gap-3 mt-2">
            <AlertDialogCancel className="w-24 mt-0 border border-border bg-background hover:bg-muted text-foreground rounded-lg h-8 text-[13px] font-medium">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetIP} disabled={isResetting} className="w-24 h-8 text-[13px] font-medium rounded-lg bg-amber-500 hover:bg-amber-600 text-white">
              {isResetting ? "Mereset..." : "Ya, Reset"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
