import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { AppLayout } from "@/components/layouts/app";
import { Toaster } from "@/components/ui/sonner";
import "./App.css";
// Import Page Auth
import { LoginPage } from "@/pages/auth/login";

// Import Page Admin
import { UsersPage } from "@/pages/admin/users";
import { AdminAttendancePage } from "@/pages/admin/attendance";
import { WifiPackagesPage } from "@/pages/admin/wifi-package";
import { PaymentsPage } from "@/pages/admin/payment";
import { AdminOvertimePage } from "@/pages/admin/overtime";
import { PaymentsReportPage } from "@/pages/admin/reports/payment";
import { AdminAttendanceReportPage } from "@/pages/admin/reports/attendance";
import { PayrollSlipPage } from "@/pages/admin/reports/payroll-slip";

// Import Page Employee
import { AttendanceRecordPage } from "@/pages/employee/attendance-record";
import { AttendanceHistoryPage } from "@/pages/employee/attendance-history";
import { EmployeeCustomersPage } from "@/pages/employee/customers";
import { EmployeeOvertimePage } from "@/pages/employee/overtime";

// Import Page Customer
import { CustomerSubscriptionsPage } from "@/pages/customer/subscriptions";
import { CustomerBillingHistoryPage } from "@/pages/customer/billing-history";

// Import Page Dashboard
import { DashboardPage } from "@/pages/dashboard";
import { getUserData } from "@/lib/auth-utils";
import { LandingPage } from "@/pages/landing";

// Definition routing
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
        <Route path="/" element={<LandingPage />} />
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
            <Route path="/dashboard/wifi-packages" element={<WifiPackagesPage />} />
            <Route path="/dashboard/attendance" element={<AdminAttendancePage />} />
            <Route path="/dashboard/overtime" element={<AdminOvertimePage />} />
            <Route path="/dashboard/payroll-slips" element={<PayrollSlipPage />} />
            <Route path="/dashboard/payments/report" element={<PaymentsReportPage />} />
            <Route path="/dashboard/attendance/report" element={<AdminAttendanceReportPage />} />
          </Route>

          {/* Employee Routes */}
          <Route element={<ProtectedRouteGroup allowedRoles={['employee']} />}>
            <Route path="/attendance/record" element={<AttendanceRecordPage />} />
            <Route path="/attendance/history" element={<AttendanceHistoryPage />} />
            <Route path="/employee/add-customers" element={<EmployeeCustomersPage />} />
            <Route path="/employee/overtime" element={<EmployeeOvertimePage />} />
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
