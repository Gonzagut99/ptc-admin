import z from "zod";

export const logInSchema = z.object({
  email: z.string().email({
    message: "Ingresa una dirección de correo electrónico válida.",
  }),
  password: z.string().min(8, {
    message: "La contraseña debe tener al menos 8 caracteres.",
  }),
  remember: z.boolean(),
});

export type FormLogInSchema = z.infer<typeof logInSchema>;
