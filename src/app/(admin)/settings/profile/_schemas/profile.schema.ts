import { isValidPhoneNumber } from "react-phone-number-input";
import z from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, {
    message: "Ingrese su nombre por favor.",
  }),
  lastName: z.string().min(2, {
    message: "Ingrese su apellido por favor.",
  }),
  phone: z
    .string()
    .optional()
    .refine((value) => {
      if (!value) return true;
      return isValidPhoneNumber(value);
    }, "El teléfono no es válido."),
  address: z.string().min(1, {
    message: "Ingrese su dirección por favor.",
  }),
});

export type FormProfileSchema = z.infer<typeof profileSchema>;
