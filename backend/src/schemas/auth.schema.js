import { z } from "zod";

export const registerSchema = z.object({
  username: z.string({
    required_error: "nombre de usuario es requerido",
  }),
  email: z
    .string({
      required_error: "se requiere correo electronico",
    })
    .email({
      message: "correo invalido",
    }),
  password: z
    .string({
      required_error: "contraseña es requerida",
    })
    .min(6, {
      message: "la contraseña debe tener como minimo 6 caracteres",
    }),
});

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "se requiere correo electronico",
    })
    .email({
      message: "correo invalido",
    }),
  password: z
    .string({
      required_error: "contraseña es requerida",
    })
    .min(6, {
      message: "la contraseña debe tener como minimo 6 caracteres",
    }),
});
