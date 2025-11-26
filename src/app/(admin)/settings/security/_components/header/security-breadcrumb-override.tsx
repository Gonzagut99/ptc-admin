"use client";

import { useBreadcrumbTitle } from "@/hooks/use-breadcrumb-override";

/**
 * Componente que configura el override del breadcrumb para la página de seguridad
 * Cambia el breadcrumb completo por "Seguridad"
 */
export function SecurityBreadcrumbOverride() {
  useBreadcrumbTitle("Seguridad");

  return null;
}
