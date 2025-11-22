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
      .uuid("El id_cliente debe tener formato UUID")
      .optional(),

    fecha_inicio: z
      .string()
      .refine((fecha) => !isNaN(Date.parse(fecha)), {
        message: "La fecha de inicio debe tener un formato válido (YYYY-MM-DD)",
      })
      .optional(),

    fecha_entrega: z
      .string()
      .refine((fecha) => !isNaN(Date.parse(fecha)), {
        message: "La fecha de entrega debe tener un formato válido (YYYY-MM-DD)",
      })
      .optional(),

    estado_proyecto: z
      .enum(["Creado", "En proceso", "Finalizado"])
      .optional(),

    estado: z
      .enum(["Activo", "Eliminado"])
      .optional(),
  })
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
  .strict()
  .transform((data) => ({
    nombre: data.nombre,
    descripcion: data.descripcion,
    idCliente: data.id_cliente,
    fechaInicio: data.fecha_inicio,
    fechaEntrega: data.fecha_entrega,
    estadoProyecto: data.estado_proyecto,
    estado: data.estado,
  }));

export type ProyectoActualizarDTO = z.infer<typeof ProyectoActualizarEsquema>;
