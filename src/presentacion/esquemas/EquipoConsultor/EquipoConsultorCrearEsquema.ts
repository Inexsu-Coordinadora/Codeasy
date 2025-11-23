import { z } from "zod";

export const EquipoConsultorCrearEsquema = z
  .object({
    id_consultor: z
      .string()
      .uuid("El id_consultor debe tener formato UUID"),

    id_equipo_proyecto: z
      .string()
      .uuid("El id_equipo_proyecto debe tener formato UUID"),

    id_rol: z
      .string()
      .uuid("El id_rol debe tener formato UUID"),

    porcentaje_dedicacion: z
      .number()
      .int()
      .min(1, "El porcentaje de dedicación debe ser al menos 1%")
      .max(100, "El porcentaje de dedicación no puede exceder 100%"),

    fecha_inicio: z
      .string()
      .refine((f) => !isNaN(Date.parse(f)), {
        message: "La fecha_inicio no tiene un formato válido (YYYY-MM-DD)",
      }),

    fecha_fin: z
      .string()
      .refine((f) => !isNaN(Date.parse(f)), {
        message: "La fecha_fin no tiene un formato válido (YYYY-MM-DD)",
      }),
  })
  .refine(
    (data) => new Date(data.fecha_inicio) <= new Date(data.fecha_fin),
    {
      message: "La fecha_fin debe ser posterior o igual a la fecha_inicio",
      path: ["fecha_fin"],
    }
  )
  .strict()
  .transform((data) => ({
    idConsultor: data.id_consultor,
    idEquipoProyecto: data.id_equipo_proyecto,
    idRol: data.id_rol,
    porcentajeDedicacion: data.porcentaje_dedicacion,
    fechaInicio: data.fecha_inicio,
    fechaFin: data.fecha_fin,
    estado: "Activo"
  }));

export type EquipoConsultorCrearEsquemaDTO = z.infer<typeof EquipoConsultorCrearEsquema>;
