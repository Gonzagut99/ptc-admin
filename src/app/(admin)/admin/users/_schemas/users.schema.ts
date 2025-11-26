import { isValidPhoneNumber } from "react-phone-number-input";
import z from "zod";

export const usersSchema = z.object({
  idNumber: z
    .string()
    .min(8, {
      message: "El número de documento debe tener al menos 8 caracteres.",
    })
    .max(8, {
      message: "El número de documento debe tener exactamente 8 caracteres.",
    })
    .regex(/^\d{8}$/, {
      message:
        "El número de documento debe contener solo números y tener exactamente 8 dígitos.",
    }),
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  lastName: z
    .string()
    .min(2, { message: "El apellido debe tener al menos 2 caracteres." }),
  email: z.string().email({ message: "El correo electrónico no es válido." }),
  phone: z.string().refine((value) => {
    return isValidPhoneNumber(value);
  }, "El teléfono no es válido."),
  address: z.string().min(1, { message: "La dirección es requerida." }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/,
      {
        message:
          "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (@$!%*?&_).",
      },
    ),
  roleIds: z.array(z.string()).min(1, { message: "El rol es requerido." }),
  post: z.string().min(1, { message: "El cargo es requerido." }),
  isActive: z.boolean().optional(),
});

export type FormUsersSchema = z.infer<typeof usersSchema>;
