import * as z from "zod";

export const workshopCreateSchema = z.object({
  // Campos que se envían al backend
  name: z.string().min(3, {
    message: "Nombre del taller debe tener al menos 3 caracteres.",
  }),
  idDocumentType: z.enum(["RUC", "DNI"]),
  idNumber: z.string().min(8, {
    message: "Número de documento debe tener al menos 8 caracteres.",
  }),
  // Campos solo para UI (no se envían al backend por ahora)
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  phone2: z.string().optional(),
  email: z
    .string()
    .email("Correo electrónico inválido")
    .optional()
    .or(z.literal("")),
});

export type WorkshopCreateFormValues = z.infer<typeof workshopCreateSchema>;
