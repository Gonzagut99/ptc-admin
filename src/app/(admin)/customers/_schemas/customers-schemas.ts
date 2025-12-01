import { z } from "zod";

const documentTypes = [
  "PASSPORT",
  "DNI",
  "DRIVER_LICENSE",
  "RUC",
  "CE",
] as const;

// Schema de validación para crear cliente
export const createCustomerSchema = z.object({
  firstName: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),

  lastName: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres.",
  }),

  email: z
    .string()
    .email({ message: "Email inválido." })
    .optional()
    .or(z.literal("")),

  phoneNumber: z.string().optional(),

  birthDate: z.string().min(1, {
    message: "La fecha de nacimiento es requerida.",
  }),

  idDocumentType: z.enum(documentTypes, {
    message: "Seleccione un tipo de documento.",
  }),

  idDocumentNumber: z.string().min(1, {
    message: "El número de documento es requerido.",
  }),

  address: z.string().optional(),

  nationality: z.string().optional(),
});

// Schema de validación para editar cliente
export const updateCustomerSchema = z.object({
  firstName: z
    .string()
    .min(2, {
      message: "El nombre debe tener al menos 2 caracteres.",
    })
    .optional(),

  lastName: z
    .string()
    .min(2, {
      message: "El apellido debe tener al menos 2 caracteres.",
    })
    .optional(),

  email: z
    .string()
    .email({ message: "Email inválido." })
    .optional()
    .or(z.literal("")),

  phoneNumber: z.string().optional(),

  birthDate: z.string().optional(),

  idDocumentType: z.enum(documentTypes).optional(),

  idDocumentNumber: z.string().optional(),

  address: z.string().optional(),

  nationality: z.string().optional(),
});

export type CreateCustomerFormValues = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerFormValues = z.infer<typeof updateCustomerSchema>;
