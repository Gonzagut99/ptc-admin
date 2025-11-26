import { CheckCircle, LucideIcon, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Utilidades genéricas para manejar estados activo/inactivo (isActive)
 */

export type ActiveStatusConfig = {
  activeLabel?: string;
  inactiveLabel?: string;
  activeDescription?: string;
  inactiveDescription?: string;
};

const defaultConfig: Required<ActiveStatusConfig> = {
  activeLabel: "Activo",
  inactiveLabel: "Inactivo",
  activeDescription:
    "El elemento está activo y disponible para su uso en el sistema.",
  inactiveDescription:
    "El elemento está inactivo y no está disponible para su uso en el sistema.",
};

/**
 * Obtiene el icono correspondiente según el estado activo/inactivo
 */
export function getActiveStatusIcon(isActive: boolean): LucideIcon {
  return isActive ? CheckCircle : XCircle;
}

/**
 * Obtiene las clases CSS para el icono según el estado
 */
export function getActiveStatusIconClasses(
  isActive: boolean,
  className?: string,
): string {
  return cn(
    "shrink-0",
    isActive
      ? "text-emerald-600 dark:text-emerald-500"
      : "text-red-600 dark:text-red-500",
    className,
  );
}

/**
 * Obtiene el texto del estado
 */
export function getActiveStatusLabel(
  isActive: boolean,
  config?: ActiveStatusConfig,
): string {
  return isActive
    ? config?.activeLabel || defaultConfig.activeLabel
    : config?.inactiveLabel || defaultConfig.inactiveLabel;
}

/**
 * Obtiene la descripción del estado
 */
export function getActiveStatusDescription(
  isActive: boolean,
  config?: ActiveStatusConfig,
): string {
  return isActive
    ? config?.activeDescription || defaultConfig.activeDescription
    : config?.inactiveDescription || defaultConfig.inactiveDescription;
}

/**
 * Obtiene las clases CSS para el contenedor según el estado
 */
export function getActiveStatusContainerClasses(
  isActive: boolean,
  className?: string,
): string {
  return cn(
    isActive
      ? "text-emerald-600 dark:text-emerald-500"
      : "text-red-600 dark:text-red-500",
    className,
  );
}

/**
 * Obtiene el variant del Badge según el estado
 */
export function getActiveStatusBadgeVariant(
  isActive: boolean,
): "success" | "destructive" {
  return isActive ? "success" : "destructive";
}

/**
 * Obtiene las clases CSS para el badge según el estado
 */
export function getActiveStatusBadgeClasses(
  isActive: boolean,
  className?: string,
): string {
  return cn(
    isActive
      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
      : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
    className,
  );
}

/**
 * Obtiene las clases CSS para el toggle group item según el estado
 */
export function getActiveStatusToggleClasses(
  isActive: boolean,
  className?: string,
): string {
  return cn(
    "flex flex-col items-center py-1 h-auto",
    isActive
      ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 data-[state=on]:bg-emerald-100 data-[state=on]:text-emerald-700 dark:hover:bg-emerald-950 dark:data-[state=on]:bg-emerald-900"
      : "text-red-600 hover:text-red-700 hover:bg-red-50 data-[state=on]:bg-red-100 data-[state=on]:text-red-700 dark:hover:bg-red-950 dark:data-[state=on]:bg-red-900",
    className,
  );
}

/**
 * Obtiene las clases CSS para el indicador circular según el estado
 */
export function getActiveStatusIndicatorClasses(
  isActive: boolean,
  className?: string,
): string {
  return cn(
    "w-2 h-2 rounded-full",
    isActive
      ? "bg-emerald-500 dark:bg-emerald-400"
      : "bg-red-500 dark:bg-red-400",
    className,
  );
}

/**
 * Obtiene todas las propiedades necesarias para renderizar un estado activo/inactivo
 */
export function getActiveStatusProps(
  isActive: boolean,
  config?: ActiveStatusConfig,
) {
  const Icon = getActiveStatusIcon(isActive);

  return {
    isActive,
    Icon,
    label: getActiveStatusLabel(isActive, config),
    description: getActiveStatusDescription(isActive, config),
    iconClasses: getActiveStatusIconClasses(isActive),
    containerClasses: getActiveStatusContainerClasses(isActive),
    badgeVariant: getActiveStatusBadgeVariant(isActive),
    badgeClasses: getActiveStatusBadgeClasses(isActive),
    toggleClasses: getActiveStatusToggleClasses(isActive),
    indicatorClasses: getActiveStatusIndicatorClasses(isActive),
  };
}
