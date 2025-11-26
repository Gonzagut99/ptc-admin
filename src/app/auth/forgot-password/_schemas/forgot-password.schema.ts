import z from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Ingresa una dirección de correo electrónico válida.",
  }),
});

export type FormForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
