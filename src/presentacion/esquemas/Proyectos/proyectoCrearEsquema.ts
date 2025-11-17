import { z } from "zod";

export const ProyectoCrearEsquema = z
  .object({
    nombre: z
      .string()
      .nonempty("El nombre es obligatorio")
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(100, "El nombre no puede tener más de 100 caracteres"),

    descripcion: z
      .string()
      .nonempty("La descripción es obligatoria")
      .min(10, "La descripción debe tener al menos 10 caracteres")
      .max(255, "La descripción no puede tener más de 255 caracteres"),

    id_cliente: z
      .string()
      .uuid("El id_cliente debe tener formato UUID"),

    fecha_inicio: z
      .string()
      .nonempty("La fecha de inicio es obligatoria")
      .refine((fecha) => !isNaN(Date.parse(fecha)), {
        message: "La fecha de inicio debe tener un formato válido (YYYY-MM-DD)",
      }),

    fecha_entrega: z
      .string()
      .nonempty("La fecha de entrega es obligatoria")
      .refine((fecha) => !isNaN(Date.parse(fecha)), {
        message: "La fecha de entrega debe tener un formato válido (YYYY-MM-DD)",
      }),

    estado_proyecto: z
      .enum(["Creado", "En proceso", "Finalizado"])
      .default("Creado"),

    estado: z
      .enum(["Activo", "Eliminado"])
      .default("Activo"),
  })
  .refine(
    (data) => new Date(data.fecha_inicio) < new Date(data.fecha_entrega),
    {
      message: "La fecha de inicio debe ser anterior a la fecha de entrega",
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

export type ProyectoCrearDTO = z.infer<typeof ProyectoCrearEsquema>;
