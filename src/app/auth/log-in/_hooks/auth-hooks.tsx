"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthToastErrorMessage } from "@/components/errors/error-for-toast";
import { backend } from "@/lib/api/types/backend";

/**
 * Hook para manejar el inicio de sesión
 * Invalida la sesión actual y redirige a la página guardada o al dashboard
 */
export const useLogIn = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return backend.useMutation("post", "/api/auth/sign-in/email", {
    onSuccess: async () => {
      toast.success("Inicio de sesión exitoso");

      // Invalidar query de sesión para forzar recarga
      await queryClient.invalidateQueries({
        queryKey: ["get", "/api/auth/get-session"],
      });

      // Obtener la URL guardada de las cookies y redirigir
      const lastUrl = getCookie("lastUrl");

      // Usar router.refresh() para actualizar el layout con la nueva sesión
      router.refresh();

      // Redirigir a la última URL o al dashboard
      router.push(lastUrl || "/");
    },
    onError: (error) => {
      toast.error(<AuthToastErrorMessage error={error} />);
    },
  });
};

/**
 * Hook para obtener la sesión actual
 * Configurado para no reintentar en caso de error y no refrescar en focus
 */
export const useSession = () => {
  return backend.useQuery("get", "/api/auth/get-session", {
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useChangePassword = () => {
  return backend.useMutation("post", "/api/auth/change-password", {
    onSuccess: () => {
      toast.success("Contraseña actualizada correctamente");
    },
    onError: (error) => {
      // const errorCode = error.code as keyof typeof ERROR_MESSAGES | undefined;
      // const errorMessage =
      //   typeof error.message === "string" ? error.message : undefined;
      toast.error(<AuthToastErrorMessage error={error} />);
    },
  });
};

/**
 * Hook para manejar el cierre de sesión
 * Invalida todas las queries y redirige al login
 */
export const useSignOut = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return backend.useMutation("post", "/api/auth/sign-out", {
    onSuccess: async () => {
      toast.success("Sesión cerrada exitosamente");

      // Invalidar todas las queries para limpiar el cache
      await queryClient.invalidateQueries();

      // Limpiar completamente el cache de queries
      queryClient.clear();

      // Usar router.refresh() para actualizar el layout
      router.refresh();

      // Redirigir al login con transición suave
      router.push("/auth/sign-in");
    },
    onError: (error) => {
      toast.error(<AuthToastErrorMessage error={error} />);
    },
  });
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

export const useAuthorization = (): {
  isLoading: boolean;
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (role: string) => boolean;
  isAuthenticated: () => boolean;
} => {
  const session = useSession();
  const userId = (
    session.data as unknown as { session?: { userId?: string } } | undefined
  )?.session?.userId;

  // Siempre llamar al hook (nunca condicional)
  const userQuery = backend.useQuery("get", "/api/user/{id}", {
    enabled: Boolean(userId),
    params: { path: { id: userId || "" } },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  // Derivar permisos como "resource:action"
  const getPermissionNames = (): Set<string> => {
    const names = new Set<string>();
    const data = userQuery.data;
    if (!data || typeof data !== "object") return names;
    const obj = data as Record<string, unknown>;

    const roles = obj.roles as unknown;
    if (Array.isArray(roles)) {
      for (const r of roles) {
        if (!r || typeof r !== "object") continue;
        const anyR = r as Record<string, unknown>;
        const rolePerms = anyR.permissions as unknown;
        if (Array.isArray(rolePerms)) {
          for (const perm of rolePerms) {
            if (perm && typeof perm === "object") {
              const p = perm as Record<string, unknown>;
              const resource = p.resource;
              const action = p.action;
              if (typeof resource === "string" && typeof action === "string") {
                names.add(`${resource}:${action}`);
              }
            }
          }
        }
      }
    }
    return names;
  };

  // Derivar roles
  const getRoleNames = (): Set<string> => {
    const names = new Set<string>();
    const data = userQuery.data as unknown;
    if (!data || typeof data !== "object") return names;
    const obj = data as Record<string, unknown>;
    const roles = obj.roles as unknown;
    if (Array.isArray(roles)) {
      for (const r of roles) {
        if (r && typeof r === "object") {
          const anyR = r as Record<string, unknown>;
          if (typeof anyR.name === "string") names.add(anyR.name);
          const role = anyR.role as Record<string, unknown> | undefined;
          if (role && typeof role.name === "string") names.add(role.name);
        }
      }
    }
    return names;
  };

  const permissionSet = getPermissionNames();
  const roleSet = getRoleNames();

  return {
    isLoading: userQuery.isLoading,
    hasPermission: (resource: string, action: string) => {
      // Verificar permiso específico
      if (permissionSet.has(`${resource}:${action}`)) {
        return true;
      }
      // Verificar wildcard del recurso (ej: "customer:*" permite "customer:read", "customer:write", etc.)
      if (permissionSet.has(`${resource}:*`)) {
        return true;
      }
      return false;
    },
    hasRole: (role: string) => roleSet.has(role),
    isAuthenticated: () => Boolean(userId),
  };
};
