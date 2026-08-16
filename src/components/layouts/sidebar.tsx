import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
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
  Wifi,
  CalendarCheck,
  Receipt,
  ClipboardList
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getUserData, removeToken } from "@/lib/auth-utils";
import { useUpdateProfile, useUpdatePassword } from "@/features/auth/hooks/use-profile";

export function AppSidebar() {
  const location = useLocation();
  const url = location.pathname;
  const navigate = useNavigate();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const { updateProfile, isUpdating } = useUpdateProfile();
  const { updatePassword, isUpdatingPassword } = useUpdatePassword();

  const [user, setUser] = useState(getUserData());
  const role = user?.role?.toLowerCase() || "";

  useEffect(() => {
    const handleProfileUpdate = () => {
      setUser(getUserData());
    };
    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () => window.removeEventListener("profileUpdated", handleProfileUpdate);
  }, []);

  const hasRole = (roleNames: string | string[]) => {
    if (!role) return false;
    if (Array.isArray(roleNames)) {
      return roleNames.map(r => r.toLowerCase()).includes(role);
    }
    return role === roleNames.toLowerCase();
  };

  const [data, setData] = useState({
    name: (user?.name as string) || "",
    phone: (user?.phone as string) || "",
    address: (user?.address as string) || "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Keep form data synced with user data if it updates externally
  useEffect(() => {
    if (!isProfileModalOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setData({
        name: (user?.name as string) || "",
        phone: (user?.phone as string) || "",
        address: (user?.address as string) || "",
      });
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [user, isProfileModalOpen]);

  const onSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        name: data.name,
        phone: data.phone,
        address: data.address,
      });

      toast.success("Profil berhasil diperbarui");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || "Gagal memperbarui profil");
    }
  };

  const onSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Konfirmasi password baru tidak cocok!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password baru harus minimal 6 karakter!");
      return;
    }

    try {
      await updatePassword({
        old_password: passwordData.oldPassword,
        new_password: passwordData.newPassword,
      });

      toast.success("Password berhasil diperbarui!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || "Gagal memperbarui password");
    }
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
        <Link to="/dashboard" className="flex items-center gap-2.5">
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
            Beranda {user?.role}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {hasRole(["admin", "employee", "customer"]) && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/dashboard", true)}
                    className="rounded-xl transition-all data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium"
                  >
                    <Link to="/dashboard">
                      <LayoutDashboard className="w-[18px] h-[18px]" />
                      <span className="text-[13px]">Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {hasRole("employee") && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive("/attendance/record")}
                      className="rounded-xl transition-all data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium"
                    >
                      <Link to="/attendance/record">
                        <MapPin className="w-[18px] h-[18px]" />
                        <span className="text-[13px]">Rekap Absensi</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive("/attendance/history")}
                      className="rounded-xl transition-all data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium"
                    >
                      <Link to="/attendance/history">
                        <ClipboardList className="w-[18px] h-[18px]" />
                        <span className="text-[13px]">Riwayat Absensi</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}

              {hasRole("customer") && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive("/subscriptions")}
                      className="rounded-xl transition-all data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium"
                    >
                      <Link to="/subscriptions">
                        <Wifi className="w-[18px] h-[18px]" />
                        <span className="text-[13px]">Layanan WiFi</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive("/billing-history")}
                      className="rounded-xl transition-all data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium"
                    >
                      <Link to="/billing-history">
                        <Receipt className="w-[18px] h-[18px]" />
                        <span className="text-[13px]">Riwayat Tagihan</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {hasRole("employee") && (
          <SidebarGroup>
            <SidebarGroupLabel className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 mt-2">
              Menu Utama
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/employee/add-customers")}
                    className="rounded-xl transition-all data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium"
                  >
                    <Link to="/employee/add-customers">
                      <Users className="w-[18px] h-[18px]" />
                      <span className="text-[13px]">Data Pelanggan</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/dashboard/payments")}
                    className="rounded-xl transition-all data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium"
                  >
                    <Link to="/dashboard/payments">
                      <FileText className="w-[18px] h-[18px]" />
                      <span className="text-[13px]">Pembayaran</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {hasRole("admin") && (
          <SidebarGroup>
            <SidebarGroupLabel className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 mt-2">
              Menu Utama
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/dashboard/users")}
                    className="rounded-xl transition-all data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium"
                  >
                    <Link to="/dashboard/users">
                      <Users className="w-[18px] h-[18px]" />
                      <span className="text-[13px]">Data Pengguna</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/dashboard/attendance")}
                    className="rounded-xl transition-all data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium"
                  >
                    <Link to="/dashboard/attendance">
                      <CalendarCheck className="w-[18px] h-[18px]" />
                      <span className="text-[13px]">Data Absensi</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/dashboard/wifi-packages")}
                    className="rounded-xl transition-all data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium"
                  >
                    <Link to="/dashboard/wifi-packages">
                      <Wifi className="w-[18px] h-[18px]" />
                      <span className="text-[13px]">Paket WiFi</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/dashboard/payments")}
                    className="rounded-xl transition-all data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium"
                  >
                    <Link to="/dashboard/payments">
                      <FileText className="w-[18px] h-[18px]" />
                      <span className="text-[13px]">Pembayaran</span>
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
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary uppercase">
              {user?.name ? (user.name.charAt(0) + (user.name.split(" ").pop()?.charAt(0) || "")).substring(0, 2) : "US"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 text-left overflow-hidden">
            <span className="text-[13px] font-medium truncate capitalize">{user?.name || "Akun User"}</span>
            <span className="text-[10px] text-muted-foreground truncate uppercase">
              {user?.phone || ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
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
                  <DialogTitle>Pengaturan Akun</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-6 py-4 max-h-[75vh] overflow-y-auto no-scrollbar px-1">
                  
                  {/* Form Profil Utama */}
                  <form onSubmit={onSubmitProfile} className="flex flex-col gap-4">
                    <h3 className="text-sm font-semibold text-primary">Informasi Profil</h3>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="phone">Nomor Telepon</Label>
                      <Input
                        id="phone"
                        value={data.phone}
                        onChange={(e) => setData({ ...data, phone: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="address">Alamat</Label>
                      <Textarea
                        id="address"
                        value={data.address}
                        onChange={(e) => setData({ ...data, address: e.target.value })}
                        placeholder="Masukkan alamat Anda"
                      />
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button type="submit" size="sm" disabled={isUpdating}>
                        {isUpdating ? "Menyimpan..." : "Simpan Profil"}
                      </Button>
                    </div>
                  </form>

                  {/* Form Ganti Password Khusus Admin */}
                  {hasRole("admin") && (
                    <form onSubmit={onSubmitPassword} className="flex flex-col gap-4 border-t pt-4">
                      <h3 className="text-sm font-semibold text-primary">Ubah Password</h3>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="oldPassword">Password Lama</Label>
                        <Input
                          id="oldPassword"
                          type="password"
                          value={passwordData.oldPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="newPassword">Password Baru</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          required
                        />
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button type="submit" size="sm" disabled={isUpdatingPassword}>
                          {isUpdatingPassword ? "Memperbarui..." : "Perbarui Password"}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
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
                      removeToken();
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
