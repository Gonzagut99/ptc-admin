import { cookies } from "next/headers";
import KBar from "@/components/kbar";
import Header from "@/components/layout/header";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import "../globals.css";
import { ThemeProvider } from "@/contexts/theme-context";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <KBar>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <SidebarInset className="h-svh flex flex-col overflow-hidden">
            <Header />
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-card">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </KBar>
    </ThemeProvider>
  );
}
