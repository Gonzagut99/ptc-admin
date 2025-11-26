"use client";

import { ReactNode, useMemo } from "react";
import { useAuthorization } from "@/app/auth/log-in/_hooks/auth-hooks";
import { ActionType, ResourceType } from "@/types/resource-actions.types";
import { Spinner } from "./spinner";

interface ProtectedComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  allowedRoles?: string[];
  requiredPermissions?: { resource: ResourceType; action: ActionType }[];
}

/**
 * Componente que muestra su contenido solo si el usuario cumple con los requisitos
 * de tipo de usuario, roles y/o permisos.
 *
 * @example
 * Solo mostrar para administradores con rol superadmin
 * <ProtectedComponent
 *   allowedUserTypes={["NORMAL"]}
 *   allowedRoles={["superadmin"]}
 *   fallback={<p>No tienes permiso para ver este contenido</p>}
 * >
 *   <AdminControls />
 * </ProtectedComponent>
 */
export function ProtectedComponent({
  children,
  fallback = null,
  allowedRoles = [],
  requiredPermissions = [],
}: ProtectedComponentProps) {
  const {
    hasPermission,
    hasRole,
    isAuthenticated,
    isLoading: isLoadingAuthorization,
  } = useAuthorization();

  const hasRestrictions = useMemo(() => {
    return (
      (allowedRoles?.length ?? 0) > 0 || (requiredPermissions?.length ?? 0) > 0
    );
  }, [allowedRoles, requiredPermissions]);

  // Sin restricciones: renderizar directamente
  if (!hasRestrictions) return <>{children}</>;

  // Cargando sesión
  if (isLoadingAuthorization)
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );

  // No autenticado
  if (!isAuthenticated()) return <>{fallback}</>;

  // Superadmin tiene acceso total
  if (hasRole("superadmin")) return <>{children}</>;

  // Verificar permisos primero (incluye wildcards como "customer:*", "supplier:*", etc.)
  if (requiredPermissions.length > 0) {
    const permitted = requiredPermissions.some((perm) => {
      const resource = String(perm.resource);
      const action = String(perm.action);
      // hasPermission ya maneja wildcards automáticamente
      // Si el usuario tiene "customer:*", puede acceder a "customer:read", "customer:create", etc.
      return hasPermission(resource, action);
    });
    if (!permitted) return <>{fallback}</>;
  }

  // Verificar roles si se especificaron (solo si no hay permisos requeridos o ya pasaron)
  if (allowedRoles.length > 0) {
    const allowed = allowedRoles.some((role) => hasRole(role));
    if (!allowed) return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Componente para proteger solo por roles
export const RoleProtected = ({
  children,
  roles,
  fallback,
}: {
  children: ReactNode;
  roles: string[];
  fallback?: ReactNode;
}) => {
  return (
    <ProtectedComponent
      allowedRoles={roles}
      fallback={fallback || <div>Acceso restringido por rol</div>}
    >
      {children}
    </ProtectedComponent>
  );
};

// Componente para proteger solo por permisos
export const PermissionProtected = ({
  children,
  permissions,
  fallback,
}: {
  children: ReactNode;
  permissions: { resource: ResourceType; action: ActionType }[];
  fallback?: ReactNode;
}) => {
  return (
    <ProtectedComponent
      requiredPermissions={permissions}
      fallback={fallback || <div>No tiene permisos suficientes</div>}
    >
      {children}
    </ProtectedComponent>
  );
};

// Componente para proteger solo para superadmin
export const SuperAdminProtected = ({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) => {
  return (
    <ProtectedComponent
      allowedRoles={["superadmin"]}
      fallback={fallback || <div>Solo para super administradores</div>}
    >
      {children}
    </ProtectedComponent>
  );
};

// Componente para proteger solo para admin
export const AdminProtected = ({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) => {
  return (
    <ProtectedComponent
      allowedRoles={["admin", "superadmin"]}
      fallback={fallback || <div>Solo para administradores</div>}
    >
      {children}
    </ProtectedComponent>
  );
};
