import { z } from "zod";

// Lista de tipos de documento (para evitar repetir)
const documentTypes = [
  "DNI",
  "RUC",
  "FOREIGNER_ID",
  "PASSPORT",
  "OTHER",
] as const;

// Schema de validación para crear trabajador
export const createWorkerSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),

  idDocumentType: z.enum(documentTypes).superRefine((value, ctx) => {
    if (!value) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Seleccione un tipo de documento.",
      });
    }
  }),

  idNumber: z.string().min(1, {
    message: "El número de documento es requerido.",
  }),

  email: z
    .string()
    .email({ message: "Email inválido." })
    .optional()
    .or(z.literal("")),

  phone: z.string().optional(),

  workshopId: z.string().min(1, {
    message: "El taller es requerido.",
  }),
});

// Schema de validación para editar trabajador
export const updateWorkerSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "El nombre debe tener al menos 2 caracteres.",
    })
    .optional(),

  idDocumentType: z.enum(documentTypes).optional(),

  idNumber: z
    .string()
    .min(1, {
      message: "El número de documento es requerido.",
    })
    .optional(),

  email: z
    .string()
    .email({ message: "Email inválido." })
    .optional()
    .or(z.literal("")),

  phone: z.string().optional(),

  workshopId: z.string().optional(),
});

export type CreateWorkerFormValues = z.infer<typeof createWorkerSchema>;
export type UpdateWorkerFormValues = z.infer<typeof updateWorkerSchema>;
