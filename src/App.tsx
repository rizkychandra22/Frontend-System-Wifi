import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
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

const RoleRoute = ({ allowedRoles, children }: { allowedRoles: string[]; children: React.ReactNode }) => {
  const user = getUserData();
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
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
          {/* Admin Routes */}
          <Route path="/dashboard/users" element={
            <RoleRoute allowedRoles={['admin']}>
              <UsersPage />
            </RoleRoute>
          } />
          <Route path="/dashboard/attendance" element={
            <RoleRoute allowedRoles={['admin']}>
              <AdminAttendancePage />
            </RoleRoute>
          } />
          <Route path="/dashboard/wifi-packages" element={
            <RoleRoute allowedRoles={['admin']}>
              <WifiPackagesPage />
            </RoleRoute>
          } />
          <Route path="/dashboard/payments" element={
            <RoleRoute allowedRoles={['admin']}>
              <PaymentsPage />
            </RoleRoute>
          } />
          {/* Employee Routes */}
          <Route path="/attendance/record" element={
            <RoleRoute allowedRoles={['employee']}>
              <AttendanceRecordPage />
            </RoleRoute>
          } />
          <Route path="/attendance/history" element={
            <RoleRoute allowedRoles={['employee']}>
              <AttendanceHistoryPage />
            </RoleRoute>
          } />          
          <Route path="/employee/add-customers" element={
            <RoleRoute allowedRoles={['employee']}>
              <EmployeeCustomersPage />
            </RoleRoute>
          } />
          {/* Customer Routes */}
          <Route path="/subscriptions" element={<CustomerSubscriptionsPage />} />
          <Route path="/billing-history" element={<CustomerBillingHistoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
