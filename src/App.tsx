import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { AppLayout } from "@/components/layouts/app";
import { Toaster } from "@/components/ui/sonner";
import "./App.css";
import { LoginPage } from "@/pages/auth/login";
import { AttendanceRecordPage } from "@/pages/employee/attendance-record";
import { AttendanceHistoryPage } from "@/pages/employee/attendance-history";
import { UsersPage } from "@/pages/admin/users";
import { AdminAttendancePage } from "@/pages/admin/attendance";
import { isAuthenticated } from "@/lib/auth-utils";
import { WifiPackagesPage } from "@/pages/admin/wifi_package";
import { PaymentsPage } from "@/pages/admin/payment";
import { CustomerSubscriptionsPage } from "@/pages/customer/subscriptions";
import { CustomerBillingHistoryPage } from "@/pages/customer/billing-history";
import { EmployeeCustomersPage } from "@/pages/employee/customers";

import { DashboardPage } from "@/pages/dashboard";
import { getUserData } from "@/lib/auth-utils";

const RootRedirect = () => {
  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

const ProtectedRouteGroup = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const user = getUserData();
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Shared Routes Admin & Employee */}
          <Route element={<ProtectedRouteGroup allowedRoles={['admin', 'employee']} />}>
            <Route path="/dashboard/payments" element={<PaymentsPage />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRouteGroup allowedRoles={['admin']} />}>
            <Route path="/dashboard/users" element={<UsersPage />} />
            <Route path="/dashboard/attendance" element={<AdminAttendancePage />} />
            <Route path="/dashboard/wifi-packages" element={<WifiPackagesPage />} />
          </Route>

          {/* Employee Routes */}
          <Route element={<ProtectedRouteGroup allowedRoles={['employee']} />}>
            <Route path="/attendance/record" element={<AttendanceRecordPage />} />
            <Route path="/attendance/history" element={<AttendanceHistoryPage />} />
            <Route path="/employee/add-customers" element={<EmployeeCustomersPage />} />
          </Route>

          {/* Customer Routes */}
          <Route path="/subscriptions" element={<CustomerSubscriptionsPage />} />
          <Route path="/billing-history" element={<CustomerBillingHistoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
