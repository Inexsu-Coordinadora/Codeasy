import { z } from "zod";

export const ParteHoraCrearEsquema = z.object({
  id_proyecto: z.string().uuid("El ID del proyecto debe ser un UUID válido"),
  id_consultor: z.string().uuid("El ID del consultor debe ser un UUID válido"),
  fecha: z.string().or(z.date()).transform((val) => new Date(val)),
  cantidad_horas: z
    .number()
    .positive("Las horas deben ser mayores a 0")
    .max(24, "No puede superar 24 horas por día"),
  descripcion: z.string().min(1, "La descripción es requerida").max(255),
});

export type ParteHoraCrearDTO = z.infer<typeof ParteHoraCrearEsquema>;