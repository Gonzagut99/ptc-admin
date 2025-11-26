"use client";
import { CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  type ActiveStatusConfig,
  getActiveStatusBadgeClasses,
  getActiveStatusIconClasses,
  getActiveStatusLabel,
} from "@/utils/active-status";

interface ActiveStatusBadgeProps {
  isActive: boolean;
  config?: ActiveStatusConfig;
  showIcon?: boolean;
  className?: string;
}

/**
 * Componente Badge reutilizable para mostrar estado activo/inactivo
 * Usa las utilidades de active-status para mantener consistencia
 */
export function ActiveStatusBadge({
  isActive,
  config,
  showIcon = true,
  className,
}: ActiveStatusBadgeProps) {
  const label = getActiveStatusLabel(isActive, config);
  const iconClasses = getActiveStatusIconClasses(isActive);
  const badgeClasses = getActiveStatusBadgeClasses(isActive, className);

  // Renderizar el icono correcto usando los utils para las clases
  const IconComponent = isActive ? CheckCircle : XCircle;

  return (
    <Badge variant="outline" className={badgeClasses}>
      {showIcon && <IconComponent className={cn(iconClasses, "h-4 w-4")} />}
      {label}
    </Badge>
  );
}
