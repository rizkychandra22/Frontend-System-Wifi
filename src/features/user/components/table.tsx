import { type User } from "@/lib/api/users";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, ShieldAlert, Eye } from "lucide-react";

interface UserTableProps {
  users: User[];
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onResetIP: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserTable({ users, onView, onEdit, onResetIP, onDelete }: UserTableProps) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>No. Telp</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Created By User</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                No Data Users.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  {user.ip_address ? (
                    <span className="text-green-600 dark:text-green-400 text-xs font-semibold px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                      Locked
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs font-medium px-2 py-1 bg-muted rounded-full">
                      Free
                    </span>
                  )}
                </TableCell>
                <TableCell>{user.address || "-"}</TableCell>
                <TableCell>
                  {user.registered_by 
                    ? `${user.registered_by.role === 'admin' ? 'Admin' : 'Employee'} - ${user.registered_by.name}` 
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-slate-500 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                      onClick={() => onView(user)}
                      title="View Data"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                      onClick={() => onEdit(user)}
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950"
                      onClick={() => onResetIP(user)}
                      title="Reset IP"
                      disabled={!user.ip_address}
                    >
                      <ShieldAlert className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(user)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
