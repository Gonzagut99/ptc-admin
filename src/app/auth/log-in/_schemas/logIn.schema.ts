import z from "zod";

export const logInSchema = z.object({
  email: z.email({
    message: "Ingresa una dirección de correo electrónico válida.",
  }).refine(
    (val) => val.length > 0,
    { message: "El correo electrónico es requerido." }
  ),
  password: z.string().min(8, {
    message: "La contraseña debe tener al menos 8 caracteres.",
  }),
  //remember: z.boolean().optional().default(true),
});

export type FormLogInSchema = z.infer<typeof logInSchema>;

/**
 * Tipo para enviar al backend (sin remember)
 */
export type LoginRequestBody = {
  email: string;
  password: string;
};
