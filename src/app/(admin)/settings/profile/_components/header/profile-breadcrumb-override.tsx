"use client";

import { useBreadcrumbTitle } from "@/hooks/use-breadcrumb-override";

/**
 * Componente que configura el override del breadcrumb para la página de perfil
 * Cambia el breadcrumb completo por "Perfil"
 */
export function ProfileBreadcrumbOverride() {
  useBreadcrumbTitle("Perfil");

  return null;
}
