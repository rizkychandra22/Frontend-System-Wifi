import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layouts/app";
import { Toaster } from "@/components/ui/sonner";
import "./App.css";

// --- Komponen Halaman Placeholder (Sementara) ---
const DummyLogin = () => (
  <div className="flex h-screen items-center justify-center bg-background text-foreground">
    <div className="text-center">
      <h1 className="text-3xl font-display font-bold text-primary mb-2">Login</h1>
      <p className="text-muted-foreground">Silakan masuk ke akun Anda.</p>
    </div>
  </div>
);

const DummyAdminDashboard = () => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
    <p className="text-muted-foreground mt-2">Selamat datang di Panel Manajemen Pusat.</p>
  </div>
);

const DummyEmployeeDashboard = () => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <h1 className="text-2xl font-bold text-foreground">Dashboard Pegawai</h1>
    <p className="text-muted-foreground mt-2">Panel untuk absen harian dan riwayat kerja.</p>
  </div>
);

const DummyCustomerDashboard = () => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <h1 className="text-2xl font-bold text-foreground">Dashboard Pelanggan</h1>
    <p className="text-muted-foreground mt-2">Informasi tagihan WiFi Anda bulan ini.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/login" element={<DummyLogin />} />
        
        <Route element={<AppLayout />}>
          <Route path="admin/dashboard" element={<DummyAdminDashboard />} />
          <Route path="employee/dashboard" element={<DummyEmployeeDashboard />} />
          <Route path="customer/dashboard" element={<DummyCustomerDashboard />} />
          <Route path="admin/employees" element={<h1 className="text-2xl font-bold">Data Pegawai</h1>} />
          <Route path="admin/customers" element={<h1 className="text-2xl font-bold">Data Pelanggan</h1>} />
          <Route path="admin/invoices" element={<h1 className="text-2xl font-bold">Tagihan / Invoices</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
