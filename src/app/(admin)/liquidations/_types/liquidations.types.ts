import { components } from "@/lib/api-java/api-java";

// Types del backend Java
export type DLiquidation = components["schemas"]["DLiquidation"];
export type LiquidationWithDetailsDto = components["schemas"]["LiquidationWithDetailsDto"];
export type CreateLiquidationDto = components["schemas"]["CreateLiquidationDto"];
export type PagedModelLiquidationWithDetailsDto = components["schemas"]["PagedModelLiquidationWithDetailsDto"];
export type PageMetadata = components["schemas"]["PageMetadata"];

// Servicios relacionados
export type DPayment = components["schemas"]["DPayment"];
export type DFlightService = components["schemas"]["DFlightService"];
export type DHotelService = components["schemas"]["DHotelService"];
export type DTourService = components["schemas"]["DTourService"];
export type DAdditionalServices = components["schemas"]["DAdditionalServices"];
export type DIncidency = components["schemas"]["DIncidency"];

// DTOs para agregar servicios
export type AddTourServiceDto = components["schemas"]["AddTourServiceDto"];
export type AddHotelServiceDto = components["schemas"]["AddHotelServiceDto"];
export type AddFlightServiceDto = components["schemas"]["AddFlightServiceDto"];
export type AddAdditionalServiceDto = components["schemas"]["AddAdditionalServiceDto"];
export type AddPaymentDto = components["schemas"]["AddPaymentDto"];
export type AddIncidencyDto = components["schemas"]["AddIncidencyDto"];

// Estados de liquidación
export const LIQUIDATION_STATUSES = [
  "IN_QUOTE",
  "PENDING",
  "ON_COURSE",
  "COMPLETED",
] as const;

export type LiquidationStatus = (typeof LIQUIDATION_STATUSES)[number];

export const LIQUIDATION_STATUS_LABELS: Record<LiquidationStatus, string> = {
  IN_QUOTE: "En cotización",
  PENDING: "Pendiente",
  ON_COURSE: "En curso",
  COMPLETED: "Completado",
};

export const LIQUIDATION_STATUS_COLORS: Record<LiquidationStatus, string> = {
  IN_QUOTE: "bg-blue-100 text-blue-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  ON_COURSE: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-green-100 text-green-800",
};

// Estados de pago
export const PAYMENT_STATUSES = ["PENDING", "ON_COURSE", "COMPLETED"] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Pendiente",
  ON_COURSE: "En curso",
  COMPLETED: "Completado",
};

// Métodos de pago
export const PAYMENT_METHODS = ["DEBIT", "CREDIT", "YAPE", "OTHER"] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  DEBIT: "Débito",
  CREDIT: "Crédito",
  YAPE: "Yape",
  OTHER: "Otro",
};

// Monedas
export const CURRENCIES = ["PEN", "USD"] as const;

export type Currency = (typeof CURRENCIES)[number];

export const CURRENCY_LABELS: Record<Currency, string> = {
  PEN: "Soles (PEN)",
  USD: "Dólares (USD)",
};
