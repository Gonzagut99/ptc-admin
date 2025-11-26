import {
  Building,
  CreditCard,
  FileText,
  Globe,
  IdCard,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Utilidades genéricas para manejar tipos de documentos con iconos y colores
 * Similar al patrón de roles
 */

export type IdDocumentTypeConfig = {
  icon: LucideIcon;
  color: string;
  badgeClasses: string;
  iconClasses: string;
  label: string;
};

// Configuración de tipos de documentos conocidos
const idDocumentTypeConfig: Record<string, IdDocumentTypeConfig> = {
  DNI: {
    icon: IdCard,
    color: "blue",
    badgeClasses:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
    iconClasses: "text-blue-600 dark:text-blue-500",
    label: "DNI",
  },
  RUC: {
    icon: Building,
    color: "green",
    badgeClasses:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
    iconClasses: "text-green-600 dark:text-green-500",
    label: "RUC",
  },
  FOREIGNER_ID: {
    icon: Globe,
    color: "orange",
    badgeClasses:
      "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
    iconClasses: "text-orange-600 dark:text-orange-500",
    label: "Carnet de Extranjería",
  },
  PASSPORT: {
    icon: CreditCard,
    color: "purple",
    badgeClasses:
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
    iconClasses: "text-purple-600 dark:text-purple-500",
    label: "Pasaporte",
  },
  OTHER: {
    icon: FileText,
    color: "gray",
    badgeClasses:
      "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800",
    iconClasses: "text-gray-600 dark:text-gray-500",
    label: "Otro",
  },
};

// Configuración genérica para tipos desconocidos
const defaultIdDocumentTypeConfig: IdDocumentTypeConfig = {
  icon: FileText,
  color: "gray",
  badgeClasses:
    "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800",
  iconClasses: "text-gray-600 dark:text-gray-500",
  label: "Desconocido",
};

/**
 * Obtiene la configuración del tipo de documento
 */
export function getIdDocumentTypeConfig(
  idDocumentType: string | null | undefined,
): IdDocumentTypeConfig {
  if (!idDocumentType) {
    return defaultIdDocumentTypeConfig;
  }

  const normalized = idDocumentType.toUpperCase().trim();
  return idDocumentTypeConfig[normalized] || defaultIdDocumentTypeConfig;
}

/**
 * Obtiene el icono del tipo de documento
 */
export function getIdDocumentTypeIcon(
  idDocumentType: string | null | undefined,
): LucideIcon {
  return getIdDocumentTypeConfig(idDocumentType).icon;
}

/**
 * Obtiene las clases CSS para el icono del tipo de documento
 */
export function getIdDocumentTypeIconClasses(
  idDocumentType: string | null | undefined,
  className?: string,
): string {
  const config = getIdDocumentTypeConfig(idDocumentType);
  return cn("shrink-0", config.iconClasses, className);
}

/**
 * Obtiene las clases CSS para el badge del tipo de documento
 */
export function getIdDocumentTypeBadgeClasses(
  idDocumentType: string | null | undefined,
  className?: string,
): string {
  const config = getIdDocumentTypeConfig(idDocumentType);
  return cn("border", config.badgeClasses, className);
}

/**
 * Obtiene el label del tipo de documento
 */
export function getIdDocumentTypeLabel(
  idDocumentType: string | null | undefined,
): string {
  return getIdDocumentTypeConfig(idDocumentType).label;
}

/**
 * Obtiene el color del tipo de documento
 */
export function getIdDocumentTypeColor(
  idDocumentType: string | null | undefined,
): string {
  return getIdDocumentTypeConfig(idDocumentType).color;
}

/**
 * Obtiene todas las propiedades del tipo de documento
 */
export function getIdDocumentTypeInfo(
  idDocumentType: string | null | undefined,
) {
  const config = getIdDocumentTypeConfig(idDocumentType);
  const Icon = config.icon;

  return {
    icon: Icon,
    color: config.color,
    label: config.label,
    iconClasses: getIdDocumentTypeIconClasses(idDocumentType),
    badgeClasses: getIdDocumentTypeBadgeClasses(idDocumentType),
  };
}
