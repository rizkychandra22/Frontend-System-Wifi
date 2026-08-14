import { useState } from "react";
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

  const [prevActionState, setPrevActionState] = useState(actionState);
  if (actionState !== prevActionState) {
    setPrevActionState(actionState);
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
  }

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
            <DialogTitle>Add New {formData.role === "employee" ? "Employee" : "Customer"}</DialogTitle>
          </DialogHeader>
          <UserForm 
            initialData={formData}
            onChange={setFormData}
            onSubmit={handleAddSubmit}
            isSubmitting={isCreating}
            submitLabel="Save"
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
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <UserForm 
            initialData={formData}
            onChange={setFormData}
            onSubmit={handleEditSubmit}
            isSubmitting={isUpdating}
            submitLabel="Save changes"
            showRoleSelect={true}
          />
        </DialogContent>
      </Dialog>

      {/* Alert Dialog Delete */}
      <AlertDialog open={actionState.type === 'delete'} onOpenChange={(open) => !open && onClose()}>
        <AlertDialogContent className="w-[90%] max-w-[360px] rounded-md p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-lg font-semibold">Delete User?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-[15px] mt-2 mb-4 text-foreground/80">
              This action cannot be undone. {actionState.user?.name}'s data will be permanently deleted from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-row justify-center gap-3 mt-2">
            <AlertDialogCancel className="w-24 mt-0 border border-border bg-background hover:bg-muted text-foreground rounded-lg h-8 text-[13px] font-medium">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="w-24 h-8 text-[13px] font-medium rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {isDeleting ? "Deleting..." : "Yes, Delete"}
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
              You will reset the device key for {actionState.user?.name}. This user will be able to log in again from a new device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-row justify-center gap-3 mt-2">
            <AlertDialogCancel className="w-24 mt-0 border border-border bg-background hover:bg-muted text-foreground rounded-lg h-8 text-[13px] font-medium">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetIP} disabled={isResetting} className="w-24 h-8 text-[13px] font-medium rounded-lg bg-amber-500 hover:bg-amber-600 text-white">
              {isResetting ? "Resetting..." : "Yes, Reset"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
