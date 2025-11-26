"use client";
import { Shield, ShieldCheck, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  getRoleBadgeClasses,
  getRoleIconClasses,
  parseRole,
} from "../../_utils/roles";

interface RoleBadgeProps {
  roleName: string | null | undefined;
  showIcon?: boolean;
  className?: string;
}

/**
 * Componente Badge reutilizable para mostrar roles con iconos y colores
 * Usa las utilidades de roles para mantener consistencia
 */
export function RoleBadge({
  roleName,
  showIcon = true,
  className,
}: RoleBadgeProps) {
  const roleConfig = parseRole(roleName);
  const iconClasses = getRoleIconClasses(roleName);
  const badgeClasses = getRoleBadgeClasses(roleName, className);

  // Renderizar el icono correcto usando los utils para las clases
  const IconComponent =
    roleConfig.icon === ShieldCheck
      ? ShieldCheck
      : roleConfig.icon === User
        ? User
        : Shield;

  return (
    <Badge variant="outline" className={badgeClasses}>
      {showIcon && <IconComponent className={cn(iconClasses, "h-4 w-4")} />}
      {roleName || "Rol desconocido"}
    </Badge>
  );
}
