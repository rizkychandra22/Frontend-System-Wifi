import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layouts/app";
import { Toaster } from "@/components/ui/sonner";
import "./App.css";
import { LoginPage } from "@/pages/auth/login";
import { AttendanceRecordPage } from "@/pages/employee/attendance-record";
import { AttendanceHistoryPage } from "@/pages/employee/attendance-history";
import { isAuthenticated } from "@/lib/auth-utils";

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
          <Route path="/dashboard/users" element={<h1 className="text-2xl font-bold capitalize">Data Pengguna</h1>} />
          <Route path="/dashboard/attendance" element={<h1 className="text-2xl font-bold capitalize">Data Kehadiran</h1>} />
          <Route path="/dashboard/invoices" element={<h1 className="text-2xl font-bold capitalize">Tagihan / Invoice</h1>} />
          
          {/* Employee Routes */}
          <Route path="/attendance/record" element={<AttendanceRecordPage />} />
          <Route path="/attendance/history" element={<AttendanceHistoryPage />} />
          
          {/* Customer Routes */}
          <Route path="/subscriptions" element={<h1 className="text-2xl font-bold">Layanan WiFi Aktif</h1>} />
          <Route path="/billing-history" element={<h1 className="text-2xl font-bold">Riwayat Tagihan</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
