import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layouts/app";
import { Toaster } from "@/components/ui/sonner";
import "./App.css";
import { LoginPage } from "@/pages/auth/login";
import { AttendanceRecordPage } from "@/pages/employee/attendance-record";
import { AttendanceHistoryPage } from "@/pages/employee/attendance-history";
import { UsersPage } from "@/pages/admin/users";
import { isAuthenticated } from "@/lib/auth-utils";
import { CustomersPage } from "@/pages/admin/customer";
import { WifiPackagesPage } from "@/pages/admin/wifi_package";
import { PaymentsPage } from "@/pages/admin/payment";

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
          <Route path="/dashboard" element={<h1 className="text-2xl font-bold capitalize">Dashboard</h1>} />
          {/* Admin Routes */}
          <Route path="/dashboard/users" element={<UsersPage />} />
          <Route path="/dashboard/attendance" element={<h1 className="text-2xl font-bold capitalize">Attendance Data</h1>} />
          <Route path="/dashboard/customers" element={<CustomersPage />} />
          <Route path="/dashboard/wifi-packages" element={<WifiPackagesPage />} />
          <Route path="/dashboard/payments" element={<PaymentsPage />} />
          {/* Employee Routes */}
          <Route path="/attendance/record" element={<AttendanceRecordPage />} />
          <Route path="/attendance/history" element={<AttendanceHistoryPage />} />          
          {/* Customer Routes */}
          <Route path="/subscriptions" element={<h1 className="text-2xl font-bold">Active WiFi Services</h1>} />
          <Route path="/billing-history" element={<h1 className="text-2xl font-bold">Billing History</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
