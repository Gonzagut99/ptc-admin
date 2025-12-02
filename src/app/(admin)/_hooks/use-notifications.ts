"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { enhancedFetch } from "@/lib/api-java/backend";
import type { components } from "@/lib/api/api";

type PagedModelDUserNotification = components["schemas"]["PagedModelDUserNotification"];
type DUserNotification = components["schemas"]["DUserNotification"];

const JAVA_BACKEND_URL = process.env.NEXT_PUBLIC_JAVA_API_URL ?? process.env.NEXT_PUBLIC_API_URL;

interface UseNotificationsOptions {
  userId: number;
  page?: number;
  size?: number;
  enabled?: boolean;
}

/**
 * Hook para obtener notificaciones de un usuario
 */
export function useNotifications({ userId, page = 1, size = 10, enabled = true }: UseNotificationsOptions) {
  return useQuery<PagedModelDUserNotification>({
    queryKey: ["notifications", "user", userId, page, size],
    queryFn: async () => {
      const response = await enhancedFetch(
        `${JAVA_BACKEND_URL}/notifications/user/${userId}?page=${page}&size=${size}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener notificaciones");
      }

      return response.json();
    },
    enabled: enabled && userId > 0,
    staleTime: 30000, // 30 segundos
    refetchInterval: 60000, // Refetch cada 60 segundos
  });
}

/**
 * Hook para marcar notificación como leída
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userNotificationId }: { userNotificationId: number }) => {
      const response = await enhancedFetch(
        `${JAVA_BACKEND_URL}/notifications/${userNotificationId}/mark-as-read`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al marcar notificación como leída");
      }

      return response.json() as Promise<DUserNotification>;
    },
    onSuccess: () => {
      // Invalidar queries de notificaciones para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ["notifications", "user"] });
    },
  });
}

/**
 * Hook para obtener conteo de notificaciones no leídas
 */
export function useUnreadNotificationsCount({ userId, enabled = true }: { userId: number; enabled?: boolean }) {
  const { data, isLoading } = useNotifications({ userId, page: 1, size: 100, enabled });

  const unreadCount = data?.content?.filter((n) => !n.read).length ?? 0;

  return {
    unreadCount,
    isLoading,
  };
}
