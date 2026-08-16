import { getUser } from "@/lib/auth-utils";
import { AdminDashboardStats } from "@/features/dashboard/admin-stats";
import { EmployeeDashboardStats } from "@/features/dashboard/employee-stats";
import { CustomerDashboardStats } from "@/features/dashboard/customer-stats";

export function DashboardPage() {
  const user = getUser();

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
        <div className="space-y-6">
          <CustomerDashboardStats />
        </div>
      )}
    </div>
  );
}
