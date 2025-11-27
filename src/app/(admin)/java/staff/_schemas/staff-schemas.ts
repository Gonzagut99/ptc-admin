import { z } from "zod";

const roles = [
  "SALES",
  "COUNTER",
  "ACCOUNTING",
  "OPERATIONS",
  "SUPERADMIN",
  "SUPPORT",
] as const;

const currencies = ["PEN", "USD"] as const;

// Schema de validación para crear staff con usuario
// Nota: salary se maneja como string para compatibilidad con react-hook-form
// y se convierte a number en el onSubmit
export const createStaffWithUserSchema = z.object({
  email: z
    .string()
    .min(1, { message: "El email es requerido." })
    .email({ message: "Email inválido." }),

  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),

  userName: z.string().optional(),

  phoneNumber: z.string().min(1, {
    message: "El teléfono es requerido.",
  }),

  salary: z.string().min(1, { message: "El salario es requerido." }).refine(
    (val) => !Number.isNaN(Number(val)) && Number(val) >= 0,
    { message: "El salario debe ser un número mayor o igual a 0." }
  ),

  currency: z.enum(currencies, {
    message: "Seleccione una moneda.",
  }),

  role: z.enum(roles, {
    message: "Seleccione un rol.",
  }),

  hireDate: z.string().optional(),
});

// Schema de validación para crear solo staff (con userId existente)
export const createStaffSchema = z.object({
  userId: z.string().min(1, { message: "El usuario es requerido." }).refine(
    (val) => !Number.isNaN(Number(val)) && Number(val) >= 1,
    { message: "Seleccione un usuario válido." }
  ),

  phoneNumber: z.string().min(1, {
    message: "El teléfono es requerido.",
  }),

  salary: z.string().min(1, { message: "El salario es requerido." }).refine(
    (val) => !Number.isNaN(Number(val)) && Number(val) >= 0,
    { message: "El salario debe ser un número mayor o igual a 0." }
  ),

  currency: z.enum(currencies, {
    message: "Seleccione una moneda.",
  }),

  role: z.enum(roles, {
    message: "Seleccione un rol.",
  }),

  hireDate: z.string().optional(),
});

// Schema de validación para editar staff
export const updateStaffSchema = z.object({
  phoneNumber: z.string().optional(),

  salary: z.string().refine(
    (val) => val === "" || (!Number.isNaN(Number(val)) && Number(val) >= 0),
    { message: "El salario debe ser un número mayor o igual a 0." }
  ).optional(),

  currency: z.enum(currencies).optional(),

  role: z.enum(roles).optional(),

  hireDate: z.string().optional(),
});

export type CreateStaffWithUserFormValues = z.infer<
  typeof createStaffWithUserSchema
>;
export type CreateStaffFormValues = z.infer<typeof createStaffSchema>;
export type UpdateStaffFormValues = z.infer<typeof updateStaffSchema>;
