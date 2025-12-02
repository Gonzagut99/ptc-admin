"use client";

import { useAuth } from "@/contexts/auth-provider";
import { NotificationsTable } from "../_components/notifications/notifications-table";
import Container from "@/components/ui/container";
import PageContainer from "@/components/layout/page-container";

export default function NotificationsPage() {
  const { session, isLoading } = useAuth();
  const userId = session?.user?.id ?? 0;

  // Si ya tenemos userId, no necesitamos esperar a que isLoading sea false
  const showLoading = isLoading && !userId;

  if (showLoading) {
    return (
      <Container
        title="Notificaciones"
        description="Historial de eventos y actividades del sistema"
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Cargando sesión...</p>
        </div>
      </Container>
    );
  }

  if (!userId) {
    return (
      <Container
        title="Notificaciones"
        description="Historial de eventos y actividades del sistema"
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Debes iniciar sesión para ver las notificaciones</p>
        </div>
      </Container>
    );
  }

  return (
    <PageContainer scrollable={false}>
        <Container
          title="Notificaciones"
          description="Historial de eventos y actividades del sistema"
        >
          <div className="mt-6">
            <NotificationsTable userId={userId} />
          </div>
        </Container>
    </PageContainer>
  );
}
