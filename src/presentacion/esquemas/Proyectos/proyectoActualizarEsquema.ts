import { z } from "zod";

export const ProyectoActualizarEsquema = z
  .object({
    nombre: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(100, "El nombre no puede tener más de 100 caracteres")
      .optional(),

    descripcion: z
      .string()
      .min(10, "La descripción debe tener al menos 10 caracteres")
      .max(255, "La descripción no puede tener más de 255 caracteres")
      .optional(),

    id_cliente: z
    .string()
    .uuid("El id_cliente debe tener formato UUID"),

    fecha_inicio: z
      .string()
      .refine((fecha) => !isNaN(Date.parse(fecha)), {
        message: "La fecha de inicio debe tener un formato válido (YYYY-MM-DD)",
      })
      .refine((fecha) => {
        const hoy = new Date();
        const inicio = new Date(fecha);
        hoy.setHours(0, 0, 0, 0);
        inicio.setHours(0, 0, 0, 0);
        return inicio >= hoy;
      }, { message: "La fecha de inicio no puede ser anterior a la fecha actual" })
      .optional(),

    fecha_entrega: z
      .string()
      .refine((fecha) => !isNaN(Date.parse(fecha)), {
        message: "La fecha de entrega debe tener un formato válido (YYYY-MM-DD)",
      })
      .optional(),

    estado_proyecto: z.enum(["Creado", "En proceso", "Finalizado"]).optional(),

    estado: z.enum(["Activo", "Eliminado"]).optional(),
  })
  // Validar coherencia: si hay ambas fechas, entrega > inicio
  .refine(
    (data) =>
      !data.fecha_inicio ||
      !data.fecha_entrega ||
      new Date(data.fecha_entrega) > new Date(data.fecha_inicio),
    {
      message: "La fecha de entrega debe ser posterior a la fecha de inicio",
      path: ["fecha_entrega"],
    }
  )
  .strict();

export type ProyectoActualizarDTO = z.infer<typeof ProyectoActualizarEsquema>;