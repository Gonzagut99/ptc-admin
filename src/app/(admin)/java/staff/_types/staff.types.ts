import { components } from "@/lib/api-java/api-java";

// Types del backend Java
export type DStaff = components["schemas"]["DStaff"];
export type DUser = components["schemas"]["DUser"];
export type CreateStaffDto = components["schemas"]["CreateStaffDto"];
export type CreateUserWithStaffDto = components["schemas"]["CreateUserWithStaffDto"];
export type PagedModelDStaff = components["schemas"]["PagedModelDStaff"];
export type PageMetadata = components["schemas"]["PageMetadata"];

// Roles del personal
export const STAFF_ROLES = [
  "SALES",
  "COUNTER",
  "ACCOUNTING",
  "OPERATIONS",
  "SUPERADMIN",
  "SUPPORT",
] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

// Labels para los roles
export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  SALES: "Ventas",
  COUNTER: "Counter",
  ACCOUNTING: "Contabilidad",
  OPERATIONS: "Operaciones",
  SUPERADMIN: "Super Admin",
  SUPPORT: "Soporte",
};

// Monedas
export const CURRENCIES = ["PEN", "USD"] as const;

export type Currency = (typeof CURRENCIES)[number];

export const CURRENCY_LABELS: Record<Currency, string> = {
  PEN: "PEN (S/)",
  USD: "USD ($)",
};
