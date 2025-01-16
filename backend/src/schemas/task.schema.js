import { date, z } from "zod";

export const createTaskSchema = z.object({
  title: z.string({
    required_error: "titulo es requerido",
  }),
  description: z.string({
    required_error: "description debe ser un string",
  }),
  date: z.string().datetime().optional(),
});
