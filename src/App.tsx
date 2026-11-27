import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { AppLayout } from "@/components/layouts/app";
import { WebLayout } from "@/components/layouts/web";
import { PageLoader } from "@/components/page-loader";
import { Toaster } from "@/components/ui/sonner";
import { getUserData } from "@/lib/auth-utils";
import "./App.css";

// Lazy Load (Public Web, Auth, Dashboard, Admin, Employee, Customer)
const HomePage = lazy(() => import("@/pages/web/home-page"));
const AboutPage = lazy(() => import("@/pages/web/about-page"));
const PackagePage = lazy(() => import("@/pages/web/package-page"));
const ActivityPage = lazy(() => import("@/pages/web/activity-page"));
const ContactPage = lazy(() => import("@/pages/web/contact-page"));
const LoginPage = lazy(() => import("@/pages/auth/login"));
const DashboardPage = lazy(() => import("@/pages/dashboard"));
const UsersPage = lazy(() => import("@/pages/admin/users"));
const WifiPackagesPage = lazy(() => import("@/pages/admin/wifi-package"));
const PaymentsPage = lazy(() => import("@/pages/admin/payment"));
const AdminAttendancePage = lazy(() => import("@/pages/admin/attendance"));
const AdminOvertimePage = lazy(() => import("@/pages/admin/overtime"));
const AdminAllowancePage = lazy(() => import("@/pages/admin/allowance"));
const PayrollSlipPage = lazy(() => import("@/pages/admin/reports/employee/payroll-slip"));
const PaymentsReportPage = lazy(() => import("@/pages/admin/reports/payment"));
const AdminAttendanceReportPage = lazy(() => import("@/pages/admin/reports/attendance"));
const AttendanceRecordPage = lazy(() => import("@/pages/employee/attendance-record"));
const AttendanceHistoryPage = lazy(() => import("@/pages/employee/attendance-history"));
const EmployeeCustomersPage = lazy(() => import("@/pages/employee/customers"));
const EmployeeOvertimePage = lazy(() => import("@/pages/employee/overtime"));
const EmployeeAllowancePage = lazy(() => import("@/pages/employee/allowance"));
const CustomerSubscriptionsPage = lazy(() => import("@/pages/customer/subscriptions"));
const CustomerBillingHistoryPage = lazy(() => import("@/pages/customer/billing-history"));

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
          {/* Public Web Routes */}
          <Route
            element={
              <Suspense fallback={<PageLoader variant="web" />}>
                <WebLayout />
              </Suspense>
            }
          >
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/package" element={<PackagePage />} />
            <Route path="/activity" element={<ActivityPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Auth Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            element={
              <Suspense fallback={<PageLoader variant="dashboard" />}>
                <AppLayout />
              </Suspense>
            }
          >
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
