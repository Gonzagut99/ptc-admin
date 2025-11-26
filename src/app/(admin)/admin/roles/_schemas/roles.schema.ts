import z from "zod";

export const rolesSchema = z.object({
  name: z.string().min(2, {
    message: "Nombre del rol debe tener al menos 2 caracteres.",
  }),
  description: z.string().optional(),
  isDefault: z.boolean(),
  permissionIds: z.array(z.string()),
});

export type FormRolesSchema = z.infer<typeof rolesSchema>;
