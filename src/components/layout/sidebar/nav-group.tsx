"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useAuthorization } from "@/app/auth/log-in/_hooks/auth-hooks";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  NavCollapsible,
  type NavGroup as NavGroupType,
  NavItem,
  NavLink,
} from "./data/types";

type NavGroupProps = NavGroupType;

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

export function NavGroup({ title, items, permission, roles }: NavGroupProps) {
  const { state } = useSidebar();
  const { isAuthenticated, hasPermission, hasRole, isLoading } = useAuthorization();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);

  // Esperar hasta que el componente esté montado en el cliente
  // para evitar errores de hidratación con localStorage
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Recrear la URL completa como lo hacía TanStack
  const href = `${pathname}${
    searchParams.toString() ? `?${searchParams.toString()}` : ""
  }`;

  // Mostrar skeleton durante SSR y mientras carga la autenticación
  if (!isMounted || isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>{title}</SidebarGroupLabel>
        <SidebarMenu>
          {items.slice(0, 3).map((_, index) => (
            <SidebarMenuItem key={`skeleton-${title}-${index}`}>
              <div className="flex items-center gap-2 px-2 py-1.5">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 flex-1 rounded" />
              </div>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  // Verificar permisos a nivel de grupo primero
  if (!isAuthenticated()) {
    return null;
  }

  // Si el grupo tiene restricciones de permisos o roles, verificarlas
  if (permission || roles) {
    // Verificar roles si están definidos
    if (roles && roles.length > 0) {
      const hasRequiredRole = roles.some((role: string) => hasRole(role));
      if (!hasRequiredRole) {
        return null;
      }
    }

    // Verificar permisos si están definidos
    if (permission) {
      const [resource, action] = permission.split(":");
      // Si la acción es "*", verificar si tiene el wildcard del recurso
      if (action === "*") {
        if (!hasPermission(resource, "*")) {
          return null;
        }
      } else {
        // Verificar permiso específico o wildcard
        if (!hasPermission(resource, action) && !hasPermission(resource, "*")) {
          return null;
        }
      }
    }
  }

  // Filtrar items basado en permisos individuales
  const filteredItems = items.filter((item) =>
    hasNavPermission(item, hasPermission, hasRole),
  );

  // Si no hay items visibles, no mostrar el grupo
  if (filteredItems.length === 0) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {filteredItems.map((item) => {
          const key = `${item.title}-${item.url}`;

          if (!item.items) {
            return <SidebarMenuLink key={key} item={item} href={href} />;
          }

          // Filtrar sub-items también
          const filteredSubItems = item.items?.filter((subItem) =>
            hasNavPermission(subItem, hasPermission, hasRole),
          );

          // Si no hay sub-items visibles, no mostrar el item padre
          if (!filteredSubItems || filteredSubItems.length === 0) {
            return null;
          }

          // Crear item con sub-items filtrados
          const filteredItem = { ...item, items: filteredSubItems };

          if (state === "collapsed") {
            return (
              <SidebarMenuCollapsedDropdown
                key={key}
                item={filteredItem}
                href={href}
              />
            );
          }

          return (
            <SidebarMenuCollapsible key={key} item={filteredItem} href={href} />
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

const NavBadge = ({ children }: { children: ReactNode }) => (
  <Badge className="rounded-full px-1 py-0 text-xs">{children}</Badge>
);

const SidebarMenuLink = ({ item, href }: { item: NavLink; href: string }) => {
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={checkIsActive(href, item)}
        tooltip={item.title}
      >
        <Link href={item.url} onClick={() => setOpenMobile(false)}>
          {item.icon && (
            <item.icon
              className={cn(checkIsActive(href, item) ? "text-primary" : "")}
            />
          )}
          <span className={cn(checkIsActive(href, item) ? "text-primary" : "")}>
            {item.title}
          </span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const SidebarMenuCollapsible = ({
  item,
  href,
}: {
  item: NavCollapsible;
  href: string;
}) => {
  const { setOpenMobile } = useSidebar();
  return (
    <Collapsible
      asChild
      defaultOpen={checkIsActive(href, item)}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="CollapsibleContent">
          <SidebarMenuSub>
            {item.items.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  asChild
                  isActive={checkIsActive(href, subItem)}
                >
                  <Link href={subItem.url} onClick={() => setOpenMobile(false)}>
                    {subItem.icon && <subItem.icon />}
                    <span>{subItem.title}</span>
                    {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

const SidebarMenuCollapsedDropdown = ({
  item,
  href,
}: {
  item: NavCollapsible;
  href: string;
}) => {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={checkIsActive(href, item)}
          >
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" sideOffset={4}>
          <DropdownMenuLabel>
            {item.title} {item.badge ? `(${item.badge})` : ""}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items.map((sub) => (
            <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild>
              <Link
                href={sub.url}
                className={`${checkIsActive(href, sub) ? "bg-secondary" : ""}`}
              >
                {sub.icon && <sub.icon />}
                <span className="max-w-52 text-wrap">{sub.title}</span>
                {sub.badge && (
                  <span className="ml-auto text-xs">{sub.badge}</span>
                )}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

function checkIsActive(href: string, item: NavItem) {
  const currentPath = href.split("?")[0]; // Remover query params
  const itemUrl = item.url;

  return (
    href === itemUrl || // /endpoint?search=param (coincidencia exacta con query params)
    currentPath === itemUrl || // /endpoint (coincidencia exacta sin query params)
    !!item?.items?.filter((i) => i.url === href).length || // if child nav is active
    (itemUrl !== "/" && currentPath.startsWith(`${itemUrl}/`)) // /clients está activo cuando estás en /clients/6905a72b-4f50-4501-9b2c-2ee9d2c42444/contacts
  );
}
