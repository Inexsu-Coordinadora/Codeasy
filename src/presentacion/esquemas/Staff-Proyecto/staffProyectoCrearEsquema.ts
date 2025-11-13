import { z } from "zod";

export const StaffProyectoCrearEsquema = z
  .object({
    id_consultor: z
      .string()
      .nonempty("El id_consultor es obligatorio")
      .uuid("El id_consultor debe tener formato UUID"),

    id_rol: z
      .string()
      .uuid("El id_rol debe tener formato UUID")
      .optional(),

    porcentaje_dedicacion: z
    .number()
    .min(0, "El porcentaje no puede ser menor a 0")
    .max(100, "El porcentaje no puede ser mayor a 100")
    .refine((val) => !isNaN(val), {
        message: "El porcentaje de dedicación debe ser numérico",
    }),

    fecha_inicio: z
      .string()
      .nonempty("La fecha de inicio es obligatoria")
      .refine((fecha) => !isNaN(Date.parse(fecha)), {
        message: "La fecha de inicio debe tener un formato válido (YYYY-MM-DD)",
      }),

    fecha_fin: z
      .string()
      .nonempty("La fecha de fin es obligatoria")
      .refine((fecha) => !isNaN(Date.parse(fecha)), {
        message: "La fecha de fin debe tener un formato válido (YYYY-MM-DD)",
      }),
  })
  .refine(
    (data) => new Date(data.fecha_inicio) <= new Date(data.fecha_fin),
    {
      message: "La fecha de fin debe ser posterior o igual a la fecha de inicio",
      path: ["fecha_fin"],
    }
  )
  .strict();

export type StaffProyectoCrearDTO = z.infer<typeof StaffProyectoCrearEsquema>;
