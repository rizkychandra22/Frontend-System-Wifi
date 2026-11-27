import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AppLayout } from "@/components/layouts/app";
import { WebLayout } from "@/components/layouts/web";
import { Toaster } from "@/components/ui/sonner";
import { getUserData } from "@/lib/auth-utils";
import "./App.css";

// Lazy Load (Public Landing, Authentication, Dashboard, Admin, Employee, Customer)
const HomePage = lazy(() => import("@/pages/landing/home-page").then((m) => ({ default: m.HomePage })));
const AboutPage = lazy(() => import("@/pages/landing/about-page").then((m) => ({ default: m.AboutPage })));
const PackagePage = lazy(() => import("@/pages/landing/package-page").then((m) => ({ default: m.PackagePage })));
const ActivityPage = lazy(() => import("@/pages/landing/activity-page").then((m) => ({ default: m.ActivityPage })));
const ContactPage = lazy(() => import("@/pages/landing/contact-page").then((m) => ({ default: m.ContactPage })));
const LoginPage = lazy(() => import("@/pages/auth/login").then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import("@/pages/dashboard").then((m) => ({ default: m.DashboardPage })));
const PaymentsPage = lazy(() => import("@/pages/admin/payment").then((m) => ({ default: m.PaymentsPage })));
const PayrollSlipPage = lazy(() => import("@/pages/admin/reports/employee/payroll-slip").then((m) => ({ default: m.PayrollSlipPage })));
const UsersPage = lazy(() => import("@/pages/admin/users").then((m) => ({ default: m.UsersPage })));
const AdminAttendancePage = lazy(() => import("@/pages/admin/attendance").then((m) => ({ default: m.AdminAttendancePage })));
const WifiPackagesPage = lazy(() => import("@/pages/admin/wifi-package").then((m) => ({ default: m.WifiPackagesPage })));
const AdminOvertimePage = lazy(() => import("@/pages/admin/overtime").then((m) => ({ default: m.AdminOvertimePage })));
const PaymentsReportPage = lazy(() => import("@/pages/admin/reports/payment").then((m) => ({ default: m.PaymentsReportPage })));
const AdminAttendanceReportPage = lazy(() => import("@/pages/admin/reports/attendance").then((m) => ({ default: m.AdminAttendanceReportPage })));
const AdminAllowancePage = lazy(() => import("@/pages/admin/allowance").then((m) => ({ default: m.AdminAllowancePage })));
const AttendanceRecordPage = lazy(() => import("@/pages/employee/attendance-record").then((m) => ({ default: m.AttendanceRecordPage })));
const AttendanceHistoryPage = lazy(() => import("@/pages/employee/attendance-history").then((m) => ({ default: m.AttendanceHistoryPage })));
const EmployeeCustomersPage = lazy(() => import("@/pages/employee/customers").then((m) => ({ default: m.EmployeeCustomersPage })));
const EmployeeOvertimePage = lazy(() => import("@/pages/employee/overtime").then((m) => ({ default: m.EmployeeOvertimePage })));
const EmployeeAllowancePage = lazy(() => import("@/pages/employee/allowance").then((m) => ({ default: m.EmployeeAllowancePage })));
const CustomerSubscriptionsPage = lazy(() => import("@/pages/customer/subscriptions").then((m) => ({ default: m.CustomerSubscriptionsPage })));
const CustomerBillingHistoryPage = lazy(() => import("@/pages/customer/billing-history").then((m) => ({ default: m.CustomerBillingHistoryPage })));

// Loading Fallback Component
function PageLoader() {
  return (
    <div className="flex h-[60vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2.5">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="text-xs text-muted-foreground font-medium">Memuat halaman...</span>
      </div>
    </div>
  );
}

// Protected Route Guard
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
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Web Landing Routes */}
          <Route element={<WebLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/package" element={<PackagePage />} />
            <Route path="/activity" element={<ActivityPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Auth Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Admin Routes */}
            <Route element={<ProtectedRouteGroup allowedRoles={["admin"]} />}>
              <Route path="/dashboard/users" element={<UsersPage />} />
              <Route path="/dashboard/wifi-packages" element={<WifiPackagesPage />} />
              <Route path="/dashboard/payments" element={<PaymentsPage />} />
              <Route path="/dashboard/attendance" element={<AdminAttendancePage />} />
              <Route path="/dashboard/overtime" element={<AdminOvertimePage />} />
              <Route path="/dashboard/allowances" element={<AdminAllowancePage />} />
              <Route path="/dashboard/payroll-slip" element={<PayrollSlipPage />} />
              <Route path="/dashboard/payments/report" element={<PaymentsReportPage />} />
              <Route path="/dashboard/attendance/report" element={<AdminAttendanceReportPage />} />
            </Route>

            {/* Employee Routes */}
            <Route element={<ProtectedRouteGroup allowedRoles={["employee"]} />}>
              <Route path="/attendance/record" element={<AttendanceRecordPage />} />
              <Route path="/attendance/history" element={<AttendanceHistoryPage />} />
              <Route path="/employee/payments" element={<PaymentsPage />} />
              <Route path="/employee/add-customers" element={<EmployeeCustomersPage />} />
              <Route path="/employee/overtime" element={<EmployeeOvertimePage />} />
              <Route path="/employee/allowances" element={<EmployeeAllowancePage />} />
              <Route path="/employee/payroll-slip" element={<PayrollSlipPage />} />
            </Route>

            {/* Customer Routes */}
            <Route path="/subscriptions" element={<CustomerSubscriptionsPage />} />
            <Route path="/billing-history" element={<CustomerBillingHistoryPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
