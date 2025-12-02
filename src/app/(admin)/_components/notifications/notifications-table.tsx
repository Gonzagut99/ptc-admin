"use client";

import { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  Bell,
  Check,
  CheckCheck,
  FileText,
  CreditCard,
  Users,
  AlertTriangle,
  Info,
  Package,
  UserPlus,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useNotifications, useMarkNotificationAsRead } from "../../_hooks/use-notifications";
import type { components } from "@/lib/api/api";
import {
  notificationTypeLabels,
  notificationTypeColors,
  getNotificationCategory,
  type NotificationType,
  type NotificationCategory,
} from "@/types/notifications.types";

type DUserNotification = components["schemas"]["DUserNotification"];

interface NotificationsTableProps {
  userId: number;
}

// Iconos por categoría
const categoryIcons: Record<NotificationCategory, React.ReactNode> = {
  LIQUIDATION: <FileText className="h-4 w-4" />,
  PAYMENT: <CreditCard className="h-4 w-4" />,
  SERVICE: <Package className="h-4 w-4" />,
  INCIDENCY: <AlertTriangle className="h-4 w-4" />,
  CUSTOMER: <Users className="h-4 w-4" />,
  STAFF: <UserPlus className="h-4 w-4" />,
  USER: <Users className="h-4 w-4" />,
  SYSTEM: <Info className="h-4 w-4" />,
};

export function NotificationsTable({ userId }: NotificationsTableProps) {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error, refetch } = useNotifications({
    userId,
    page,
    size: pageSize,
    enabled: userId > 0,
  });

  const markAsRead = useMarkNotificationAsRead();

  const handleMarkAsRead = async (userNotificationId: number) => {
    try {
      await markAsRead.mutateAsync({ userNotificationId });
    } catch (error) {
      console.error("Error al marcar como leída:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!data?.content) return;

    const unreadNotifications = data.content.filter((n) => !n.read);
    for (const notification of unreadNotifications) {
      if (notification.id) {
        try {
          await markAsRead.mutateAsync({ userNotificationId: notification.id });
        } catch (error) {
          console.error("Error al marcar como leída:", error);
        }
      }
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
      return { relative: "Fecha desconocida", full: "N/A" };
    }
    const date = new Date(dateString);
    return {
      relative: formatDistanceToNow(date, { addSuffix: true, locale: es }),
      full: format(date, "dd/MM/yyyy HH:mm", { locale: es }),
    };
  };

  const unreadCount = data?.content?.filter((n) => !n.read).length ?? 0;
  const totalPages = data?.page?.totalPages ?? 1;

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Error al cargar notificaciones</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => void refetch()}>
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificaciones
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} sin leer
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Historial de eventos y actividades del sistema
          </CardDescription>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={markAsRead.isPending}
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Marcar todas como leídas
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : data?.content && data.content.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Estado</TableHead>
                  <TableHead className="w-[180px]">Tipo</TableHead>
                  <TableHead>Mensaje</TableHead>
                  <TableHead className="w-[150px]">Fecha</TableHead>
                  <TableHead className="w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.content.map((notification) => (
                  <NotificationRow
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    formatDate={formatDate}
                    isPending={markAsRead.isPending}
                  />
                ))}
              </TableBody>
            </Table>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => setPage(pageNum)}
                            isActive={page === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        className={
                          page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay notificaciones</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface NotificationRowProps {
  notification: DUserNotification;
  onMarkAsRead: (id: number) => void;
  formatDate: (date: string | undefined) => { relative: string; full: string };
  isPending: boolean;
}

function NotificationRow({ notification, onMarkAsRead, formatDate, isPending }: NotificationRowProps) {
  const notifData = notification.notification;
  const type = (notifData?.type as NotificationType) || "SYSTEM_INFO";
  const category = getNotificationCategory(type);
  const dateInfo = formatDate(notification.createdDate);

  return (
    <TableRow className={!notification.read ? "bg-muted/50" : ""}>
      <TableCell>
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center ${
            notification.read ? "bg-muted" : "bg-primary/10"
          }`}
        >
          {categoryIcons[category]}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className={notificationTypeColors[type] || "bg-gray-100"}>
          {notificationTypeLabels[type] || type}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          {notifData?.title && <span className="font-medium">{notifData.title}</span>}
          <span className={!notifData?.title ? "" : "text-sm text-muted-foreground"}>
            {notifData?.message}
          </span>
          {notifData?.referenceId && (
            <span className="text-xs text-muted-foreground">
              Ref: {notifData.referenceType} #{notifData.referenceId}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="text-sm">{dateInfo.relative}</span>
          <span className="text-xs text-muted-foreground">{dateInfo.full}</span>
        </div>
      </TableCell>
      <TableCell>
        {!notification.read && notification.id !== undefined && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMarkAsRead(notification.id as number)}
            disabled={isPending}
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
