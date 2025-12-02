"use client";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/auth-provider";
import { useDashboardData } from "./_hooks/use-dashboard-data";
import {
  DashboardStats,
  DashboardCharts,
  RecentLiquidations,
  UpcomingDeadlines,
  PaymentStatusChart,
} from "./_components/dashboard";
import { NotificationsTable } from "./_components/notifications/notifications-table";

export default function DashboardPage() {
  const { liquidations, isLoading, error } = useDashboardData();
  const { session } = useAuth();
  const userId = session?.user?.id;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen general de PTC Perú Titicaca & Connections
        </p>
      </div>

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            No se pudieron cargar los datos del dashboard. Verifica que el backend esté corriendo.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <DashboardStats liquidations={liquidations} isLoading={isLoading} />

      {/* Payment Status Charts */}
      <PaymentStatusChart liquidations={liquidations} isLoading={isLoading} />

      {/* Charts - Estados y Métodos de pago */}
      <DashboardCharts liquidations={liquidations} isLoading={isLoading} />

      {/* Two columns: Deadlines & Recent */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Deadlines */}
        <UpcomingDeadlines liquidations={liquidations} isLoading={isLoading} />

        {/* Recent Liquidations */}
        <RecentLiquidations liquidations={liquidations} isLoading={isLoading} />
      </div>

      {/* Notifications Section */}
      {userId && (
        <NotificationsTable userId={userId} />
      )}
    </div>
  );
}
