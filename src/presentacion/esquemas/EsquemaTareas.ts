import { z } from "zod";

export const TareaCrearEsquema = z.object({
  titulo: z.string().nonempty("El título es obligatorio").min(3).max(100),
  descripcion: z.string().nonempty("La descripción es obligatoria").min(5).max(255),
  stateTask: z.enum(["Create", "Proceso", "Finalizado"]).default("Create"),
  prioridad: z.enum(["Baja", "Media", "Alta"]).default("Media"),
  fechaCreacion: z.date().optional(),
  fechaFinalizacion: z.date().optional(),
  asignadoA: z.string().nonempty("El asignado es obligatorio").max(100),
});

export const TareaActualizarEsquema = z.object({
  titulo: z.string().optional(),
  descripcion: z.string().optional(),
  stateTask: z.enum(["Create", "Proceso", "Finalizado"]).optional(),
  prioridad: z.enum(["Baja", "Media", "Alta"]).default("Media").optional(),
  fechaCreacion: z.date().optional(),
  fechaFinalizacion: z.date().optional(),
  asignadoA: z.string().optional(),
});
    
export type TareaCrearDTO = z.infer<typeof TareaCrearEsquema>;
export type TareaActualizarDTO = z.infer<typeof TareaActualizarEsquema>;