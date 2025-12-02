import { components } from "@/lib/api/types/api";

// =============================================================================
// TIPOS BASE (importados del API generado)
// =============================================================================
export type ResourceType = components["schemas"]["ResourceType"];
export type ActionType = components["schemas"]["ActionType"];

// =============================================================================
// RECURSOS (Resources) - PTC Perú Titicaca & Connections
// =============================================================================
// Mapeo de recursos basado en ResourceType del backend
export const ResourceTypeMap: Record<ResourceType, string> = {
  // Autenticación y RBAC
  user: "user",
  role: "role",

  // Clientes y Proveedores
  customer: "customer",
  supplier: "supplier",

  // Talleres y Trabajadores
  workshop: "workshop",
  worker: "worker",

  // Catálogos Base
  "garment-type": "garment-type",
  "garment-type-image": "garment-type-image",
  "material-type": "material-type",
  material: "material",
  unit: "unit",
  "action-type": "action-type",
  action: "action",
  size: "size",

  // Plantillas de Prendas
  "garment-template": "garment-template",

  // Cotizaciones
  quotation: "quotation",
  "quotation-item": "quotation-item",

  // Órdenes de Pedido
  "purchase-order": "purchase-order",
  specification: "specification",

  // Producción
  "production-assignment": "production-assignment",
  "progress-history": "progress-history",

  // Pagos
  payment: "payment",

  // Finanzas
  "account-receivable": "account-receivable",
  "account-payable": "account-payable",
  "account-type": "account-type",
  "chart-account": "chart-account",
  movement: "movement",

  // Auditoría
  "audit-log": "audit-log",

  // Control de Medidas
  "measurement-control": "measurement-control",
} as const;

// =============================================================================
// ACCIONES (Actions) - PTC Perú Titicaca & Connections
// =============================================================================
// Mapeo de acciones basado en ActionType del backend
export const ActionTypeMap: Record<ActionType, string> = {
  // Acciones Base (para todos los módulos)
  read: "read", // Ver/leer
  create: "create", // Crear
  update: "update", // Actualizar
  activate: "activate", // Activar
  deactivate: "deactivate", // Desactivar
  export: "export", // Exportar

  // Wildcard (permite todas las acciones de un recurso)
  "*": "*", // Ej: "user:*" permite todas las acciones de user
} as const;
