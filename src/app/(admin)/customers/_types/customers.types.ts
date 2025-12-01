import { components } from "@/lib/api-java/api-java";

// Types del backend Java
export type DCustomer = components["schemas"]["DCustomer"];
export type CreateCustomerDto = components["schemas"]["CreateCustomerDto"];
export type PagedModelDCustomer = components["schemas"]["PagedModelDCustomer"];
export type PageMetadata = components["schemas"]["PageMetadata"];

// Tipos de documento de identidad
export const ID_DOCUMENT_TYPES = [
  "PASSPORT",
  "DNI",
  "DRIVER_LICENSE",
  "RUC",
  "CE",
] as const;

export type IdDocumentType = (typeof ID_DOCUMENT_TYPES)[number];

// Labels para los tipos de documento
export const ID_DOCUMENT_TYPE_LABELS: Record<IdDocumentType, string> = {
  PASSPORT: "Pasaporte",
  DNI: "DNI",
  DRIVER_LICENSE: "Licencia de Conducir",
  RUC: "RUC",
  CE: "Carnet de Extranjería",
};
