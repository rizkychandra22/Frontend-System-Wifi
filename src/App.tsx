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
import { CustomersPage } from "@/pages/admin/customer";
import { WifiPackagesPage } from "@/pages/admin/wifi_package";
import { PaymentsPage } from "@/pages/admin/payment";
import { CustomerSubscriptionsPage } from "@/pages/customer/subscriptions";
import { CustomerBillingHistoryPage } from "@/pages/customer/billing-history";

import { DashboardPage } from "@/pages/dashboard";

const RootRedirect = () => {
  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
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
          <Route path="/dashboard/users" element={<UsersPage />} />
          <Route path="/dashboard/attendance" element={<AdminAttendancePage />} />
          <Route path="/dashboard/customers" element={<CustomersPage />} />
          <Route path="/dashboard/wifi-packages" element={<WifiPackagesPage />} />
          <Route path="/dashboard/payments" element={<PaymentsPage />} />
          {/* Employee Routes */}
          <Route path="/attendance/record" element={<AttendanceRecordPage />} />
          <Route path="/attendance/history" element={<AttendanceHistoryPage />} />          
          {/* Customer Routes */}
          <Route path="/subscriptions" element={<CustomerSubscriptionsPage />} />
          <Route path="/billing-history" element={<CustomerBillingHistoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
