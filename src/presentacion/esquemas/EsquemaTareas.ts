import { string, z } from "zod";

export const TareaCrearEsquema = z.object({
  titulo: z.string().nonempty("El título es obligatorio").min(3).max(100),
  descripcion: z.string().nonempty("La descripción es obligatoria").min(5).max(255),
  estadoTarea: z.enum(["Creada", "En Proceso", "Finalizada"]).default("Creada"),
  prioridad: z.enum(["Baja", "Media", "Alta"]).default("Media"),
  fechaFinalizacion: z.string()
  .regex(/^\d{1,2}\/\d{1,2}\/\d{4}$/, "Formato debe ser DD/MM/YYYY")
  .transform((val) => {
    const partes = val.split('/');
    if (partes.length !== 3) throw new Error("Formato de fecha inválido");
    return new Date(parseInt(partes[2]!), parseInt(partes[1]!) - 1, parseInt(partes[0]!));
  })
  .refine((date) => !isNaN(date.getTime()), "Fecha inválida")
  .optional(),
  asignadoA: z.string().nonempty("El asignado es obligatorio").max(100),
});

export const TareaActualizarEsquema = z.object({
  titulo: z.string().optional(),
  descripcion: z.string().optional(),
  estadoTarea: z.enum(["Creada", "En Proceso", "Finalizada"]).optional(),
  prioridad: z.enum(["Baja", "Media", "Alta"]).default("Media").optional(),
  fechaFinalizacion: z.string()
  .regex(/^\d{1,2}\/\d{1,2}\/\d{4}$/, "Formato debe ser DD/MM/YYYY")
  .transform((val) => {
    const partes = val.split('/');
    if (partes.length !== 3) throw new Error("Formato de fecha inválido");
    return new Date(parseInt(partes[2]!), parseInt(partes[1]!) - 1, parseInt(partes[0]!));
  })
  .refine((date) => !isNaN(date.getTime()), "Fecha inválida")
  .optional(),
  asignadoA: z.string().optional(),
});
    
export type TareaCrearDTO = z.infer<typeof TareaCrearEsquema>;
export type TareaActualizarDTO = z.infer<typeof TareaActualizarEsquema>;