import { string, z } from "zod";

export const TareaActualizarEsquema = z.object({
  titulo: z.string().optional(),
  descripcion: z.string().optional(),
  estado_tarea: z.enum(["Creada", "En Proceso", "Finalizada"]).optional(),
  prioridad: z.enum(["Baja", "Media", "Alta"]).optional(),
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
    

export type TareaActualizarDTO = z.infer<typeof TareaActualizarEsquema>;