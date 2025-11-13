import { z } from "zod";

export const ProyectoConsultarEsquema = z.object({
  estado: z.string().optional(),
  fechaInicio: z.string().optional(),
  fechaFin: z.string().optional(),
});
