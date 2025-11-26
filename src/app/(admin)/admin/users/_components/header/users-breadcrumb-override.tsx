"use client";

import { useBreadcrumbOverride } from "@/hooks/use-breadcrumb-override";

/**
 * Componente que configura el override del breadcrumb para la página de usuarios
 * Cambia "Admin" por "Administrador" y lo hace no clickeable
 */
export function UsersBreadcrumbOverride() {
  useBreadcrumbOverride({
    pattern: "/admin/users",
    label: "Administrador",
    type: "replace-segment",
    segmentIndex: 0, // El primer segmento es "admin" (índice 0)
    removeUrl: true, // Quita el link, lo hace no clickeable
  });

  return null;
}
