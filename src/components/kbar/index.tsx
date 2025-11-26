"use client";
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch,
} from "kbar";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useAuthorization } from "@/app/auth/log-in/_hooks/auth-hooks";
import { sidebarData } from "../layout/sidebar/data/sidebar-data";
import type { NavItem } from "../layout/sidebar/data/types";
import RenderResults from "./render-result";

// Función helper para verificar permisos de navegación
const hasNavPermission = (
  item: NavItem,
  hasPermission: (resource: string, action: string) => boolean,
  hasRole: (role: string) => boolean,
): boolean => {
  // Si el item no tiene restricciones, mostrar siempre
  if (!item.permission && !item.roles) {
    return true;
  }

  // Verificar roles si están definidos
  if (item.roles && item.roles.length > 0) {
    const hasRequiredRole = item.roles.some((role: string) => hasRole(role));
    if (!hasRequiredRole) {
      return false;
    }
  }

  // Verificar permisos si están definidos
  if (item.permission) {
    const [resource, action] = item.permission.split(":");
    // Si la acción es "*", verificar si tiene el wildcard del recurso
    if (action === "*") {
      if (!hasPermission(resource, "*")) {
        return false;
      }
    } else {
      // Verificar permiso específico o wildcard
      if (!hasPermission(resource, action) && !hasPermission(resource, "*")) {
        return false;
      }
    }
  }

  return true;
};

export default function KBar({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, hasPermission, hasRole } = useAuthorization();

  // These action are for the navigation
  const actions = useMemo(() => {
    const navigateTo = (url: string) => {
      router.push(url);
    };

    // Si no está autenticado o está cargando, retornar todas las acciones sin filtro
    const shouldFilterByPermissions = isAuthenticated();

    return sidebarData.navGroups.flatMap((navGroup) => {
      // Solo filtrar por permisos si está autenticado
      if (shouldFilterByPermissions) {
        // Si el grupo tiene restricciones de permisos o roles, verificarlas
        if (navGroup.permission || navGroup.roles) {
          // Verificar roles si están definidos
          if (navGroup.roles && navGroup.roles.length > 0) {
            const hasRequiredRole = navGroup.roles.some((role: string) =>
              hasRole(role),
            );
            if (!hasRequiredRole) {
              return [];
            }
          }

          // Verificar permisos si están definidos
          if (navGroup.permission) {
            const [resource, action] = navGroup.permission.split(":");
            // Si la acción es "*", verificar si tiene el wildcard del recurso
            if (action === "*") {
              if (!hasPermission(resource, "*")) {
                return [];
              }
            } else {
              // Verificar permiso específico o wildcard
              if (
                !hasPermission(resource, action) &&
                !hasPermission(resource, "*")
              ) {
                return [];
              }
            }
          }
        }
      }

      // Filtrar items basado en permisos individuales
      const filteredItems = shouldFilterByPermissions
        ? navGroup.items.filter((item) =>
            hasNavPermission(item, hasPermission, hasRole),
          )
        : navGroup.items;

      // Mapear items a acciones de KBar
      const childActions = filteredItems.flatMap((childItem) => {
        // Si el item tiene sub-items (collapsible), procesarlos
        if (childItem.items) {
          // Filtrar sub-items también
          const filteredSubItems = shouldFilterByPermissions
            ? childItem.items.filter((subItem) =>
                hasNavPermission(subItem, hasPermission, hasRole),
              )
            : childItem.items;

          return filteredSubItems.map((subItem) => ({
            id: `${subItem.title.toLowerCase().replace(/\s+/g, "-")}Action`,
            name: subItem.title,
            keywords: subItem.title.toLowerCase(),
            section: navGroup.title,
            perform: () => navigateTo(subItem.url),
            icon: subItem.icon ? (
              <subItem.icon className="mr-2 h-4 w-4" />
            ) : undefined,
          }));
        }

        // Item directo con URL
        if (childItem.url) {
          return {
            id: `${childItem.title.toLowerCase().replace(/\s+/g, "-")}Action`,
            name: childItem.title,
            keywords: childItem.title.toLowerCase(),
            section: navGroup.title,
            perform: () => navigateTo(childItem.url),
            icon: childItem.icon ? (
              <childItem.icon className="mr-2 h-4 w-4" />
            ) : undefined,
          };
        }

        return [];
      });

      return childActions;
    });
  }, [router, isAuthenticated, hasPermission, hasRole]);

  return (
    <KBarProvider actions={actions}>
      <KBarComponent>{children}</KBarComponent>
    </KBarProvider>
  );
}
const KBarComponent = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <KBarPortal>
        <KBarPositioner className="bg-background/80 fixed inset-0 z-99999 p-0! backdrop-blur-sm">
          <KBarAnimator className="bg-card text-card-foreground relative mt-64! w-full max-w-[600px] -translate-y-12! overflow-hidden rounded-lg border shadow-lg">
            <div className="bg-card border-border sticky top-0 z-10 border-b">
              <KBarSearch
                className="bg-card w-full border-none px-6 py-4 outline-hidden focus:ring-0 focus:ring-offset-0 focus:outline-hidden"
                defaultPlaceholder="Buscar módulo o página..."
              />
            </div>
            <div className="max-h-[400px]">
              <RenderResults />
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </>
  );
};
