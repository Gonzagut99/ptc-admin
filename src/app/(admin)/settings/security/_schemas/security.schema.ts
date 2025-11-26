import z from "zod";

export const securitySchema = z.object({
  currentPassword: z.string().min(1, {
    message: "La contraseña actual es requerida.",
  }),
  newPassword: z
    .string()
    .min(8, {
      message: "La contraseña debe tener al menos 8 caracteres.",
    })
    .regex(/[A-Z]/, {
      message: "La contraseña debe contener al menos una letra mayúscula.",
    })
    .regex(/[a-z]/, {
      message: "La contraseña debe contener al menos una letra minúscula.",
    })
    .regex(/\d/, {
      message: "La contraseña debe contener al menos un número.",
    })
    .regex(/[@$!%*?&_]/, {
      message:
        "La contraseña debe contener al menos un carácter especial (@$!%*?&_).",
    }),
  revokeOtherSessions: z.boolean(),
});

export type FormSecuritySchema = z.infer<typeof securitySchema>;
