import z from "zod";

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, {
      message: "La contraseña debe tener al menos 8 caracteres.",
    }),
    confirmPassword: z.string().min(8, {
      message: "La contraseña debe tener al menos 8 caracteres.",
    }),
    token: z.string().min(1, {
      message: "Token de recuperación inválido.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export type FormResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
