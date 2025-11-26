import {
  ArrowDownCircle,
  ArrowUpCircle,
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  Factory,
  Hammer,
  HandCoins,
  KeyRound,
  Layers3,
  LayoutList,
  ListChecks,
  LucideIcon,
  PencilRuler,
  Repeat,
  Settings,
  Store,
  Users,
} from "lucide-react";
import { components } from "@/lib/api/types/api";
import { ActionType, ResourceType } from "@/types/resource-actions.types";

export type Permission = components["schemas"]["PermissionResponse"];

export type ResourceConfig = {
  name: string;
  icon?: LucideIcon;
};

export type ActionConfig = {
  name: string;
};
export type GroupedPermissions = Partial<Record<ResourceType, Permission[]>>;

export const resourceConfig: Record<ResourceType, ResourceConfig> = {
  // Autenticación y RBAC
  user: {
    name: "Usuarios",
    icon: Users,
  },
  role: {
    name: "Roles",
    icon: KeyRound,
  },

  // Clientes y Proveedores
  customer: {
    name: "Clientes",
    icon: Store,
  },
  supplier: {
    name: "Proveedores",
    icon: BriefcaseBusiness,
  },

  // Talleres y Trabajadores
  workshop: {
    name: "Talleres",
    icon: Building2,
  },
  worker: {
    name: "Trabajadores",
    icon: HandCoins,
  },

  // Catálogos Base
  "garment-type": {
    name: "Tipos de prenda",
  },
  "garment-type-image": {
    name: "Imágenes de tipos de prenda",
  },
  "material-type": {
    name: "Tipos de material",
  },
  material: {
    name: "Materiales",
    icon: Layers3,
  },
  unit: {
    name: "Unidades",
  },
  "action-type": {
    name: "Tipos de acción",
    icon: Hammer,
  },
  action: {
    name: "Acciones",
    icon: Hammer,
  },
  size: {
    name: "Tallas",
  },

  // Plantillas de Prendas
  "garment-template": {
    name: "Plantillas de prenda",
    icon: LayoutList,
  },

  // Cotizaciones
  quotation: {
    name: "Cotizaciones",
    icon: ClipboardList,
  },
  "quotation-item": {
    name: "Items de cotización",
    icon: ClipboardList,
  },

  // Órdenes de Pedido
  "purchase-order": {
    name: "Órdenes de compra",
    icon: ClipboardList,
  },
  specification: {
    name: "Especificaciones",
  },

  // Producción
  "production-assignment": {
    name: "Asignaciones de producción",
    icon: Factory,
  },
  "progress-history": {
    name: "Historial de progreso",
    icon: ListChecks,
  },

  // Pagos
  payment: {
    name: "Pagos",
    icon: HandCoins,
  },

  // Finanzas
  "account-receivable": {
    name: "Cuentas por cobrar",
    icon: ArrowDownCircle,
  },
  "account-payable": {
    name: "Cuentas por pagar",
    icon: ArrowUpCircle,
  },
  "account-type": {
    name: "Tipos de cuenta",
  },
  "chart-account": {
    name: "Plan de cuentas",
  },
  movement: {
    name: "Movimientos",
    icon: Repeat,
  },

  // Auditoría
  "audit-log": {
    name: "Registro de auditoría",
  },

  // Control de Medidas
  "measurement-control": {
    name: "Control de medidas",
    icon: PencilRuler,
  },
};

export const actionConfig: Record<ActionType, ActionConfig> = {
  // Acciones Base (para todos los módulos)
  read: {
    name: "Ver/Leer",
  },
  create: {
    name: "Crear",
  },
  update: {
    name: "Actualizar",
  },
  activate: {
    name: "Activar",
  },
  deactivate: {
    name: "Desactivar",
  },
  export: {
    name: "Exportar",
  },

  // Wildcard (permite todas las acciones de un recurso)
  "*": {
    name: "Todas las acciones",
  },
};

// Helper para iterar sobre objetos con tipos preservados
export function getResourceEntries(
  grouped: GroupedPermissions,
): Array<[ResourceType, Permission[]]> {
  return Object.entries(grouped) as Array<[ResourceType, Permission[]]>;
}

// Colores para las acciones (para badges y estilos)
export const actionColors: Record<string, string> = {
  read: "bg-blue-50 text-blue-700 border-blue-200",
  create: "bg-emerald-50 text-emerald-700 border-emerald-200",
  update: "bg-amber-50 text-amber-700 border-amber-200",
  activate: "bg-green-50 text-green-700 border-green-200",
  deactivate: "bg-red-50 text-red-700 border-red-200",
  export: "bg-purple-50 text-purple-700 border-purple-200",
  "*": "bg-purple-50 text-purple-700 border-purple-200",
};

// Función para traducir recursos
export function translateResource(resource: string | undefined | null): string {
  if (!resource) return "Recurso desconocido";
  return (
    resourceConfig[resource as keyof typeof resourceConfig]?.name || resource
  );
}

// Función para traducir acciones
export function translateAction(action: string | undefined | null): string {
  if (!action) return "Acción desconocida";
  const translated = actionConfig[action as keyof typeof actionConfig]?.name;
  return translated || action;
}

// Obtener icono del recurso
export function getResourceIcon(
  resource: string | undefined | null,
): LucideIcon {
  if (!resource) return Settings;
  const config = resourceConfig[resource as keyof typeof resourceConfig];
  return config?.icon || Settings;
}
