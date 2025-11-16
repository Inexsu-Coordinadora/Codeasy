import { z } from "zod";

export const ConsultorActualizarEsquema = z.object({
  nombre: z.string().optional(),
  identificacion: z.string().optional(),
  correo: z.email().optional(),
  telefono: z.string().optional().transform((val) => val ?? null),
  especialidad: z.string().optional().transform((val) => val ?? null),
  nivel_experiencia: z.enum(["Junior", "Semi-Senior", "Senior", "Experto"]).optional(),
  
});

export type ConsultorActualizarDTO = z.infer<typeof ConsultorActualizarEsquema>;
