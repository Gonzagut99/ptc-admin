import { LucideIcon, Shield, ShieldCheck, User } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Utilidades genéricas para manejar roles con iconos y colores
 * Similar al patrón de UAParser para parsing y retorno de datos
 */

export type RoleConfig = {
  icon: LucideIcon;
  color: string;
  badgeClasses: string;
  iconClasses: string;
};

// Configuración de roles conocidos
const roleConfig: Record<string, RoleConfig> = {
  administrador: {
    icon: ShieldCheck,
    color: "purple",
    badgeClasses:
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
    iconClasses: "text-purple-600 dark:text-purple-500",
  },
  operador: {
    icon: User,
    color: "blue",
    badgeClasses:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
    iconClasses: "text-blue-600 dark:text-blue-500",
  },
};

// Configuración genérica para roles desconocidos
const defaultRoleConfig: RoleConfig = {
  icon: Shield,
  color: "gray",
  badgeClasses:
    "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800",
  iconClasses: "text-gray-600 dark:text-gray-500",
};

/**
 * Normaliza el nombre del rol para búsqueda
 * Similar al patrón de UAParser - limpia y normaliza el input
 */
function normalizeRoleName(roleName: string): string {
  // Convertir a minúsculas, quitar espacios, números y caracteres especiales
  return roleName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "") // Quitar espacios
    .replace(/\d+/g, "") // Quitar números
    .replace(/[^a-záéíóúñ]/g, ""); // Quitar caracteres especiales, mantener acentos
}

/**
 * Parser de roles - Similar al patrón de UAParser
 * Identifica el rol y retorna su configuración (icono, colores, badge)
 * Maneja variaciones: "admin", "administrador", "Administrador", "admin 1", etc.
 */
export function parseRole(roleName: string | null | undefined): RoleConfig {
  if (!roleName) {
    return defaultRoleConfig;
  }

  // Normalizar el nombre del rol para búsqueda
  const normalized = normalizeRoleName(roleName);

  // Patrones de búsqueda para cada rol
  const adminPatterns = ["admin", "administrador", "administradora"];
  const operadorPatterns = ["operador", "operadora", "operator"];

  // Buscar coincidencia con patrones de administrador
  const isAdmin = adminPatterns.some(
    (pattern) => normalized.includes(pattern) || pattern.includes(normalized),
  );

  // Buscar coincidencia con patrones de operador
  const isOperador = operadorPatterns.some(
    (pattern) => normalized.includes(pattern) || pattern.includes(normalized),
  );

  // Retornar configuración según el patrón encontrado
  if (isAdmin) {
    return roleConfig.administrador;
  }

  if (isOperador) {
    return roleConfig.operador;
  }

  // Si no se encuentra, retornar configuración genérica
  return defaultRoleConfig;
}

/**
 * Obtiene el icono del rol
 */
export function getRoleIcon(roleName: string | null | undefined): LucideIcon {
  return parseRole(roleName).icon;
}

/**
 * Obtiene las clases CSS para el icono del rol
 */
export function getRoleIconClasses(
  roleName: string | null | undefined,
  className?: string,
): string {
  const config = parseRole(roleName);
  return cn("shrink-0", config.iconClasses, className);
}

/**
 * Obtiene las clases CSS para el badge del rol
 */
export function getRoleBadgeClasses(
  roleName: string | null | undefined,
  className?: string,
): string {
  const config = parseRole(roleName);
  return cn("border", config.badgeClasses, className);
}

/**
 * Obtiene el color del rol
 */
export function getRoleColor(roleName: string | null | undefined): string {
  return parseRole(roleName).color;
}

/**
 * Obtiene todas las propiedades del rol (similar a getResult() de UAParser)
 */
export function getRoleInfo(roleName: string | null | undefined) {
  const config = parseRole(roleName);
  const Icon = config.icon;

  return {
    icon: Icon,
    color: config.color,
    iconClasses: getRoleIconClasses(roleName),
    badgeClasses: getRoleBadgeClasses(roleName),
  };
}
