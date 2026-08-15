import { getUser } from "@/lib/auth-utils";
import { AdminDashboardStats } from "@/features/dashboard/admin-stats";
import { EmployeeDashboardStats } from "@/features/dashboard/employee-stats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ReceiptText, Wifi } from "lucide-react";

export function DashboardPage() {
  const user = getUser();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Halo, {user.name}</h1>
        <p className="text-muted-foreground">
          Selamat datang di Sistem Manajemen WiFi & Kehadiran.
        </p>
      </div>

      {user.role === "admin" && (
        <div className="space-y-6">
          <AdminDashboardStats />
        </div>
      )}

      {user.role === "employee" && (
        <div className="space-y-6">
          <EmployeeDashboardStats />
        </div>
      )}

      {user.role === "customer" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer border-t-4 border-t-green-500" onClick={() => navigate("/subscriptions")}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Paket WiFi</CardTitle>
              <Wifi className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription>Cek detail paket langganan aktif Anda.</CardDescription>
              <Button variant="link" className="px-0 mt-2">Lihat Paket &rarr;</Button>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors cursor-pointer border-t-4 border-t-orange-500" onClick={() => navigate("/billing-history")}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Tagihan & Pembayaran</CardTitle>
              <ReceiptText className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription>Riwayat invoice dan status tagihan.</CardDescription>
              <Button variant="link" className="px-0 mt-2">Cek Tagihan &rarr;</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
