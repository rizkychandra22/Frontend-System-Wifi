import { useState, useEffect } from "react";
import { usersApi, type User } from "@/lib/api/users";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Edit2, Trash2, ShieldAlert, Plus, Eye, Search } from "lucide-react";

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("employee");

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  // Selected user state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    role: "employee",
    address: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await usersApi.getUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Gagal mengambil data pengguna");
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await usersApi.createUser(formData);
      toast.success("Pengguna berhasil ditambahkan");
      setIsAddOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Gagal menambahkan pengguna");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      await usersApi.updateUser(selectedUser.id, formData);
      toast.success("Pengguna berhasil diperbarui");
      setIsEditOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Gagal memperbarui pengguna");
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await usersApi.deleteUser(selectedUser.id);
      toast.success("Pengguna berhasil dihapus");
      setIsDeleteOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Gagal menghapus pengguna");
    }
  };

  const handleResetIP = async () => {
    if (!selectedUser) return;
    try {
      await usersApi.resetUserIP(selectedUser.id);
      toast.success("IP pengguna berhasil direset");
      setIsResetOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Gagal mereset IP pengguna");
    }
  };

  const openEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      phone: user.phone,
      role: user.role,
      address: user.address || "",
    });
    setIsEditOpen(true);
  };

  const openView = (user: User) => {
    setSelectedUser(user);
    setIsViewOpen(true);
  };

  const openAdd = () => {
    setFormData({ name: "", phone: "", role: activeTab, address: "" });
    setIsAddOpen(true);
  };

  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(query) ||
      u.phone.toLowerCase().includes(query)
    );
  });

  const employees = filteredUsers.filter((u) => u.role === "employee");
  const customers = filteredUsers.filter((u) => u.role === "customer");

  const renderTable = (dataList: User[]) => (
    <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>No. Telp</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>Alamat</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                Tidak ada data pengguna.
              </TableCell>
            </TableRow>
          ) : (
            dataList.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  {user.ip_address ? (
                    <span className="text-green-600 dark:text-green-400 text-xs font-semibold px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                      Terkunci
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs font-medium px-2 py-1 bg-muted rounded-full">
                      Bebas
                    </span>
                  )}
                </TableCell>
                <TableCell>{user.address || "-"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-slate-500 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                      onClick={() => openView(user)}
                      title="Lihat Data"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                      onClick={() => openEdit(user)}
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsResetOpen(true);
                      }}
                      title="Reset IP"
                      disabled={!user.ip_address}
                    >
                      <ShieldAlert className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsDeleteOpen(true);
                      }}
                      title="Hapus"
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Pengguna</h2>
          <p className="text-muted-foreground text-sm">
            Kelola data karyawan dan pelanggan sistem WiFi.
          </p>
        </div>
      </div>

      <div className="w-full">
        <div className="w-full border-b border-border">
            <div className="flex flex-col sm:flex-row gap-4 w-full items-start sm:items-center">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto relative">
                <TabsList className="grid grid-cols-2 w-full sm:flex sm:w-auto h-auto p-0 bg-transparent sm:gap-6 justify-start rounded-none border-none">
                  <TabsTrigger 
                    value="employee"
                    className="rounded-none border-b-2 border-transparent px-1 pb-2.5 pt-1.5 font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground text-[13px]"
                  >
                    Karyawan ({employees.length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="customer"
                    className="rounded-none border-b-2 border-transparent px-1 pb-2.5 pt-1.5 font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground text-[13px]"
                  >
                    Pelanggan ({customers.length})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3 mt-4 mb-4">
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Cari nama atau no. telp..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 bg-muted/50 border border-border/60 rounded-lg text-[13px] shadow-none focus:bg-background transition-colors"
              />
            </div>
            
            <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto">
              <Button size="sm" onClick={openAdd} className="h-8 px-3.5 rounded-lg text-[13px] font-medium shrink-0 shadow-sm w-full sm:w-auto flex-none">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Tambah {activeTab === "employee" ? "Karyawan" : "Pelanggan"}
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} className="w-full">
            <TabsContent value="employee" className="mt-0">{renderTable(employees)}</TabsContent>
            <TabsContent value="customer" className="mt-0">{renderTable(customers)}</TabsContent>
          </Tabs>
        </div>

      {/* Dialog Tambah User */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah {formData.role === "employee" ? "Karyawan" : "Pelanggan"} Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">Nama Lengkap</Label>
              <Input
                id="add-name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-phone">Nomor HP</Label>
              <Input
                id="add-phone"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-address">Alamat (Opsional)</Label>
              <Textarea
                id="add-address"
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sheet Lihat Data User */}
      <Sheet open={isViewOpen} onOpenChange={setIsViewOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Detail Pengguna</SheetTitle>
            <SheetDescription>Informasi lengkap pengguna.</SheetDescription>
          </SheetHeader>
          <div className="space-y-5 mt-6">
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Nama Lengkap</Label>
              <div className="font-medium">{selectedUser?.name}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Nomor HP</Label>
              <div className="font-medium">{selectedUser?.phone}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Role</Label>
              <div className="font-medium capitalize">{selectedUser?.role === "employee" ? "Karyawan" : "Pelanggan"}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Alamat</Label>
              <div className="font-medium">{selectedUser?.address || "-"}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Status Device (IP)</Label>
              <div className="font-medium">
                {selectedUser?.ip_address || "-"}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Dialog Edit User */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pengguna</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nama Lengkap</Label>
              <Input
                id="edit-name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Nomor HP</Label>
              <Input
                id="edit-phone"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(val) => setFormData({ ...formData, role: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Karyawan</SelectItem>
                  <SelectItem value="customer">Pelanggan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Alamat (Opsional)</Label>
              <Textarea
                id="edit-address"
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit">Simpan Perubahan</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog Delete */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="w-[90%] max-w-[360px] rounded-md p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-lg font-semibold">Hapus Pengguna?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-[15px] mt-2 mb-4 text-foreground/80">
              Tindakan ini tidak dapat dibatalkan. Data {selectedUser?.name} akan dihapus secara permanen dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-row justify-center gap-3 mt-2">
            <AlertDialogCancel className="w-24 mt-0 border border-border bg-background hover:bg-muted text-foreground rounded-lg h-8 text-[13px] font-medium">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="w-24 h-8 text-[13px] font-medium rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Ya, Hapus
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert Dialog Reset IP */}
      <AlertDialog open={isResetOpen} onOpenChange={setIsResetOpen}>
        <AlertDialogContent className="w-[90%] max-w-[360px] rounded-md p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-lg font-semibold">Reset Device IP?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-[15px] mt-2 mb-4 text-foreground/80">
              Anda akan mereset kunci device untuk {selectedUser?.name}. Pengguna ini nantinya dapat login kembali dari perangkat baru.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-row justify-center gap-3 mt-2">
            <AlertDialogCancel className="w-24 mt-0 border border-border bg-background hover:bg-muted text-foreground rounded-lg h-8 text-[13px] font-medium">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetIP} className="w-24 h-8 text-[13px] font-medium rounded-lg bg-amber-500 hover:bg-amber-600 text-white">
              Ya, Reset
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
