import { z } from "zod";

export const EquipoProyectoCrearEsquema = z
  .object({
    id_proyecto: z
      .string()
      .uuid("El id_proyecto debe tener formato UUID"),

    nombre: z
      .string()
      .nonempty("El nombre del equipo es obligatorio")
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(255, "El nombre no puede tener más de 255 caracteres"),

    fecha_inicio: z
      .string()
      .nonempty("La fecha de inicio es obligatoria")
      .refine((v) => !isNaN(Date.parse(v)), {
        message: "La fecha de inicio debe tener un formato válido (YYYY-MM-DD)",
      }),

    fecha_fin: z
      .string()
      .nonempty("La fecha de fin es obligatoria")
      .refine((v) => !isNaN(Date.parse(v)), {
        message: "La fecha de fin debe tener un formato válido (YYYY-MM-DD)",
      }),
  })
  .refine(
    (data) => new Date(data.fecha_fin) >= new Date(data.fecha_inicio),
    {
      message: "La fecha de fin debe ser igual o posterior a la fecha de inicio",
      path: ["fecha_fin"],
    }
  )
  .strict()
  .transform((data) => ({
    idProyecto: data.id_proyecto,
    nombre: data.nombre,
    fechaInicio: data.fecha_inicio,
    fechaFin: data.fecha_fin,
    estado: "Activo", // valor por defecto coherente con la BD
  }));

export type EquipoProyectoCrearDTO = z.infer<
  typeof EquipoProyectoCrearEsquema
>;
