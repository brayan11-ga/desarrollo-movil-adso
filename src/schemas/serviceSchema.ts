import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().trim().min(2, "Escribe un nombre de al menos 2 caracteres."),
  description: z.string().trim().optional(),
  category: z.string().trim().min(1, "Escribe la categoría del servicio."),
  price: z.coerce
    .number({ error: "Escribe un precio válido en números." })
    .positive("Escribe un precio mayor que cero."),
  duration: z.string().trim().min(1, "Escribe la duración del servicio."),
  image: z.string().trim().url("Escribe una URL de imagen válida.").or(z.literal("")).optional(),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;
