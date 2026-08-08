import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  MapPin,
  FileText,
  CreditCard,
  Wifi,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AppSidebar() {
  const location = useLocation();
  const url = location.pathname;
  const navigate = useNavigate();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Mock User (Akan diganti dengan State Authentication nantinya)
  const user = {
    name: "Budi Santoso",
    username: "budi.admin",
    roles: ["Admin"],
  };

  const hasRole = (roleNames: string | string[]) => {
    if (!user?.roles) return false;
    if (Array.isArray(roleNames)) {
      return roleNames.some((role) => user.roles?.includes(role));
    }
    return user.roles.includes(roleNames);
  };

  const [data, setData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    password: "",
    password_confirmation: "",
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileModalOpen(false);
    toast.success("Profil berhasil diperbarui");
  };

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return url === path;
    }
    return url === path || url.startsWith(path + "/");
  };

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="border-b border-border/40 px-4 py-4">
        <Link to="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <Wifi className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold tracking-tight font-display">System WiFi</span>
            <span className="text-[10px] text-muted-foreground uppercase">Management</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2 no-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Beranda
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {hasRole("Admin") && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/admin/dashboard", true)}
                    className="rounded-xl transition-all data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium"
                  >
                    <Link to="/admin/dashboard">
                      <LayoutDashboard className="w-[18px] h-[18px]" />
                      <span className="text-[13px]">Dashboard Admin</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {hasRole("Employee") && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/employee/dashboard", true)}
                    className="rounded-xl transition-all data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium"
                  >
                    <Link to="/employee/dashboard">
                      <MapPin className="w-[18px] h-[18px]" />
                      <span className="text-[13px]">Dashboard Pegawai</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              
              {hasRole("Customer") && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/customer/dashboard", true)}
                    className="rounded-xl transition-all data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium"
                  >
                    <Link to="/customer/dashboard">
                      <CreditCard className="w-[18px] h-[18px]" />
                      <span className="text-[13px]">Dashboard Pelanggan</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {hasRole("Admin") && (
          <SidebarGroup>
            <SidebarGroupLabel className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 mt-2">
              Menu Pegawai & Pelanggan
            </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                    asChild
                    isActive={isActive("/admin/employees")}
                    className="rounded-xl transition-all data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium"
                  >
                    <Link to="/admin/employees">
                      <Users className="w-[18px] h-[18px]" />
                      <span className="text-[13px]">Data Pegawai</span>
                    </Link>
                  </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                    asChild
                    isActive={isActive("/admin/customers")}
                    className="rounded-xl transition-all data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium"
                  >
                    <Link to="/admin/customers">
                      <Users className="w-[18px] h-[18px]" />
                      <span className="text-[13px]">Data Pelanggan WiFi</span>
                    </Link>
                  </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                    asChild
                    isActive={isActive("/admin/invoices")}
                    className="rounded-xl transition-all data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium"
                  >
                    <Link to="/admin/invoices">
                      <FileText className="w-[18px] h-[18px]" />
                      <span className="text-[13px]">Tagihan / Invoice</span>
                    </Link>
                  </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-3">
        <div className="w-full flex items-center gap-2.5 p-1.5 h-auto">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {user?.name ? user.name.charAt(0) + user.name.split(" ").pop()?.charAt(0) : "BS"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 text-left overflow-hidden">
            <span className="text-[13px] font-medium truncate">{user?.name || "Akun User"}</span>
            <span className="text-[10px] text-muted-foreground truncate">
              {user?.roles?.join(", ") + " - " + user?.username || "@username"}
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
              <DialogTrigger asChild>
                <button
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  aria-label="Pengaturan"
                  title="Pengaturan"
                >
                  <Settings className="w-[18px] h-[18px]" />
                </button>
              </DialogTrigger>
              <DialogContent className="rounded-md w-[90%] sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Update Profil</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={onSubmit}
                  className="flex flex-col gap-4 py-4 max-h-[75vh] overflow-y-auto no-scrollbar px-1"
                >
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={(e) => setData({...data, name: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={data.username}
                      onChange={(e) => setData({...data, username: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="password">Password Baru</Label>
                    <Input
                      id="password"
                      type="password"
                      value={data.password}
                      onChange={(e) => setData({...data, password: e.target.value})}
                      placeholder="Kosongkan jika tidak ingin diubah"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="password_confirmation">Konfirmasi Password Baru</Label>
                    <Input
                      id="password_confirmation"
                      type="password"
                      value={data.password_confirmation}
                      onChange={(e) => setData({...data, password_confirmation: e.target.value})}
                      placeholder="Kosongkan jika tidak ingin diubah"
                    />
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button type="submit">
                      Simpan Perubahan
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label="Keluar"
                  title="Keluar"
                >
                  <LogOut className="w-[18px] h-[18px]" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[90%] max-w-[360px] rounded-md p-6">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-center text-lg font-semibold">
                    Keluar
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-center text-[15px] mt-2 mb-4 text-foreground/80">
                    Apakah Anda yakin ingin keluar?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex flex-row justify-center gap-3 mt-2">
                  <AlertDialogCancel className="w-24 mt-0 border border-border bg-background hover:bg-muted text-foreground rounded-lg h-8 text-[13px] font-medium">
                    Batal
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      navigate("/login");
                    }}
                    className="w-24  h-8 text-[13px] font-medium rounded-lg"
                  >
                    Ya, Keluar
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
