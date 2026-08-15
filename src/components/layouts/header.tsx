import { Link, useLocation } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Bell, Search, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/tema-ui";
import { toast } from "sonner";

// Custom Label Dictionary (Opsional untuk nama khusus)
const customLabels: Record<string, string> = {
  "users": "Data Pengguna",
  "attendance": "Data Absensi",
  "record": "Rekap Absensi",
  "history": "Riwayat Absensi",
  "invoices": "Tagihan",
  "subscriptions": "Langganan Wifi",
  "billing-history": "Riwayat Tagihan",
};

export function Header() {
  const location = useLocation();
  const url = location.pathname;
  const { theme, setTheme } = useTheme();

  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  // 1. Ekstrak path URL & pisahkan query string (jika ada)
  const pathWithoutQuery = url.split("?")[0];
  const allSegments = pathWithoutQuery.split("/").filter(Boolean);

  // 2. Hilangkan 'dashboard' dari array jika sudah di segment awal (agar tidak double)
  const routeSegments = allSegments[0] === "dashboard" ? allSegments.slice(1) : allSegments;

  // Helper Formatter Nama Halaman
  const formatSegment = (segment: string) => {
    if (customLabels[segment.toLowerCase()]) {
      return customLabels[segment.toLowerCase()];
    }
    // Jika segment berupa ID angka, bisa ditulis 'Detail' / biarkan angkanya
    if (!isNaN(Number(segment))) {
      return `#${segment}`;
    }
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/40 bg-card/80 px-4 backdrop-blur-sm sticky top-0 z-10 dark:bg-background/80">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-2 rounded-xl" />
        <div className="mx-2 h-4 w-px bg-border/40 md:block" />

        <div className="md:block">
          <Breadcrumb>
            <BreadcrumbList>
              {/* Root Item: Dashboard */}
              <BreadcrumbItem>
                {routeSegments.length === 0 ? (
                  <BreadcrumbPage className="text-[13px] font-medium">Dashboard</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to="/dashboard" className="text-[13px]">
                      Dashboard
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {/* Looping Segments Bertingkat */}
              {routeSegments.map((segment, index) => {
                if (segment === "attendance" && (routeSegments[index + 1] === "record" || routeSegments[index + 1] === "history")) {
                  return null;
                }

                const isLast = index === routeSegments.length - 1;

                // Susun href URL secara bertingkat
                const href = `/${routeSegments.slice(0, index + 1).join("/")}`;

                return (
                  <div key={href} className="inline-flex items-center gap-1.5">
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage className="text-[13px] font-medium">
                          {formatSegment(segment)}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={href} className="text-[13px]">
                            {formatSegment(segment)}
                          </Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Right Controls Header */}
      <div className="ml-auto flex items-center gap-1">
        <div className="relative hidden md:flex items-center w-64 mr-2">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari data..."
            className="pl-9 h-8 bg-muted/50 border-none rounded-lg text-[13px] cursor-pointer"
            onClick={() => toast.info("Fitur pencarian masih dalam tahap pengembangan.")}
            readOnly
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-xl w-8 h-8"
          onClick={() => toast.info("Fitur notifikasi masih dalam tahap pengembangan.")}
        >
          <Bell className="w-[18px] h-[18px] text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-card"></span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-xl w-8 h-8"
          aria-label="Ubah Tema"
        >
          {isDark ? (
            <Sun className="w-[18px] h-[18px] text-muted-foreground" />
          ) : (
            <Moon className="w-[18px] h-[18px] text-muted-foreground" />
          )}
        </Button>
      </div>
    </header>
  );
}
