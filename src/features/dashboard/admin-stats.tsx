import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Wifi, CreditCard, UserCheck } from "lucide-react";
import { useUsers } from "@/features/user/hooks/use-users";
import { useEffect, useState } from "react";
import { paymentApi, type Payment } from "@/lib/api/payment";
import { useAllAttendance } from "@/features/attendance/hooks/use-attendance";

export function AdminDashboardStats() {
  const { users } = useUsers();
  const { attendances } = useAllAttendance();
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    paymentApi.getAllPayments().then(setPayments).catch(console.error);
  }, []);

  const totalEmployees = users.filter((u) => u.role === "employee").length;
  const totalCustomers = users.filter((u) => u.role === "customer").length;

  // Simplified today logic:
  const today = new Date().toISOString().split('T')[0];
  const todayAttendances = attendances.filter(a => a.date.startsWith(today));
  const totalPresent = todayAttendances.filter(a => ["Proses", "Hadir"].includes(a.status)).length;
  
  const pendingPayments = payments.filter(p => p.status.toLowerCase() !== "paid" && p.status.toLowerCase() !== "lunas").length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Karyawan</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEmployees}</div>
          <p className="text-xs text-muted-foreground">Karyawan terdaftar</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pelanggan</CardTitle>
          <Wifi className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCustomers}</div>
          <p className="text-xs text-muted-foreground">Pelanggan WiFi</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tagihan Tertunda</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingPayments}</div>
          <p className="text-xs text-muted-foreground">Menunggu pembayaran</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Kehadiran Hari Ini</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPresent} / {totalEmployees}</div>
          <p className="text-xs text-muted-foreground">Karyawan hadir</p>
        </CardContent>
      </Card>
    </div>
  );
}
