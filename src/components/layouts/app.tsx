import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./sidebar";
import { Header } from "./header";
import { ThemeProvider } from "@/components/tema-ui";

export function AppLayout() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto bg-card dark:bg-background p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
