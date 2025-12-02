"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { backendJava } from "@/lib/api-java/backend";
import {
  clearAuthData,
  storeAuthData,
  getStoredUser,
  isAuthenticated as checkIsAuthenticated,
  getAccessToken,
  getRefreshToken,
} from "@/lib/api-java/auth-client";
import type {
  LoginRequestDto,
  UserInfoDto,
  AuthErrorResponse,
} from "@/lib/api-java/auth-types";
import { Label } from "@/components/ui/label";

// Auth error messages mapping
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  UNAUTHORIZED: "Email o contraseña incorrectos",
  INVALID_CREDENTIALS: "Credenciales inválidas",
  USER_NOT_FOUND: "Usuario no encontrado",
  INVALID_TOKEN: "Token inválido o expirado",
  SESSION_EXPIRED: "La sesión ha expirado",
  FORBIDDEN: "Acceso denegado",
  BAD_REQUEST: "Datos de solicitud inválidos",
};

/**
 * Error toast component for auth errors
 */
const AuthToastError = ({ error }: { error: AuthErrorResponse }) => {
  // Handle status which can be a string enum like "401 UNAUTHORIZED" or undefined
  const statusStr = typeof error.status === "string" ? error.status : "";
  // Extract the status code part (e.g., "UNAUTHORIZED" from "401 UNAUTHORIZED")
  const statusKey = statusStr.split(" ").pop()?.toUpperCase() || "";
  
  const message =
    AUTH_ERROR_MESSAGES[statusKey] ||
    error.detail ||
    error.message ||
    "Error de autenticación";

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex items-center gap-2">
        <Label className="text-destructive font-medium">
          Error de Autenticación
        </Label>
      </div>
      <p className="text-xs text-muted-foreground font-normal leading-relaxed">
        {message}
      </p>
    </div>
  );
};

/**
 * Hook para manejar el inicio de sesión usando openapi-react-query
 */
export const useLogIn = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = backendJava.useMutation("post", "/auth/login", {
    onSuccess: async (data) => {
      // Store tokens and user info
      storeAuthData(data);

      const userName = data.user?.userName || data.user?.email || "Usuario";
      toast.success(`Bienvenido, ${userName}`);

      // Invalidar query de sesión para forzar recarga
      await queryClient.invalidateQueries({
        queryKey: ["auth", "session"],
      });

      // Obtener la URL guardada de las cookies y redirigir
      const lastUrl = getCookie("lastUrl");

      // Usar router.refresh() para actualizar el layout con la nueva sesión
      router.refresh();

      // Redirigir a la última URL o al dashboard
      router.push(lastUrl || "/");
    },
    onError: (error) => {
      const authError = error as unknown as AuthErrorResponse;
      toast.error(<AuthToastError error={authError} />);
    },
  });

  // Adapter to match the expected interface
  return {
    ...mutation,
    mutate: (variables: { body: LoginRequestDto }) => {
      mutation.mutate({ body: variables.body });
    },
    mutateAsync: async (variables: { body: LoginRequestDto }) => {
      return mutation.mutateAsync({ body: variables.body });
    },
  };
};

/**
 * Hook para obtener la sesión actual (usuario autenticado)
 */
export const useSession = () => {
  return backendJava.useQuery(
    "get",
    "/auth/me",
    {},
    {
      queryKey: ["auth", "session"],
      enabled: checkIsAuthenticated(),
      retry: (failureCount, error) => {
        // Don't retry on 401 errors
        if ((error as { status?: number })?.status === 401) {
          return false;
        }
        return failureCount < 2;
      },
      retryOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      initialData: () => getStoredUser() as UserInfoDto | undefined,
    },
  );
};

/**
 * Hook para cambiar la contraseña
 */
export const useChangePassword = () => {
  const token = getAccessToken();

  return useMutation({
    mutationFn: async (data: { 
      currentPassword: string; 
      newPassword: string; 
      confirmPassword: string;
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_JAVA_API_URL}/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: "Error al cambiar la contraseña",
          status: response.status.toString(),
        }));
        throw error;
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Contraseña actualizada correctamente");
    },
    onError: (error: AuthErrorResponse) => {
      toast.error(<AuthToastError error={error} />);
    },
  });
};

/**
 * Hook para manejar el cierre de sesión
 */
export const useSignOut = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = backendJava.useMutation("post", "/auth/logout", {
    onSuccess: async () => {
      toast.success("Sesión cerrada exitosamente");

      // Clear local auth data
      clearAuthData();

      // Invalidar todas las queries para limpiar el cache
      await queryClient.invalidateQueries();

      // Limpiar completamente el cache de queries
      queryClient.clear();

      // Usar router.refresh() para actualizar el layout
      router.refresh();

      // Redirigir al login
      router.push("/auth/log-in");
    },
    onError: (error) => {
      const authError = error as unknown as AuthErrorResponse;
      toast.error(<AuthToastError error={authError} />);
      // Even on error, clear local data and redirect
      clearAuthData();
      queryClient.clear();
      router.push("/auth/log-in");
    },
  });

  // Adapter to pass the Authorization header
  return {
    ...mutation,
    mutate: () => {
      const token = getAccessToken();
      mutation.mutate({
        params: {
          header: { Authorization: `Bearer ${token || ""}` },
        },
      });
    },
    mutateAsync: async () => {
      const token = getAccessToken();
      return mutation.mutateAsync({
        params: {
          header: { Authorization: `Bearer ${token || ""}` },
        },
      });
    },
  };
};

/**
 * Hook para cerrar todas las sesiones
 */
export const useSignOutAll = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = backendJava.useMutation("post", "/auth/logout-all", {
    onSuccess: async () => {
      toast.success("Todas las sesiones han sido cerradas");

      clearAuthData();
      await queryClient.invalidateQueries();
      queryClient.clear();
      router.refresh();
      router.push("/auth/log-in");
    },
    onError: (error) => {
      const authError = error as unknown as AuthErrorResponse;
      toast.error(<AuthToastError error={authError} />);
      clearAuthData();
      queryClient.clear();
      router.push("/auth/log-in");
    },
  });

  return mutation;
};

/**
 * Hook para refrescar tokens
 */
export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  const mutation = backendJava.useMutation("post", "/auth/refresh", {
    onSuccess: async (data) => {
      storeAuthData(data);
      await queryClient.invalidateQueries({
        queryKey: ["auth", "session"],
      });
    },
    onError: () => {
      clearAuthData();
      queryClient.clear();
    },
  });

  // Adapter to provide refreshToken from storage
  return {
    ...mutation,
    mutate: () => {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        mutation.mutate({ body: { refreshToken } });
      }
    },
    mutateAsync: async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }
      return mutation.mutateAsync({ body: { refreshToken } });
    },
  };
};

/**
 * Hook para obtener las sesiones activas del usuario
 */
export const useUserSessions = () => {
  const token = getAccessToken();

  return backendJava.useQuery(
    "get",
    "/auth/sessions",
    {
      params: {
        header: { Authorization: `Bearer ${token || ""}` },
      },
    },
    {
      queryKey: ["auth", "sessions"],
      enabled: checkIsAuthenticated(),
      retry: false,
      staleTime: 60 * 1000, // 1 minute
    },
  );
};

/**
 * Función auxiliar para leer cookies en el cliente
 */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }

  return null;
}

/**
 * Hook para verificar autorización
 */
export const useAuthorization = (): {
  isLoading: boolean;
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (role: string) => boolean;
  isAuthenticated: () => boolean;
  user: UserInfoDto | null | undefined;
} => {
  const { data: user, isLoading } = useSession();

  return {
    isLoading,
    isAuthenticated: () => !!user,
    user,
    hasPermission: (_resource: string, _action: string) => {
      // TODO: Implementar verificación de permisos cuando el backend lo soporte
      return !!user;
    },
    hasRole: (_role: string) => {
      // TODO: Implementar verificación de roles cuando el backend lo soporte
      return !!user;
    },
  };
};
