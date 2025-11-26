import z from "zod";

export const emailSchema = z.object({
  newEmail: z.string().min(2, {
    message: "El correo electrónico debe tener al menos 2 caracteres.",
  }),
});

export type FormEmailSchema = z.infer<typeof emailSchema>;
