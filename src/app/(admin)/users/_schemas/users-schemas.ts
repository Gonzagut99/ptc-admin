import { z } from "zod";

// Schema de validación para crear usuario
export const createUserSchema = z.object({
  email: z
    .string()
    .min(1, { message: "El email es requerido." })
    .email({ message: "Email inválido." }),

  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),

  userName: z.string().optional(),
});

// Schema de validación para editar usuario
export const updateUserSchema = z.object({
  email: z
    .string()
    .email({ message: "Email inválido." })
    .optional(),

  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres." })
    .optional(),

  userName: z.string().optional(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
